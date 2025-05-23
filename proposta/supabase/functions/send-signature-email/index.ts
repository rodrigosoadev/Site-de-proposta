
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get request body
    const { signatoryId, resend = false } = await req.json();

    if (!signatoryId) {
      return new Response(
        JSON.stringify({ error: "Signatory ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get signatory information
    const { data: signatory, error: signatoryError } = await supabaseClient
      .from("signatories")
      .select("*, signature_requests(*, created_by)")
      .eq("id", signatoryId)
      .single();

    if (signatoryError || !signatory) {
      return new Response(
        JSON.stringify({ error: "Signatory not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get sender information
    const { data: sender, error: senderError } = await supabaseClient
      .from("profiles")
      .select("name, company_name")
      .eq("id", signatory.signature_requests.created_by)
      .single();

    if (senderError) {
      console.error("Error fetching sender information:", senderError);
    }

    // Get contract information
    const { data: contract, error: contractError } = await supabaseClient
      .from("contracts")
      .select("*, proposals(client_name, description)")
      .eq("id", signatory.signature_requests.contract_id)
      .single();

    if (contractError || !contract) {
      return new Response(
        JSON.stringify({ error: "Contract not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate signature URL
    const baseUrl = Deno.env.get("APP_URL") || "https://propostapro.lovable.app";
    const signatureUrl = `${baseUrl}/assinatura/${signatory.verification_token}`;

    // Send email using your email service of choice
    // This is a placeholder for actual email sending logic
    // In a production environment, you would integrate with a service like Resend, SendGrid, etc.
    console.log(`Sending signature request email to ${signatory.email}`);
    console.log(`Signature URL: ${signatureUrl}`);
    
 
    await supabaseClient
      .from("audit_events")
      .insert({
        signature_request_id: signatory.signature_requests.id,
        signatory_id: signatoryId,
        event_type: resend ? "signature_email_resent" : "signature_email_sent",
        event_data: { email: signatory.email },
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email notification sent (mock)",
        signatureUrl
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-signature-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
