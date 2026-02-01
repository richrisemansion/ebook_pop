import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')!;

interface OrderNotification {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    itemCount: number;
    slipImageUrl?: string;
}

async function sendTelegramMessage(text: string, replyMarkup?: object) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const body: any = {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
    };
    if (replyMarkup) {
        body.reply_markup = replyMarkup;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return response.json();
}

async function sendTelegramPhoto(photoUrl: string, caption: string, replyMarkup?: object) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
    const body: any = {
        chat_id: TELEGRAM_CHAT_ID,
        photo: photoUrl,
        caption,
        parse_mode: 'HTML',
    };
    if (replyMarkup) {
        body.reply_markup = replyMarkup;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return response.json();
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const order: OrderNotification = await req.json();

        const message = `
🛒 <b>ออเดอร์ใหม่!</b>

📋 <b>หมายเลข:</b> ${order.orderNumber}
👤 <b>ลูกค้า:</b> ${order.customerName}
📧 <b>อีเมล:</b> ${order.customerEmail}
📱 <b>โทร:</b> ${order.customerPhone}
💰 <b>ยอดรวม:</b> ฿${order.totalAmount.toLocaleString()}
📚 <b>จำนวน:</b> ${order.itemCount} เล่ม

⏰ รอตรวจสอบสลิปโอนเงิน
    `.trim();

        // Construct Inline Keyboard
        const inlineRows = [
            [
                { text: '✅ ยืนยัน & ส่ง PDF', callback_data: `approve:${order.orderId}` },
                { text: '❌ ปฏิเสธ', callback_data: `reject:${order.orderId}` },
            ]
        ];

        // ถ้ามีลิงก์รูปสลิปส่งมา ให้เพิ่มปุ่มและพยายามส่งรูป
        if (order.slipImageUrl) {
            inlineRows.push([
                { text: '🔍 ดูรูปสลิป', url: order.slipImageUrl }
            ]);
        }

        const inlineKeyboard = {
            inline_keyboard: inlineRows,
        };

        let result;
        if (order.slipImageUrl) {
            // ลองส่งเป็นรูปภาพก่อน
            const photoResult = await sendTelegramPhoto(order.slipImageUrl, message, inlineKeyboard);
            if (!photoResult.ok) {
                console.error('Failed to send photo:', photoResult);
                // ถ้าส่งรูปไม่ผ่าน ให้ส่งเป็นข้อความปกติ (แต่ปุ่มยังกดดูรูปได้)
                result = await sendTelegramMessage(message, inlineKeyboard);
            } else {
                result = photoResult;
            }
        } else {
            result = await sendTelegramMessage(message, inlineKeyboard);
        }

        return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
});
