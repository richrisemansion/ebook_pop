import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Check, Calendar, Clock, X, AlertCircle } from 'lucide-react';
import { FloatingCircle, FloatingTriangle, MemphisBlob } from '@/components/MemphisPatterns';
import { useCreateOrder } from '@/hooks/useOrders';
import type { DbOrder } from '@/types/database';

interface UploadSlipSectionProps {
  order: DbOrder;
  onBack: () => void;
  onComplete: () => void;
}

const UploadSlipSection: React.FC<UploadSlipSectionProps> = ({ order, onBack, onComplete }) => {
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [transferTime, setTransferTime] = useState(new Date().toTimeString().slice(0, 5));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadSlip } = useCreateOrder();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('ไฟล์ต้องไม่เกิน 10MB');
        return;
      }

      setSlipFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSlipFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipFile || !transferDate || !transferTime) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await uploadSlip(order.id, slipFile, transferDate, transferTime);

      if (success) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 3000);
      } else {
        setError('ไม่สามารถอัปโหลดสลิปได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error('Error uploading slip:', err);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <section className="relative min-h-screen bg-memphis-green py-24 overflow-hidden flex items-center justify-center">
        <FloatingCircle color="#FF006E" size={60} className="top-32 left-[10%] animate-float" />
        <FloatingCircle color="#FFBE0B" size={40} className="bottom-32 right-[10%] animate-float-delayed" />

        <div className="relative z-10 max-w-md mx-auto px-4 text-center">
          <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#000]">
            <div className="w-24 h-24 bg-memphis-green border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Check className="w-12 h-12 text-black" />
            </div>
            <h2 className="font-fredoka font-bold text-3xl text-black mb-4">
              ส่งหลักฐานสำเร็จ!
            </h2>
            <p className="text-black/70 mb-6">
              เรากำลังตรวจสอบการชำระเงินของคุณ<br />
              คุณจะได้รับ PDF ทางอีเมลภายใน 24 ชั่วโมง
            </p>
            <div className="bg-memphis-yellow border-3 border-black rounded-xl p-4 mb-4">
              <p className="text-sm text-black/60">หมายเลขคำสั่งซื้อ</p>
              <p className="font-fredoka font-bold text-xl">{order.order_number}</p>
            </div>
            <p className="text-sm text-black/50">
              เราจะส่ง PDF ไปที่: <strong>{order.customer_email}</strong>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-memphis-pink py-24 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}
      />

      <FloatingCircle color="#FFBE0B" size={60} className="top-32 left-[5%] animate-float" />
      <FloatingCircle color="#3A86FF" size={45} className="bottom-32 right-[8%] animate-float-delayed" />
      <FloatingTriangle color="#8338EC" size={50} className="top-40 right-[5%] animate-wiggle" />
      <MemphisBlob color="#06FFA5" variant={2} className="w-28 h-28 bottom-20 left-[8%] opacity-40" />

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          กลับไปหน้าชำระเงิน
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border-3 border-black rounded-full px-4 py-2 mb-4 shadow-[4px_4px_0px_0px_#000]">
            <Upload className="w-5 h-5 text-memphis-pink" />
            <span className="font-fredoka font-semibold text-sm">อัปโหลดสลิป</span>
          </div>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl text-white text-shadow-memphis">
            แนบหลักฐาน
            <span className="text-memphis-yellow"> การโอน</span>
          </h2>
        </div>

        {/* Order Summary */}
        <div className="bg-white/20 backdrop-blur border-2 border-white/30 rounded-xl p-4 mb-6 text-white">
          <div className="flex justify-between items-center text-sm">
            <span>หมายเลขคำสั่งซื้อ:</span>
            <span className="font-bold">{order.order_number}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span>ยอดที่ต้องชำระ:</span>
            <span className="font-fredoka font-bold text-lg">฿{order.total_amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000]"
        >
          <h3 className="font-fredoka font-bold text-xl mb-6">อัปโหลดสลิปโอนเงิน</h3>

          {/* Slip Upload */}
          <div className="mb-6">
            <label className="block font-semibold text-sm mb-2">
              รูปสลิป <span className="text-memphis-pink">*</span>
            </label>

            {slipImage ? (
              <div className="relative border-3 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                <img
                  src={slipImage}
                  alt="Slip preview"
                  className="w-full max-h-80 object-contain bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSlipImage(null);
                    setSlipFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 border-2 border-black rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-full h-48 border-3 border-dashed border-black/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-memphis-yellow/20 hover:border-black transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-memphis-yellow border-3 border-black rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <span className="font-semibold text-black/60">คลิกหรือลากไฟล์มาวางที่นี่</span>
                <span className="text-sm text-black/40">รองรับ JPG, PNG ขนาดไม่เกิน 10MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Transfer Date */}
            <div>
              <label className="block font-semibold text-sm mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                วันที่โอน <span className="text-memphis-pink">*</span>
              </label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
              />
            </div>

            {/* Transfer Time */}
            <div>
              <label className="block font-semibold text-sm mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                เวลาโอน <span className="text-memphis-pink">*</span>
              </label>
              <input
                type="time"
                value={transferTime}
                onChange={(e) => setTransferTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!slipFile || !transferDate || !transferTime || isSubmitting}
            className="w-full btn-memphis bg-memphis-green flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                กำลังอัปโหลด...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                ส่งหลักฐานการโอน
              </>
            )}
          </button>

          <p className="text-xs text-black/50 text-center mt-4">
            หลังจากอัปโหลดสลิป เราจะตรวจสอบและส่ง PDF ไปยังอีเมลของคุณภายใน 24 ชั่วโมง
          </p>
        </form>
      </div>
    </section>
  );
};

export default UploadSlipSection;
