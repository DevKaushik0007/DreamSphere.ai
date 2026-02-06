import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claims.claims.sub;
    console.log("Authenticated user:", userId);

    const { prompt, mood, style } = await req.json();
    
    // Input validation
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof prompt !== 'string' || prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Prompt must be a string with maximum 2000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mood && (typeof mood !== 'string' || mood.length > 50)) {
      return new Response(
        JSON.stringify({ error: "Mood must be a string with maximum 50 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (style && (typeof style !== 'string' || style.length > 50)) {
      return new Response(
        JSON.stringify({ error: "Style must be a string with maximum 50 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build an enhanced prompt based on mood and style
    const moodStyles: Record<string, string> = {
      Happy: "bright, warm colors, golden light, joyful atmosphere, uplifting energy",
      Calm: "serene, peaceful, soft blues and greens, tranquil, meditative",
      Creative: "bold colors, abstract patterns, artistic, imaginative, vibrant",
      Peaceful: "nature-inspired, zen garden, soft lighting, harmonious, balanced",
      Romantic: "soft pinks, dreamy, ethereal, tender, gentle gradients, sunset tones",
      Excited: "dynamic, energetic, vivid colors, movement, electric, passionate",
      Sad: "muted tones, melancholic, rainy, introspective, contemplative blues",
      Anxious: "swirling patterns, tension, contrast, stormy, deep shadows",
    };

    const styleModifiers: Record<string, string> = {
      Dreamy: "dreamlike, soft focus, ethereal glow, fantasy atmosphere",
      Surreal: "surrealist art style, Salvador Dali inspired, impossible geometry",
      Minimal: "minimalist, clean lines, simple composition, negative space",
      Vibrant: "highly saturated, bold contrasts, pop art influence",
      Dark: "dark aesthetic, moody shadows, noir style, dramatic lighting",
      Nature: "organic, natural elements, botanical, earth tones",
    };

    const moodModifier = moodStyles[mood] || "artistic and creative";
    const styleModifier = styleModifiers[style] || "beautiful and detailed";

    const enhancedPrompt = `Create a stunning digital artwork: ${prompt}. 
Style characteristics: ${moodModifier}. 
Artistic style: ${styleModifier}. 
High quality, professional digital art, 4K resolution, highly detailed.`;

    console.log("Generating image for user:", userId, "with enhanced prompt:", enhancedPrompt.substring(0, 100) + "...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI gateway response received for user:", userId);

    // Extract the image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "No image generated", details: textContent }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        description: textContent,
        prompt: enhancedPrompt,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while generating your image. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
