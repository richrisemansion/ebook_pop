import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { FloatingCircle, FloatingTriangle, MemphisBlob } from '@/components/MemphisPatterns';

interface CartSectionProps {
  onCheckout: () => void;
}

const CartSection: React.FC<CartSectionProps> = ({ onCheckout }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <section className="relative min-h-screen bg-memphis-blue py-24 overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L10 0 L20 10 L30 0 L40 10' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 20px'
          }}
        />

        <FloatingCircle color="#FF006E" size={60} className="top-32 left-[10%] animate-float" />
        <FloatingCircle color="#FFBE0B" size={40} className="bottom-32 right-[10%] animate-float-delayed" />
        <MemphisBlob color="#06FFA5" variant={2} className="w-28 h-28 top-1/2 left-[5%] opacity-40" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white border-4 border-black rounded-3xl p-12 shadow-[8px_8px_0px_0px_#000]">
            <div className="w-24 h-24 bg-memphis-yellow border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="font-fredoka font-bold text-3xl text-black mb-4">
              ตะกร้าของคุณว่างเปล่า
            </h2>
            <p className="text-black/70 mb-8">
              เลือกหนังสือที่คุณสนใจและกลับมาที่นี่อีกครั้ง
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-memphis-blue py-24 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L10 0 L20 10 L30 0 L40 10' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 20px'
        }}
      />

      <FloatingCircle color="#FF006E" size={60} className="top-32 left-[5%] animate-float" />
      <FloatingCircle color="#FFBE0B" size={40} className="bottom-32 right-[8%] animate-float-delayed" />
      <FloatingTriangle color="#8338EC" size={50} className="top-40 right-[5%] animate-wiggle" />
      <MemphisBlob color="#06FFA5" variant={1} className="w-32 h-32 bottom-20 left-[8%] opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border-3 border-black rounded-full px-4 py-2 mb-4 shadow-[4px_4px_0px_0px_#000]">
            <ShoppingBag className="w-5 h-5 text-memphis-pink" />
            <span className="font-fredoka font-semibold text-sm">ตะกร้าสินค้า</span>
          </div>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl text-black">
            หนังสือใน
            <span className="text-memphis-pink">ตะกร้า</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-white border-4 border-black rounded-2xl p-4 flex gap-4 shadow-[6px_6px_0px_0px_#000]"
              >
                {/* Book Cover */}
                <div className="w-24 h-36 flex-shrink-0 border-3 border-black rounded-xl overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-fredoka font-bold text-lg text-black line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-black/60">{item.subtitle}</p>
                    <span className="inline-block mt-1 text-xs font-semibold text-memphis-pink bg-memphis-pink/10 px-2 py-0.5 rounded-full">
                      {item.ageRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-memphis-yellow border-2 border-black rounded-lg flex items-center justify-center hover:bg-memphis-yellow/80 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-fredoka font-bold text-lg w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-memphis-green border-2 border-black rounded-lg flex items-center justify-center hover:bg-memphis-green/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price & Delete */}
                    <div className="flex items-center gap-4">
                      <span className="font-fredoka font-bold text-xl text-memphis-pink">
                        ฿{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-red-100 border-2 border-red-400 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000] sticky top-24">
              <h3 className="font-fredoka font-bold text-2xl text-black mb-6">
                สรุปคำสั่งซื้อ
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-black/70">
                  <span>จำนวนสินค้า</span>
                  <span className="font-semibold">{getTotalItems()} เล่ม</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>ค่าจัดส่ง</span>
                  <span className="font-semibold text-memphis-green">ฟรี (E-book)</span>
                </div>
                <div className="border-t-2 border-black/10 pt-3">
                  <div className="flex justify-between">
                    <span className="font-fredoka font-bold text-lg">ยอดรวม</span>
                    <span className="font-fredoka font-bold text-2xl text-memphis-pink">
                      ฿{getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full btn-memphis bg-memphis-pink flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                ดำเนินการชำระเงิน
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-black/50 mt-4">
                หลังชำระเงิน คุณจะได้รับ PDF ทางอีเมลภายใน 24 ชั่วโมง
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSection;
