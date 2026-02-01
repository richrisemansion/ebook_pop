import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-memphis-pink border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border-3 border-black rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-fredoka font-bold text-xl text-white">ตะกร้าสินค้า</h3>
              <p className="text-white/80 text-sm">{getTotalItems()} รายการ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white border-3 border-black rounded-xl flex items-center justify-center hover:bg-memphis-yellow transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-memphis-yellow border-4 border-black rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="font-fredoka font-bold text-xl mb-2">ตะกร้าว่างเปล่า</h4>
              <p className="text-black/60">เลือกหนังสือที่คุณสนใจมาใส่ตะกร้า</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border-3 border-black rounded-2xl p-3 flex gap-3 shadow-[4px_4px_0px_0px_#000]"
                >
                  {/* Book Cover */}
                  <div className="w-16 h-24 flex-shrink-0 border-2 border-black rounded-lg overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-fredoka font-bold text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-black/60">{item.ageRange}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-memphis-yellow border-2 border-black rounded-md flex items-center justify-center hover:bg-memphis-yellow/80"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-fredoka font-bold w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-memphis-green border-2 border-black rounded-md flex items-center justify-center hover:bg-memphis-green/80"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center gap-2">
                        <span className="font-fredoka font-bold text-memphis-pink">
                          ฿{item.price * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded-md flex items-center justify-center hover:bg-red-200"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-4 border-black bg-memphis-yellow p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">ยอดรวม</span>
              <span className="font-fredoka font-bold text-2xl text-memphis-pink">
                ฿{getTotalPrice()}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full btn-memphis bg-memphis-pink flex items-center justify-center gap-2"
            >
              ดำเนินการชำระเงิน
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
