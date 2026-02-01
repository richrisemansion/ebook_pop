# วิธีแก้ไขปัญหา "ส่งอีเมลไม่ได้" (Manual Fix for Email)

เนื่องจากระบบ Deploy อัตโนมัติขัดข้อง ให้ทำตามขั้นตอนต่อไปนี้เพื่อเปิดใช้งานระบบส่งอีเมลครับ

## 1. ตั้งค่า API Key ใน Supabase Dashboard

1.  ไปที่ [Supabase Dashboard](https://supabase.com/dashboard/project/hwzjgutvafvmxztxydnt)
2.  เมนูซ้ายมือ เลือก **Edge Functions**
3.  คลิกที่ฟังก์ชัน **`send-order-email`** (ถ้าไม่มี ให้ข้ามไปข้อ 2 เพื่อสร้างใหม่)
4.  ไปที่แถบ **Secrets** (หรือ Manage Secrets)
5.  กด **Add new secret**
    *   **Name:** `RESEND_API_KEY`
    *   **Value:** (ใส่ API Key จาก [Resend.com](https://resend.com) ของคุณ)
6.  กด **Save**

> **หมายเหตุ:** ต้องใช้ API Key จริงจาก Resend นะครับ ถ้าใช้ Key มั่วจะส่งไม่ออก

## 2. Deploy Function (ถ้ายังไม่มี หรือพัง)

ถ้าฟังก์ชัน `send-order-email` ไม่มีอยู่ หรือทำงานผิดพลาด ให้ Deploy ใหม่ผ่าน Terminal ใน VS Code:

1.  เปิด Terminal แล้วรันคำสั่ง:
    ```bash
    npx supabase functions deploy send-order-email --no-verify-jwt
    ```
2.  (ถ้ามันถาม Project ID ให้เลือก `hwzjgutvafvmxztxydnt`)

## 3. ตรวจสอบ Code (index.ts)

ตรวจสอบไฟล์ `supabase/functions/send-order-email/index.ts` ว่ามี Code ดังนี้:

```typescript
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
```

## 4. ทดสอบอีกครั้ง
กลับไปที่หน้า Admin แล้วลองกดปุ่ม **"ส่ง PDF ซ้ำ"** ดูอีกทีครับ
