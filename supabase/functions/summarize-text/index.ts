import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      console.error("Auth validation failed:", claimsError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claims.claims.sub;
    console.log("Authenticated user:", userId);

    const { text, style } = await req.json();

    // Input validation
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (text.length < 50) {
      return new Response(
        JSON.stringify({ error: 'Please provide at least 50 characters to summarize' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (text.length > 50000) {
      return new Response(
        JSON.stringify({ error: 'Text must be less than 50000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (style && (typeof style !== 'string' || style.length > 50)) {
      return new Response(
        JSON.stringify({ error: 'Style must be a string with maximum 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const styleInstructions: Record<string, string> = {
      concise: "Create a brief, bullet-point summary. Focus on key facts only.",
      detailed: "Create a comprehensive summary with context and nuance. Include important details.",
      eli5: "Explain it like I'm 5 years old. Use simple language and analogies.",
      professional: "Create a professional executive summary suitable for business contexts.",
      creative: "Summarize in an engaging, creative way with vivid language."
    };

    const selectedStyle = styleInstructions[style as keyof typeof styleInstructions] || styleInstructions.concise;

    const systemPrompt = `You are an expert text summarizer for DreamSphere.AI. Your task is to create clear, accurate summaries of content.

${selectedStyle}

Your response MUST be valid JSON with this exact structure:
{
  "summary": "The main summary text",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "wordCount": {
    "original": number,
    "summary": number
  },
  "tone": "The detected tone of the original text (e.g., formal, casual, technical)",
  "topics": ["Main topic 1", "Main topic 2"]
}

Be accurate and preserve the meaning of the original text.`;

    console.log("Summarizing text for user:", userId, "length:", text.length, "style:", style || "concise");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please summarize the following text:\n\n${text}` }
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON from the AI response
    let result;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      // Fallback: treat the entire response as the summary
      const wordCountOriginal = text.split(/\s+/).length;
      const summaryText = content.replace(/```[\s\S]*?```/g, '').trim();
      result = {
        summary: summaryText || "Unable to generate summary. Please try again.",
        keyPoints: [],
        wordCount: {
          original: wordCountOriginal,
          summary: summaryText.split(/\s+/).length
        },
        tone: "unknown",
        topics: []
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in summarize-text function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while summarizing your text. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
