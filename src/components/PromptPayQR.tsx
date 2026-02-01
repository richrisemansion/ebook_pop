import React, { useMemo } from 'react';
import generatePayload from 'promptpay-qr';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface PromptPayQRProps {
    amount: number;
    orderId: string;
}

// Get PromptPay ID from environment variable or use default
const PROMPTPAY_ID = import.meta.env.VITE_PROMPTPAY_ID || '0812345678';

const PromptPayQR: React.FC<PromptPayQRProps> = ({ amount, orderId }) => {
    const [copied, setCopied] = useState(false);

    // Generate PromptPay QR payload
    const qrPayload = useMemo(() => {
        return generatePayload(PROMPTPAY_ID, { amount });
    }, [amount]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(PROMPTPAY_ID);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Format phone number for display
    const formatPhoneNumber = (phone: string) => {
        if (phone.length === 10) {
            return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
        }
        return phone;
    };

    return (
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
            <h3 className="font-fredoka font-bold text-xl text-center mb-4">
                สแกนเพื่อชำระเงิน
            </h3>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
                <div className="bg-white p-4 border-4 border-black rounded-2xl">
                    <QRCodeSVG
                        value={qrPayload}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                        includeMargin={false}
                    />
                </div>
            </div>

            {/* Amount */}
            <div className="bg-memphis-yellow border-3 border-black rounded-xl p-4 mb-4">
                <p className="text-center text-sm text-black/70 mb-1">ยอดชำระ</p>
                <p className="text-center font-fredoka font-bold text-3xl text-black">
                    ฿{amount.toLocaleString()}
                </p>
            </div>

            {/* PromptPay ID */}
            <div className="bg-gray-50 border-3 border-black rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-memphis-blue" />
                        <div>
                            <p className="text-xs text-black/60">พร้อมเพย์</p>
                            <p className="font-fredoka font-bold">{formatPhoneNumber(PROMPTPAY_ID)}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`p-2 rounded-lg border-2 border-black transition-colors ${copied ? 'bg-memphis-green' : 'bg-white hover:bg-gray-100'
                            }`}
                    >
                        {copied ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Copy className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Order Reference */}
            <div className="text-center text-sm text-black/60">
                <p>อ้างอิงคำสั่งซื้อ</p>
                <p className="font-mono font-bold text-black">{orderId}</p>
            </div>

            {/* Instructions */}
            <div className="mt-4 pt-4 border-t-2 border-black/10">
                <p className="text-sm text-black/70 text-center">
                    เปิดแอปธนาคาร → สแกน QR → โอนเงิน<br />
                    จากนั้นอัปโหลดสลิปในขั้นตอนถัดไป
                </p>
            </div>
        </div>
    );
};

export default PromptPayQR;
