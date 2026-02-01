import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart, Sparkles } from 'lucide-react';
import { FloatingCircle, FloatingTriangle } from '@/components/MemphisPatterns';

const FooterSection: React.FC = () => {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Decorative Elements */}
      <FloatingCircle color="#FF006E" size={40} className="top-10 left-[5%] opacity-50" />
      <FloatingCircle color="#FFBE0B" size={30} className="top-20 right-[10%] opacity-50" />
      <FloatingTriangle color="#06FFA5" size={35} className="bottom-20 left-[8%] opacity-30" />

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-memphis-pink border-3 border-white rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="font-fredoka font-bold text-2xl">
                <span className="text-memphis-pink">Pop</span>
                <span className="text-memphis-yellow">Play</span>
                <span className="text-memphis-green">ground</span>
              </span>
            </div>
            <p className="text-white/70 mb-6">
              Ebook จิตวิทยาเด็กที่ควรมีติดบ้าน สำหรับพ่อแม่ยุคใหม่ที่ต้องการเข้าใจลูกน้อยอย่างลึกซึ้ง
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-memphis-pink border-2 border-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-memphis-purple border-2 border-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-memphis-blue border-2 border-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-memphis-yellow" />
              หมวดหมู่
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-memphis-pink transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-memphis-pink rounded-full"></span>
                  วัยทารก (0-2 ปี)
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-memphis-yellow transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-memphis-yellow rounded-full"></span>
                  วัยอนุบาล (3-5 ปี)
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-memphis-green transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-memphis-green rounded-full"></span>
                  วัยประถม (6-9 ปี)
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-memphis-purple transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-memphis-purple rounded-full"></span>
                  วัยก่อนวัยรุ่น (10-12 ปี)
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-memphis-green" />
              ช่วยเหลือ
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">วิธีสั่งซื้อ</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">วิธีชำระเงิน</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">การรับสินค้า</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">นโยบายการคืนเงิน</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">คำถามที่พบบ่อย</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-memphis-blue" />
              ติดต่อเรา
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-memphis-pink flex-shrink-0 mt-0.5" />
                <span className="text-white/70">hello@popplayground.co.th</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-memphis-yellow flex-shrink-0 mt-0.5" />
                <span className="text-white/70">02-123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-memphis-green flex-shrink-0 mt-0.5" />
                <span className="text-white/70">123 ถนนสุขุมวิท กรุงเทพฯ 10110</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-fredoka font-bold text-xl mb-1">รับข่าวสารและส่วนลดพิเศษ</h4>
              <p className="text-white/70 text-sm">สมัครรับจดหมายข่าวเพื่อรับข้อมูลหนังสือใหม่และโปรโมชั่น</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                className="flex-1 md:w-64 px-4 py-3 bg-white text-black border-3 border-black rounded-xl focus:outline-none"
              />
              <button className="px-6 py-3 bg-memphis-pink border-3 border-black rounded-xl font-fredoka font-bold hover:bg-memphis-pink/80 transition-colors">
                สมัคร
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © 2024 Pop Playground. All rights reserved.
          </p>
          <p className="text-white/50 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-memphis-pink fill-memphis-pink" /> for parents everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
