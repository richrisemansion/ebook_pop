import { useState } from 'react';
import Navigation from '@/components/Navigation';
import CartDrawer from '@/components/CartDrawer';
import AdminLoginButton from '@/components/AdminLoginButton';
import HeroSection from '@/sections/HeroSection';
import CategoriesSection from '@/sections/CategoriesSection';
import BooksSection from '@/sections/BooksSection';
import CartSection from '@/sections/CartSection';
import CheckoutSection from '@/sections/CheckoutSection';
import PaymentSection from '@/sections/PaymentSection';
import UploadSlipSection from '@/sections/UploadSlipSection';
import FooterSection from '@/sections/FooterSection';
import AdminLoginSection from '@/sections/AdminLoginSection';
import AdminDashboardSection from '@/sections/AdminDashboardSection';
import type { AgeCategory } from '@/types';
import type { DbOrder } from '@/types/database';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder } from '@/hooks/useOrders';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type Page = 'home' | 'books' | 'cart' | 'checkout' | 'payment' | 'upload-slip' | 'success' | 'contact' | 'admin-login' | 'admin-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AgeCategory | null>(null);
  const [currentOrder, setCurrentOrder] = useState<DbOrder | null>(null);
  const [, setIsAdminLoggedIn] = useState(false);
  const { clearCart, items, getTotalPrice, customer } = useCartStore();
  const { createOrder } = useCreateOrder();

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  const handleCategorySelect = (category: AgeCategory | null) => {
    setSelectedCategory(category);
    if (category) {
      setCurrentPage('books');
    }
    window.scrollTo(0, 0);
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
    setIsCartOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCheckoutComplete = async (_orderId: string) => {
    // Create order in Supabase
    const orderItems = items.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      pdf_url: item.pdfUrl || '',
    }));

    const order = await createOrder({
      customerName: customer?.name || '',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
      items: orderItems,
      totalAmount: getTotalPrice(),
    });

    if (order) {
      setCurrentOrder(order);
      setCurrentPage('payment');
      window.scrollTo(0, 0);
    } else {
      toast.error('ไม่สามารถสร้างคำสั่งซื้อได้', {
        description: 'กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  const handleGoToUploadSlip = () => {
    setCurrentPage('upload-slip');
    window.scrollTo(0, 0);
  };

  const handleUploadComplete = () => {
    setCurrentPage('success');
    clearCart();
    window.scrollTo(0, 0);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentPage('admin-dashboard');
    window.scrollTo(0, 0);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  const handleCartClick = () => {
    const totalItems = useCartStore.getState().getTotalItems();
    if (totalItems === 0) {
      toast.info('ตะกร้าของคุณว่างเปล่า', {
        description: 'เลือกหนังสือที่คุณสนใจก่อนนะคะ',
      });
    } else {
      setIsCartOpen(true);
    }
  };

  // Success Page
  const SuccessPage = () => (
    <section className="relative min-h-screen bg-memphis-green py-24 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
        backgroundSize: '30px 30px'
      }} />

      <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
        <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#000]">
          <div className="w-24 h-24 bg-memphis-green border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-fredoka font-bold text-3xl text-black mb-4">
            สั่งซื้อสำเร็จ!
          </h2>
          <p className="text-black/70 mb-6">
            ขอบคุณสำหรับการสั่งซื้อ<br />
            เรากำลังตรวจสอบการชำระเงินของคุณ
          </p>
          <div className="bg-memphis-yellow border-3 border-black rounded-xl p-4 mb-4">
            <p className="text-sm text-black/60">หมายเลขคำสั่งซื้อ</p>
            <p className="font-fredoka font-bold text-xl">{currentOrder?.order_number || '-'}</p>
          </div>
          <div className="bg-memphis-blue/20 border-3 border-memphis-blue rounded-xl p-4 mb-6">
            <p className="text-sm text-black/70">
              คุณจะได้รับ PDF ทางอีเมล<br />
              <strong>{currentOrder?.customer_email}</strong><br />
              ภายใน 24 ชั่วโมงหลังการชำระเงินได้รับการยืนยัน
            </p>
          </div>
          <button
            onClick={() => handleNavigate('home')}
            className="btn-memphis bg-memphis-pink"
          >
            กลับไปหน้าแรก
          </button>
        </div>
      </div>
    </section>
  );

  // Contact Page
  const ContactPage = () => (
    <section className="relative min-h-screen bg-memphis-purple py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 30 Q 20 10, 30 30 T 50 30' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl text-white text-shadow-memphis mb-4">
            ติดต่อเรา
          </h2>
          <p className="text-white/80">มีคำถาม? เรายินดีช่วยเหลือคุณ</p>
        </div>

        <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#000]">
          <form className="space-y-5">
            <div>
              <label className="block font-semibold text-sm mb-2">ชื่อ</label>
              <input
                type="text"
                placeholder="กรอกชื่อของคุณ"
                className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">อีเมล</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">ข้อความ</label>
              <textarea
                rows={4}
                placeholder="เขียนข้อความของคุณ..."
                className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => toast.success('ส่งข้อความสำเร็จ!', { description: 'เราจะติดต่อกลับโดยเร็วที่สุด' })}
              className="w-full btn-memphis bg-memphis-pink"
            >
              ส่งข้อความ
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  // Render current page content
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <CategoriesSection
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
            <BooksSection selectedCategory={null} />
            <FooterSection />
          </>
        );
      case 'books':
        return (
          <>
            <div className="pt-24">
              <CategoriesSection
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </div>
            <BooksSection selectedCategory={selectedCategory} />
            <FooterSection />
          </>
        );
      case 'cart':
        return (
          <>
            <div className="pt-24">
              <CartSection onCheckout={handleCheckout} />
            </div>
            <FooterSection />
          </>
        );
      case 'checkout':
        return (
          <>
            <CheckoutSection
              onBack={() => setCurrentPage('cart')}
              onComplete={handleCheckoutComplete}
            />
          </>
        );
      case 'payment':
        return currentOrder ? (
          <>
            <PaymentSection
              order={currentOrder}
              onBack={() => setCurrentPage('checkout')}
              onUploadSlip={handleGoToUploadSlip}
            />
          </>
        ) : null;
      case 'upload-slip':
        return currentOrder ? (
          <>
            <UploadSlipSection
              order={currentOrder}
              onBack={() => setCurrentPage('payment')}
              onComplete={handleUploadComplete}
            />
          </>
        ) : null;
      case 'success':
        return <SuccessPage />;
      case 'contact':
        return (
          <>
            <ContactPage />
            <FooterSection />
          </>
        );
      case 'admin-login':
        return (
          <AdminLoginSection
            onLogin={handleAdminLogin}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboardSection onLogout={handleAdminLogout} />
        );
      default:
        return null;
    }
  };

  // Don't show navigation on admin pages
  const isAdminPage = currentPage === 'admin-login' || currentPage === 'admin-dashboard';

  return (
    <div className="min-h-screen bg-white">
      {!isAdminPage && (
        <Navigation
          onCartClick={handleCartClick}
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
      )}

      <main>
        {renderContent()}
      </main>

      {!isAdminPage && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
      )}

      {/* Admin Login Button - Fixed bottom right */}
      {!isAdminPage && (
        <AdminLoginButton onClick={() => handleNavigate('admin-login')} />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            border: '3px solid #000',
            borderRadius: '1rem',
            boxShadow: '6px 6px 0px 0px #000',
            fontFamily: 'Nunito, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
