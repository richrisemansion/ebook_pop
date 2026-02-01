import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, CreditCard, Check, Upload } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { CustomerInfo } from '@/types';
import { FloatingCircle, FloatingTriangle, MemphisBlob } from '@/components/MemphisPatterns';

interface CheckoutSectionProps {
  onBack: () => void;
  onComplete: (orderId: string) => void;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({ onBack, onComplete }) => {
  const { items, getTotalPrice, setCustomer, createOrder } = useCartStore();
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'อีเมลไม่ถูกต้อง';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทร';
    } else if (!/^[0-9]{9,10}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = 'เบอร์โทรไม่ถูกต้อง';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Save customer info and create order
    setCustomer(formData);
    const order = createOrder();
    
    if (order) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete(order.id);
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-screen bg-memphis-purple py-24 overflow-hidden">
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
      <MemphisBlob color="#3A86FF" variant={3} className="w-28 h-28 bottom-20 left-[8%] opacity-40" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          กลับไปตะกร้าสินค้า
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border-3 border-black rounded-full px-4 py-2 mb-4 shadow-[4px_4px_0px_0px_#000]">
            <CreditCard className="w-5 h-5 text-memphis-pink" />
            <span className="font-fredoka font-semibold text-sm">ชำระเงิน</span>
          </div>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl text-white text-shadow-memphis">
            กรอกข้อมูล
            <span className="text-memphis-yellow">การสั่งซื้อ</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form 
              onSubmit={handleSubmit}
              className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000]"
            >
              <h3 className="font-fredoka font-bold text-xl mb-6">ข้อมูลผู้สั่งซื้อ</h3>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block font-semibold text-sm mb-2">
                    ชื่อ-นามสกุล <span className="text-memphis-pink">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="กรอกชื่อ-นามสกุล"
                      className="w-full pl-12 pr-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-sm mb-2">
                    อีเมล <span className="text-memphis-pink">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                  <p className="text-xs text-black/50 mt-1">
                    คุณจะได้รับ PDF ทางอีเมลนี้หลังชำระเงิน
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold text-sm mb-2">
                    เบอร์โทรศัพท์ <span className="text-memphis-pink">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="081-234-5678"
                      className="w-full pl-12 pr-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-memphis bg-memphis-pink flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      ยืนยันคำสั่งซื้อ
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="font-fredoka font-bold text-xl mb-4">สรุปคำสั่งซื้อ</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-16 flex-shrink-0 border-2 border-black rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.title}</p>
                      <p className="text-xs text-black/60">{item.quantity} x ฿{item.price}</p>
                    </div>
                    <div className="font-fredoka font-bold text-memphis-pink">
                      ฿{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-black/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black/70">ค่าจัดส่ง</span>
                  <span className="text-memphis-green font-semibold">ฟรี</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-fredoka font-bold">ยอดรวม</span>
                  <span className="font-fredoka font-bold text-2xl text-memphis-pink">
                    ฿{getTotalPrice()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-4 bg-memphis-yellow border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5" />
                <span className="font-fredoka font-bold">วิธีชำระเงิน</span>
              </div>
              <p className="text-sm text-black/70">
                โอนเงินผ่านธนาคาร และอัปโหลดสลิปในขั้นตอนถัดไป
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
