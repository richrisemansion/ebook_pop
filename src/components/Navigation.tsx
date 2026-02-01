import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface NavigationProps {
  onCartClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navigation: React.FC<NavigationProps> = ({ onCartClick, onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'หน้าแรก', page: 'home' },
    { label: 'หนังสือทั้งหมด', page: 'books' },
    { label: 'ตะกร้าสินค้า', page: 'cart' },
    { label: 'ติดต่อเรา', page: 'contact' }
  ];
  
  const handleAdminClick = () => {
    onNavigate('admin-login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`bg-white border-4 border-black rounded-2xl px-6 py-3 transition-all duration-300 ${
            isScrolled ? 'shadow-[4px_4px_0px_0px_#000]' : 'shadow-[6px_6px_0px_0px_#000]'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-memphis-pink border-3 border-black rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="font-fredoka font-bold text-xl hidden sm:block">
                <span className="text-memphis-pink">Pop</span>
                <span className="text-memphis-purple">Play</span>
                <span className="text-memphis-yellow">ground</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`px-4 py-2 font-fredoka font-semibold rounded-xl border-2 transition-all duration-200 ${
                    currentPage === item.page
                      ? 'bg-memphis-pink text-white border-black shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Cart & Admin & Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Admin Login Button - Desktop */}
              <button
                onClick={handleAdminClick}
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-memphis-purple border-3 border-black rounded-xl hover:scale-105 transition-transform"
              >
                <Lock className="w-4 h-4" />
                <span className="font-fredoka font-semibold text-sm">Admin</span>
              </button>
              
              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-2 bg-memphis-yellow border-3 border-black rounded-xl hover:scale-105 transition-transform"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 bg-memphis-green border-3 border-black rounded-xl"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t-2 border-black/10">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      onNavigate(item.page);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 font-fredoka font-semibold rounded-xl border-2 text-left transition-all duration-200 ${
                      currentPage === item.page
                        ? 'bg-memphis-pink text-white border-black'
                        : 'bg-white text-black border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {/* Admin Login - Mobile */}
                <button
                  onClick={() => {
                    handleAdminClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 font-fredoka font-semibold rounded-xl border-2 text-left bg-memphis-purple text-white border-black flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Admin Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
