import React, { useState } from 'react';
import { LogOut, Download, FileText, BookOpen, Users, ShoppingBag, TrendingUp, Search, Filter, Plus, Edit, Trash2, Package } from 'lucide-react';
import { useAdminBooks, categories } from '@/hooks/useBooks';
import { useAdminOrders } from '@/hooks/useOrders';
import { FloatingCircle } from '@/components/MemphisPatterns';
import { toast } from 'sonner';
import AdminBookFormSection from './AdminBookFormSection';
import AdminOrdersSection from './AdminOrdersSection';

type AdminView = 'dashboard' | 'add-book' | 'edit-book' | 'orders';

interface AdminDashboardSectionProps {
  onLogout: () => void;
}

const AdminDashboardSection: React.FC<AdminDashboardSectionProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editBookId, setEditBookId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { books, deleteBook, loading: booksLoading } = useAdminBooks();
  const { stats } = useAdminOrders();

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats from real data
  const dashboardStats = [
    { label: 'รายได้รวม', value: `฿${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-memphis-green' },
    { label: 'ออเดอร์รอตรวจสอบ', value: stats.pending.toString(), icon: ShoppingBag, color: 'bg-memphis-yellow' },
    { label: 'สำเร็จแล้ว', value: stats.completed.toString(), icon: Users, color: 'bg-memphis-blue' },
    { label: 'หนังสือทั้งหมด', value: books.length.toString(), icon: BookOpen, color: 'bg-memphis-pink' },
  ];

  const handleDownloadPDF = (book: typeof books[0]) => {
    if (book.pdfUrl) {
      window.open(book.pdfUrl, '_blank');
    } else {
      // Fallback for static books
      const link = document.createElement('a');
      link.href = `/pdfs/psychology-of-babies.pdf`;
      link.download = `${book.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEditBook = (bookId: string) => {
    setEditBookId(bookId);
    setCurrentView('edit-book');
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (confirm(`ต้องการลบ "${bookTitle}" หรือไม่?`)) {
      const success = await deleteBook(bookId);
      if (success) {
        toast.success('ลบหนังสือสำเร็จ');
      } else {
        toast.error('ไม่สามารถลบหนังสือได้');
      }
    }
  };

  // Render sub-views
  if (currentView === 'add-book') {
    return (
      <AdminBookFormSection
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'edit-book' && editBookId) {
    return (
      <AdminBookFormSection
        onBack={() => {
          setCurrentView('dashboard');
          setEditBookId(undefined);
        }}
        editBookId={editBookId}
      />
    );
  }

  if (currentView === 'orders') {
    return (
      <AdminOrdersSection
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <section className="relative min-h-screen bg-gray-50 py-8 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}
      />

      <FloatingCircle color="#FF006E" size={40} className="top-20 right-[5%] opacity-30" />
      <FloatingCircle color="#FFBE0B" size={30} className="bottom-20 left-[3%] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 mb-6 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-memphis-purple border-3 border-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <div>
                <h1 className="font-fredoka font-bold text-2xl text-black">Admin Dashboard</h1>
                <p className="text-black/60 text-sm">จัดการหนังสือ, ออเดอร์ และดาวน์โหลด PDF</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 border-2 border-red-400 rounded-xl text-red-600 font-semibold hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000]"
            >
              <div className={`w-10 h-10 ${stat.color} border-2 border-black rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-black" />
              </div>
              <p className="text-black/60 text-sm">{stat.label}</p>
              <p className="font-fredoka font-bold text-2xl text-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setCurrentView('add-book')}
            className="bg-memphis-pink border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border-3 border-black rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-memphis-pink" />
              </div>
              <div>
                <h3 className="font-fredoka font-bold text-xl text-white">เพิ่มหนังสือใหม่</h3>
                <p className="text-white/80 text-sm">อัปโหลด PDF และรูปปก</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('orders')}
            className="bg-memphis-blue border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border-3 border-black rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-memphis-blue" />
              </div>
              <div>
                <h3 className="font-fredoka font-bold text-xl text-white">จัดการออเดอร์</h3>
                <p className="text-white/80 text-sm">
                  {stats.pending > 0 ? `${stats.pending} รอตรวจสอบ` : 'ดูออเดอร์ทั้งหมด'}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 mb-6 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาหนังสือ..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-3 border-black rounded-xl focus:outline-none focus:bg-white transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 bg-gray-50 border-3 border-black rounded-xl focus:outline-none focus:bg-white transition-colors appearance-none cursor-pointer"
              >
                <option value="all">ทุกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nameTh} ({cat.ageRange})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
          <h2 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-memphis-purple" />
            หนังสือทั้งหมด ({filteredBooks.length} เล่ม)
          </h2>

          {booksLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-memphis-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-black/60">กำลังโหลด...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className={`border-3 border-black rounded-2xl p-4 hover:shadow-[4px_4px_0px_0px_#000] transition-shadow ${book.isActive === false ? 'opacity-50' : ''
                    }`}
                >
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div className="w-20 h-28 flex-shrink-0 border-2 border-black rounded-lg overflow-hidden">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-fredoka font-bold text-sm truncate">{book.title}</h3>
                      <p className="text-xs text-black/60 mb-1">{book.subtitle}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="inline-block text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          {book.ageRange}
                        </span>
                        {book.isNew && (
                          <span className="inline-block text-xs px-2 py-0.5 bg-memphis-green text-black rounded-full">NEW</span>
                        )}
                        {book.isBestseller && (
                          <span className="inline-block text-xs px-2 py-0.5 bg-memphis-pink text-white rounded-full">HOT</span>
                        )}
                      </div>
                      <p className="font-fredoka font-bold text-memphis-pink text-sm">
                        ฿{book.price}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleDownloadPDF(book)}
                      className="flex-1 py-2 px-3 bg-memphis-green border-2 border-black rounded-lg text-sm font-semibold flex items-center justify-center gap-1 hover:opacity-80"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleEditBook(book.id)}
                      className="py-2 px-3 bg-memphis-yellow border-2 border-black rounded-lg hover:opacity-80"
                      title="แก้ไข"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="py-2 px-3 bg-red-100 border-2 border-black rounded-lg hover:bg-red-200"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!booksLoading && filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 border-3 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">ไม่พบหนังสือที่ค้นหา</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-black/40 text-sm">
          <p>Pop Playground Admin Dashboard © 2024</p>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardSection;
