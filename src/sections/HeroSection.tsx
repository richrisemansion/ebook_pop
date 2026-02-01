import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Heart } from 'lucide-react';
import { FloatingCircle, FloatingTriangle, SquigglyLine, ZigzagLine, MemphisBlob } from '@/components/MemphisPatterns';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-screen bg-memphis-yellow overflow-hidden pt-24 pb-16">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Decorative Elements */}
      <FloatingCircle 
        color="#FF006E" 
        size={80} 
        className="top-32 left-[5%] animate-float"
      />
      <FloatingCircle 
        color="#8338EC" 
        size={50} 
        className="top-48 right-[10%] animate-float-delayed"
      />
      <FloatingTriangle 
        color="#06FFA5" 
        size={60} 
        className="bottom-32 left-[8%] animate-wiggle"
        style={{ transform: 'rotate(15deg)' }}
      />
      <FloatingTriangle 
        color="#FB5607" 
        size={45} 
        className="top-40 right-[5%] animate-bounce-gentle"
        style={{ transform: 'rotate(-20deg)' }}
      />
      
      <SquigglyLine 
        className="top-24 left-[15%] animate-float-delayed"
        style={{ transform: 'rotate(-10deg)' }}
      />
      <SquigglyLine 
        className="bottom-40 right-[15%]"
        style={{ transform: 'rotate(10deg) scaleX(-1)' }}
      />
      <ZigzagLine 
        className="top-1/3 right-[20%]"
        style={{ transform: 'rotate(5deg)' }}
      />
      <ZigzagLine 
        className="bottom-1/4 left-[20%]"
        style={{ transform: 'rotate(-5deg) scaleX(-1)' }}
      />

      <MemphisBlob 
        color="#3A86FF" 
        variant={1}
        className="w-32 h-32 top-20 right-[25%] opacity-60 animate-float"
      />
      <MemphisBlob 
        color="#FF006E" 
        variant={2}
        className="w-24 h-24 bottom-20 right-[8%] opacity-50 animate-float-delayed"
      />
      <MemphisBlob 
        color="#06FFA5" 
        variant={3}
        className="w-28 h-28 top-1/2 left-[3%] opacity-50 animate-wiggle"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border-3 border-black rounded-full px-4 py-2 mb-6 shadow-[4px_4px_0px_0px_#000]">
              <Sparkles className="w-5 h-5 text-memphis-pink" />
              <span className="font-fredoka font-semibold text-sm">Ebook จิตวิทยาเด็กที่ควรมีติดบ้าน!</span>
            </div>

            {/* Title */}
            <h1 className="font-fredoka font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              <span className="block text-black text-shadow-memphis">ปลูกจิต</span>
              <span className="block">
                <span className="text-memphis-pink">วิทยา</span>
                <span className="text-memphis-purple">ให้</span>
                <span className="text-memphis-green">เติบ</span>
                <span className="text-memphis-blue">โต</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-black/80 mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
              หนังสือจิตวิทยาเด็กสำหรับพ่อแม่ยุคใหม่ 
              <span className="text-memphis-pink font-bold"> แบ่งตามช่วงวัย 0-12 ปี</span>
              {' '}เข้าใจลูกน้อยได้ลึกซึ้งกว่าที่เคย
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#000]">
                <BookOpen className="w-5 h-5 text-memphis-purple" />
                <span className="font-semibold text-sm">12 เล่ม</span>
              </div>
              <div className="flex items-center gap-2 bg-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#000]">
                <Heart className="w-5 h-5 text-memphis-pink" />
                <span className="font-semibold text-sm">4 ช่วงวัย</span>
              </div>
              <div className="flex items-center gap-2 bg-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#000]">
                <Sparkles className="w-5 h-5 text-memphis-yellow" />
                <span className="font-semibold text-sm">PDF ส่งทันที</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigate('books')}
                className="btn-memphis bg-memphis-pink flex items-center gap-2 text-lg"
              >
                เลือกซื้อหนังสือ
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('books')}
                className="btn-memphis bg-white text-black flex items-center gap-2 text-lg"
              >
                ดูหมวดหมู่
              </button>
            </div>
          </div>

          {/* Right Content - Featured Books Preview */}
          <div className="relative hidden lg:block">
            {/* Book Cards Stack */}
            <div className="relative w-full h-[500px]">
              {/* Book 1 */}
              <div 
                className="absolute top-0 left-0 w-48 h-72 bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_#000] transform -rotate-12 hover:rotate-0 transition-transform duration-300 z-30"
              >
                <img 
                  src="/images/book-0-1.jpg" 
                  alt="Book 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Book 2 */}
              <div 
                className="absolute top-8 left-24 w-48 h-72 bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_#000] transform rotate-6 hover:rotate-0 transition-transform duration-300 z-20"
              >
                <img 
                  src="/images/book-3-1.jpg" 
                  alt="Book 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Book 3 */}
              <div 
                className="absolute top-16 left-48 w-48 h-72 bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_#000] transform rotate-12 hover:rotate-0 transition-transform duration-300 z-10"
              >
                <img 
                  src="/images/book-6-1.jpg" 
                  alt="Book 3" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Book 4 */}
              <div 
                className="absolute top-24 left-72 w-48 h-72 bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_#000] transform -rotate-6 hover:rotate-0 transition-transform duration-300 z-0"
              >
                <img 
                  src="/images/book-10-1.jpg" 
                  alt="Book 4" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Elements around books */}
              <FloatingCircle 
                color="#FFBE0B" 
                size={40} 
                className="top-0 right-0 animate-bounce-gentle"
              />
              <FloatingCircle 
                color="#06FFA5" 
                size={30} 
                className="bottom-20 left-0 animate-float"
              />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-fredoka font-bold text-3xl md:text-4xl text-memphis-pink">12+</div>
              <div className="text-sm md:text-base font-semibold text-black/70">หนังสือคุณภาพ</div>
            </div>
            <div className="text-center">
              <div className="font-fredoka font-bold text-3xl md:text-4xl text-memphis-purple">4</div>
              <div className="text-sm md:text-base font-semibold text-black/70">ช่วงวัย</div>
            </div>
            <div className="text-center">
              <div className="font-fredoka font-bold text-3xl md:text-4xl text-memphis-green">2,500+</div>
              <div className="text-sm md:text-base font-semibold text-black/70">ครอบครัวที่ไว้วางใจ</div>
            </div>
            <div className="text-center">
              <div className="font-fredoka font-bold text-3xl md:text-4xl text-memphis-blue">4.8</div>
              <div className="text-sm md:text-base font-semibold text-black/70">คะแนนเฉลี่ย</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
