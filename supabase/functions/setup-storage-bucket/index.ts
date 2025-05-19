
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a Supabase client with the admin key
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if storage bucket exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin
      .storage
      .listBuckets();
    
    if (bucketsError) {
      throw new Error(`Error checking buckets: ${bucketsError.message}`);
    }

    let documentsBucketExists = false;
    for (const bucket of buckets) {
      if (bucket.name === "documents") {
        documentsBucketExists = true;
        break;
      }
    }

    // Create documents bucket if it doesn't exist
    if (!documentsBucketExists) {
      const { error: createError } = await supabaseAdmin
        .storage
        .createBucket("documents", {
          public: true, // Make files publicly accessible
          fileSizeLimit: 10485760, // Limit to 10MB per file
        });
      
      if (createError) {
        throw new Error(`Error creating bucket: ${createError.message}`);
      }

      // Set up bucket policy to allow public read access
      const { error: policyError } = await supabaseAdmin
        .rpc('create_storage_policy', {
          bucket_name: 'documents',
          policy_name: 'Public Read Access',
          definition: {
            name: 'Public Access',
            allow_download: true,
          }
        });

      if (policyError) {
        console.error("Error setting bucket policy:", policyError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: documentsBucketExists ? "Documents bucket already exists" : "Documents bucket created" 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in setup-storage-bucket function:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
