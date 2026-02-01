import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (!RESEND_API_KEY) {
            throw new Error("Missing RESEND_API_KEY environment variable");
        }

        const resend = new Resend(RESEND_API_KEY);
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            {
                global: { headers: { Authorization: req.headers.get("Authorization")! } },
            }
        );

        const { orderId } = await req.json();

        if (!orderId) {
            throw new Error("Missing orderId");
        }

        // Fetch order
        const { data: order, error: orderError } = await supabaseClient
            .from("orders")
            .select("*, items(*)")
            .eq("id", orderId)
            .single();

        if (orderError || !order) throw new Error("Order not found");

        // Send Email
        const { data, error } = await resend.emails.send({
            from: "E-Book Store <onboarding@resend.dev>", // หรือใส่ domain ของคุณที่ verify แล้ว
            to: [order.customer_email],
            subject: "ยืนยันการสั่งซื้อ E-Book",
            html: "<p>ขอบคุณที่สั่งซื้อ! (ระบบ Demo)</p>"
        });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
