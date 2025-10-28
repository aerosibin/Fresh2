import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mood to tag mapping (business logic)
const MOOD_TO_TAG_MAP: Record<string, string[]> = {
  'lazy': ['lazy-meal', 'quick-prep', 'frozen', 'microwaveable'],
  'festive': ['festive-food', 'party-size', 'sweets', 'drinks', 'bakery'],
  'health-focused': ['healthy', 'fresh-produce', 'organic', 'vegan', 'low-sugar'],
  'tired': ['snack', 'sweets', 'quick-prep', 'coffee', 'energy-drink']
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { mood, user_id, top_n = 10 } = await req.json();

    console.log(`[Mood Recommendations] Request: user_id=${user_id}, mood=${mood}, top_n=${top_n}`);

    // Validate mood
    if (!MOOD_TO_TAG_MAP[mood]) {
      return new Response(
        JSON.stringify({ error: `Invalid mood. Valid moods: ${Object.keys(MOOD_TO_TAG_MAP).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Get products matching mood tags
    const moodTags = MOOD_TO_TAG_MAP[mood];
    console.log(`[Step 1] Fetching products with tags: ${moodTags.join(', ')}`);
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .contains('tags', moodTags)
      .eq('in_stock', true);

    if (productsError) {
      console.error('[Error] Failed to fetch products:', productsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch products' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Step 1] Found ${products.length} products matching mood`);

    // Step 2: Get user's purchase history (if user_id provided)
    let userAffinityMap: Record<string, number> = {};
    
    if (user_id) {
      console.log(`[Step 2] Fetching purchase history for user ${user_id}`);
      
      const { data: purchaseHistory, error: historyError } = await supabase
        .from('purchase_history')
        .select('product_id')
        .eq('user_id', user_id);

      if (historyError) {
        console.error('[Warning] Failed to fetch purchase history:', historyError);
      } else {
        // Calculate purchase frequency
        purchaseHistory?.forEach((purchase: any) => {
          userAffinityMap[purchase.product_id] = (userAffinityMap[purchase.product_id] || 0) + 1;
        });
        console.log(`[Step 2] Loaded affinity scores for ${Object.keys(userAffinityMap).length} products`);
      }
    } else {
      console.log(`[Step 2] No user_id provided, skipping personalization`);
    }

    // Step 3: Personalized re-ranking
    const scoredProducts = products.map((product: any) => ({
      ...product,
      affinity_score: userAffinityMap[product.id] || 0.1, // Discovery score for new items
    }));

    // Sort by affinity score (descending)
    scoredProducts.sort((a, b) => b.affinity_score - a.affinity_score);

    console.log(`[Step 3] Re-ranked ${scoredProducts.length} products by affinity`);

    // Step 4: Return top N recommendations
    const recommendations = scoredProducts.slice(0, top_n);

    console.log(`[Success] Returning ${recommendations.length} recommendations`);

    return new Response(
      JSON.stringify({ 
        mood, 
        recommendations,
        total_matched: products.length,
        is_personalized: user_id ? true : false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Error] Mood recommendations function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
