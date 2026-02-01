import React from 'react';
import { ShoppingCart, Star, BookOpen, Sparkles, TrendingUp, Check } from 'lucide-react';
import { books, categories, getBooksByCategory } from '@/data/books';
import type { Book, AgeCategory } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { FloatingCircle, FloatingTriangle, MemphisBlob } from '@/components/MemphisPatterns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BooksSectionProps {
  selectedCategory: AgeCategory | null;
}

const BooksSection: React.FC<BooksSectionProps> = ({ selectedCategory }) => {
  const addToCart = useCartStore(state => state.addToCart);
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [addedToCart, setAddedToCart] = React.useState<string | null>(null);

  const displayBooks = selectedCategory 
    ? getBooksByCategory(selectedCategory)
    : books;

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setAddedToCart(book.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const getCategoryColor = (categoryId: AgeCategory) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#FF006E';
  };

  return (
    <section className="relative py-20 bg-memphis-green overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
          backgroundSize: '25px 25px'
        }}
      />

      {/* Decorative Elements */}
      <FloatingCircle 
        color="#FF006E" 
        size={70} 
        className="top-16 right-[5%] animate-float"
      />
      <FloatingCircle 
        color="#FFBE0B" 
        size={50} 
        className="bottom-32 left-[8%] animate-float-delayed"
      />
      <FloatingTriangle 
        color="#8338EC" 
        size={55} 
        className="top-40 left-[3%] animate-wiggle"
        style={{ transform: 'rotate(-15deg)' }}
      />
      <MemphisBlob 
        color="#3A86FF" 
        variant={1}
        className="w-32 h-32 bottom-20 right-[10%] opacity-40 animate-float-delayed"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border-3 border-black rounded-full px-4 py-2 mb-4 shadow-[4px_4px_0px_0px_#000]">
            <BookOpen className="w-5 h-5 text-memphis-pink" />
            <span className="font-fredoka font-semibold text-sm">รายการหนังสือ</span>
          </div>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl text-black mb-4">
            {selectedCategory ? (
              <>
                หนังสือ
                <span 
                  className="ml-2"
                  style={{ color: getCategoryColor(selectedCategory) }}
                >
                  {categories.find(c => c.id === selectedCategory)?.nameTh}
                </span>
              </>
            ) : (
              <>
                <span className="text-memphis-pink">หนังสือ</span>
                <span className="text-memphis-purple">ทั้งหมด</span>
              </>
            )}
          </h2>
          <p className="text-lg text-black/70">
            {displayBooks.length} เล่ม พร้อมให้คุณเลือกซื้อ
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayBooks.map((book) => {
            const categoryColor = getCategoryColor(book.category);
            const isAdded = addedToCart === book.id;
            
            return (
              <div
                key={book.id}
                className="group bg-white border-4 border-black rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[10px_10px_0px_0px_#000] hover:-translate-y-2"
                style={{
                  boxShadow: '6px 6px 0px 0px #000'
                }}
              >
                {/* Book Cover */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {book.isNew && (
                      <span className="bg-memphis-green text-black text-xs font-bold px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]">
                        NEW
                      </span>
                    )}
                    {book.isBestseller && (
                      <span className="bg-memphis-pink text-white text-xs font-bold px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Age Badge */}
                  <div 
                    className="absolute bottom-3 right-3 text-white text-xs font-bold px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {book.ageRange}
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-memphis-yellow text-memphis-yellow" />
                    <span className="font-semibold text-sm">{book.rating}</span>
                    <span className="text-black/50 text-sm">({book.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-fredoka font-bold text-lg text-black mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-black/60 mb-3">{book.subtitle}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-fredoka font-bold text-2xl text-memphis-pink">
                      ฿{book.price}
                    </span>
                    {book.originalPrice && (
                      <span className="text-black/40 line-through text-sm">
                        ฿{book.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="flex-1 py-2 px-3 bg-white border-3 border-black rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      ดูรายละเอียด
                    </button>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className={`py-2 px-3 border-3 border-black rounded-xl transition-all ${
                        isAdded 
                          ? 'bg-memphis-green text-black' 
                          : 'bg-memphis-yellow text-black hover:bg-memphis-pink hover:text-white'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book Detail Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-2xl bg-white border-4 border-black rounded-3xl p-0 overflow-hidden shadow-[8px_8px_0px_0px_#000]">
          {selectedBook && (
            <>
              <div className="grid md:grid-cols-2 gap-0">
                {/* Book Cover */}
                <div className="aspect-[2/3] md:aspect-auto">
                  <img 
                    src={selectedBook.image} 
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="p-6">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-white text-xs font-bold px-3 py-1 border-2 border-black rounded-full"
                        style={{ backgroundColor: getCategoryColor(selectedBook.category) }}
                      >
                        {selectedBook.ageRange}
                      </span>
                      {selectedBook.isBestseller && (
                        <span className="bg-memphis-pink text-white text-xs font-bold px-3 py-1 border-2 border-black rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          ขายดี
                        </span>
                      )}
                    </div>
                    <DialogTitle className="font-fredoka font-bold text-2xl text-black">
                      {selectedBook.title}
                    </DialogTitle>
                    <p className="text-black/60">{selectedBook.subtitle}</p>
                  </DialogHeader>

                  <div className="mt-4">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 fill-memphis-yellow text-memphis-yellow" />
                      <span className="font-semibold">{selectedBook.rating}</span>
                      <span className="text-black/50">({selectedBook.reviews} รีวิว)</span>
                      <span className="text-black/30">|</span>
                      <BookOpen className="w-4 h-4 text-black/50" />
                      <span className="text-black/50">{selectedBook.pages} หน้า</span>
                    </div>

                    {/* Description */}
                    <p className="text-black/70 mb-4">{selectedBook.description}</p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-fredoka font-bold text-sm mb-2">จุดเด่น:</h4>
                      <ul className="space-y-1">
                        {selectedBook.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-black/70">
                            <Sparkles className="w-4 h-4 text-memphis-pink flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-fredoka font-bold text-3xl text-memphis-pink">
                          ฿{selectedBook.price}
                        </span>
                        {selectedBook.originalPrice && (
                          <span className="text-black/40 line-through ml-2">
                            ฿{selectedBook.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(selectedBook);
                        setSelectedBook(null);
                      }}
                      className="w-full mt-4 btn-memphis bg-memphis-pink flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BooksSection;
