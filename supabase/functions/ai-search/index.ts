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

    const { query, mood } = await req.json();

    // Input validation
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof query !== 'string' || query.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Query must be a string with maximum 500 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (mood && (typeof mood !== 'string' || mood.length > 50)) {
      return new Response(
        JSON.stringify({ error: 'Mood must be a string with maximum 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an AI search engine for DreamSphere.AI. Generate realistic mock search results for the query provided. 
Your response MUST be valid JSON with this exact structure:
{
  "summary": {
    "overview": "A 2-3 sentence summary of the topic",
    "keyInsights": ["insight 1", "insight 2", "insight 3"],
    "emotionalTone": "The overall emotional tone (positive/neutral/reflective/inspiring)",
    "actionableTips": ["tip 1", "tip 2", "tip 3"]
  },
  "google": [
    {"title": "Article title", "url": "https://example.com/article", "snippet": "Brief description...", "source": "Website Name", "date": "2024"}
  ],
  "youtube": [
    {"title": "Video title", "channelName": "Channel Name", "views": "1.2M views", "duration": "10:25", "thumbnail": "gradient", "publishedAt": "2 weeks ago"}
  ],
  "twitter": [
    {"username": "username", "displayName": "Display Name", "content": "Tweet content...", "likes": 1234, "retweets": 456, "time": "2h ago", "verified": true}
  ],
  "instagram": [
    {"username": "username", "caption": "Caption text...", "likes": "12.3K", "gradient": "from-pink-500 to-purple-600"}
  ],
  "shorts": [
    {"title": "Short title", "channelName": "Channel", "views": "500K views", "gradient": "from-red-500 to-orange-500"}
   ],
   "linkedin": [
     {"name": "Person Name", "headline": "Job Title at Company", "location": "City, Country", "connectionDegree": "2nd", "mutualConnections": 12, "isHiring": true, "postType": "job"}
   ]
}

Generate 4-5 items for each platform. Make them realistic, relevant to the query, and engaging.
 For LinkedIn, generate job posts, professional profiles, and career-related content especially if the query is about jobs, careers, placements, or professional topics.
${mood ? `The user's current mood is: ${mood}. Tailor results to be supportive of this emotional state.` : ''}`;

    console.log("Performing AI search for user:", userId, "query:", query.substring(0, 50) + "...");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate comprehensive search results for: "${query}"` }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
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
    let results;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      results = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      // Return a fallback structure
      results = {
        summary: {
          overview: `Here's what we found about "${query}"`,
          keyInsights: ["Exploring this topic reveals interesting perspectives", "Multiple sources discuss this subject", "Community engagement is active"],
          emotionalTone: "informative",
          actionableTips: ["Research more about this topic", "Connect with communities", "Stay updated on developments"]
        },
        google: [],
        youtube: [],
        twitter: [],
        instagram: [],
        shorts: []
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        query,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in ai-search function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your search. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
