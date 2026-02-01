import React, { useState } from 'react';
import { ArrowLeft, Clock, Copy, Check, Upload, AlertCircle } from 'lucide-react';
import { FloatingCircle, FloatingTriangle, MemphisBlob } from '@/components/MemphisPatterns';
import PromptPayQR from '@/components/PromptPayQR';
import type { DbOrder } from '@/types/database';

interface PaymentSectionProps {
    order: DbOrder;
    onBack: () => void;
    onUploadSlip: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ order, onBack, onUploadSlip }) => {
    const [copied, setCopied] = useState(false);
    const promptPayId = import.meta.env.VITE_PROMPTPAY_ID || '0909962927';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatPhoneNumber = (phone: string) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    };

    return (
        <section className="relative min-h-screen bg-memphis-blue py-24 overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                    backgroundSize: '30px 30px'
                }}
            />

            <FloatingCircle color="#FF006E" size={60} className="top-32 left-[5%] animate-float" />
            <FloatingCircle color="#FFBE0B" size={45} className="bottom-32 right-[8%] animate-float-delayed" />
            <FloatingTriangle color="#06FFA5" size={50} className="top-40 right-[5%] animate-wiggle" />
            <MemphisBlob color="#8338EC" variant={2} className="w-28 h-28 bottom-20 left-[8%] opacity-40" />

            <div className="relative z-10 max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-white font-semibold hover:underline"
                >
                    <ArrowLeft className="w-5 h-5" />
                    กลับไปแก้ไขข้อมูล
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white border-3 border-black rounded-full px-4 py-2 mb-4 shadow-[4px_4px_0px_0px_#000]">
                        <Clock className="w-5 h-5 text-memphis-blue" />
                        <span className="font-fredoka font-semibold text-sm">รอการชำระเงิน</span>
                    </div>
                    <h2 className="font-fredoka font-bold text-4xl md:text-5xl text-white text-shadow-memphis">
                        สแกนจ่ายเงิน
                        <span className="text-memphis-yellow"> PromptPay</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* QR Code Section */}
                    <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000]">
                        <div className="text-center">
                            {/* Order Number */}
                            <div className="mb-4">
                                <p className="text-sm text-black/60 mb-1">หมายเลขคำสั่งซื้อ</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="font-fredoka font-bold text-lg">{order.order_number}</span>
                                    <button
                                        onClick={() => copyToClipboard(order.order_number)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code */}
                            <PromptPayQR
                                amount={order.total_amount}
                                orderId={order.order_number}
                            />

                            {/* Amount */}
                            <div className="mt-4 p-4 bg-memphis-green/20 border-2 border-memphis-green rounded-xl">
                                <p className="text-sm text-black/70">ยอดที่ต้องชำระ</p>
                                <p className="font-fredoka font-bold text-3xl text-memphis-green">
                                    ฿{order.total_amount.toLocaleString()}
                                </p>
                            </div>

                            {/* PromptPay Info */}
                            <div className="mt-4 text-sm text-black/60">
                                <p>PromptPay ID: {formatPhoneNumber(promptPayId)}</p>
                                <p>ชื่อบัญชี: Pop Playground</p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions & Upload */}
                    <div className="space-y-6">
                        {/* Instructions */}
                        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                            <h3 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-memphis-yellow border-2 border-black rounded-full flex items-center justify-center text-sm">1</span>
                                วิธีชำระเงิน
                            </h3>
                            <ol className="space-y-3 text-sm">
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 bg-memphis-pink/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                    <span>เปิดแอปธนาคารของคุณ</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 bg-memphis-pink/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                    <span>เลือก "สแกน QR" หรือ "PromptPay"</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 bg-memphis-pink/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                    <span>สแกน QR Code ด้านซ้าย</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 bg-memphis-pink/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                    <span>ตรวจสอบยอดเงิน <strong>฿{order.total_amount.toLocaleString()}</strong> แล้วกดยืนยัน</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-6 h-6 bg-memphis-pink/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                    <span>บันทึกสลิป หรือ Screenshot หน้าจอ</span>
                                </li>
                            </ol>
                        </div>

                        {/* Upload Slip Button */}
                        <div className="bg-memphis-yellow border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                            <h3 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center text-sm">2</span>
                                อัปโหลดสลิป
                            </h3>
                            <p className="text-sm text-black/70 mb-4">
                                หลังโอนเงินแล้ว กรุณาอัปโหลดสลิปเพื่อยืนยันการชำระเงิน
                            </p>
                            <button
                                onClick={onUploadSlip}
                                className="w-full btn-memphis bg-memphis-pink flex items-center justify-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                อัปโหลดสลิปการโอนเงิน
                            </button>
                        </div>

                        {/* Warning */}
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-700">
                                <p className="font-semibold mb-1">สำคัญ!</p>
                                <p>กรุณาชำระเงินภายใน 24 ชั่วโมง มิฉะนั้นคำสั่งซื้อจะถูกยกเลิกโดยอัตโนมัติ</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="mt-8 bg-white/10 backdrop-blur border-2 border-white/30 rounded-2xl p-6">
                    <h3 className="font-fredoka font-bold text-white mb-4">รายละเอียดคำสั่งซื้อ</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-white/80 text-sm">
                        <div>
                            <p className="text-white/50">ชื่อผู้สั่ง</p>
                            <p className="font-semibold">{order.customer_name}</p>
                        </div>
                        <div>
                            <p className="text-white/50">อีเมล</p>
                            <p className="font-semibold">{order.customer_email}</p>
                        </div>
                        <div>
                            <p className="text-white/50">เบอร์โทร</p>
                            <p className="font-semibold">{order.customer_phone}</p>
                        </div>
                        <div>
                            <p className="text-white/50">จำนวนสินค้า</p>
                            <p className="font-semibold">{order.items.length} รายการ</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentSection;
