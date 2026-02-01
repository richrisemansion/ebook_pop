import React from 'react';
import { Baby, Sparkles, BookOpen, Star, ArrowRight } from 'lucide-react';
import { categories } from '@/data/books';
import type { AgeCategory } from '@/types';
import { FloatingCircle, FloatingTriangle, MemphisBlob } from '@/components/MemphisPatterns';

interface CategoriesSectionProps {
  onCategorySelect: (category: AgeCategory) => void;
  selectedCategory: AgeCategory | null;
}

const categoryIcons = {
  baby: Baby,
  preschool: Sparkles,
  elementary: BookOpen,
  preteen: Star
};

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  onCategorySelect, 
  selectedCategory 
}) => {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 30 Q 20 10, 30 30 T 50 30' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Decorative Elements */}
      <FloatingCircle 
        color="#FF006E" 
        size={60} 
        className="top-20 left-[5%] animate-float"
      />
      <FloatingCircle 
        color="#FFBE0B" 
        size={40} 
        className="bottom-20 right-[8%] animate-float-delayed"
      />
      <FloatingTriangle 
        color="#8338EC" 
        size={50} 
        className="top-32 right-[10%] animate-wiggle"
        style={{ transform: 'rotate(20deg)' }}
      />
      <MemphisBlob 
        color="#06FFA5" 
        variant={2}
        className="w-24 h-24 bottom-10 left-[8%] opacity-40 animate-float-delayed"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-memphis-yellow border-3 border-black rounded-full px-4 py-2 mb-4 shadow-[4px_4px_0px_0px_#000]">
            <Sparkles className="w-5 h-5 text-memphis-pink" />
            <span className="font-fredoka font-semibold text-sm">เลือกตามช่วงวัย</span>
          </div>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl text-black mb-4">
            หนังสือสำหรับ
            <span className="text-memphis-pink">ทุก</span>
            <span className="text-memphis-purple">ช่วง</span>
            <span className="text-memphis-green">วัย</span>
          </h2>
          <p className="text-lg text-black/70 max-w-2xl mx-auto">
            เลือกหนังสือที่เหมาะสมกับวัยของลูกน้อย เพื่อให้ได้รับความรู้ที่ตรงกับพัฒนาการ
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id];
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`group relative bg-white border-4 border-black rounded-3xl p-6 transition-all duration-300 ${
                  isSelected 
                    ? 'shadow-[8px_8px_0px_0px_#000] transform -translate-y-2' 
                    : 'shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1'
                }`}
                style={{
                  backgroundColor: isSelected ? category.color : 'white'
                }}
              >
                {/* Icon */}
                <div 
                  className={`w-16 h-16 rounded-2xl border-4 border-black flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 ${
                    isSelected ? 'bg-white' : ''
                  }`}
                  style={{ backgroundColor: isSelected ? 'white' : category.color }}
                >
                  <Icon className="w-8 h-8 text-black" />
                </div>

                {/* Age Badge */}
                <div 
                  className="inline-block px-3 py-1 text-sm font-bold text-white border-2 border-black rounded-full mb-3"
                  style={{ backgroundColor: isSelected ? 'black' : category.color }}
                >
                  {category.ageRange}
                </div>

                {/* Title */}
                <h3 className={`font-fredoka font-bold text-2xl mb-2 ${
                  isSelected ? 'text-white' : 'text-black'
                }`}>
                  {category.nameTh}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-4 ${
                  isSelected ? 'text-white/90' : 'text-black/70'
                }`}>
                  {category.description}
                </p>

                {/* Arrow */}
                <div className={`flex items-center gap-2 font-semibold text-sm ${
                  isSelected ? 'text-white' : 'text-black'
                }`}>
                  <span>ดูหนังสือ</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                    isSelected ? 'text-white' : ''
                  }`} />
                </div>

                {/* Decorative corner */}
                <div 
                  className="absolute -top-3 -right-3 w-8 h-8 border-4 border-black rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </button>
            );
          })}
        </div>

        {/* Show All Button */}
        {selectedCategory && (
          <div className="text-center mt-8">
            <button
              onClick={() => onCategorySelect(null as any)}
              className="btn-memphis bg-white text-black"
            >
              ดูหนังสือทั้งหมด
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
