import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { FloatingCircle, FloatingTriangle, MemphisBlob } from '@/components/MemphisPatterns';
import { useAdminAuth, getDemoCredentials } from '@/hooks/useAdmin';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AdminLoginSectionProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLoginSection: React.FC<AdminLoginSectionProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error, isAuthenticated } = useAdminAuth();
  const demoCredentials = getDemoCredentials();
  const isDemo = !isSupabaseConfigured();

  // Auto-login if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onLogin();
    }
  }, [isAuthenticated, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onLogin();
    }
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  return (
    <section className="relative min-h-screen bg-memphis-purple py-24 overflow-hidden flex items-center justify-center">
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

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          กลับไปหน้าแรก
        </button>

        {/* Login Card */}
        <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#000]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-memphis-purple border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-fredoka font-bold text-3xl text-black mb-2">
              Admin Login
            </h2>
            <p className="text-black/60">
              เข้าสู่ระบบสำหรับผู้ดูแล
            </p>
            {isDemo && (
              <span className="inline-block mt-2 px-3 py-1 bg-memphis-yellow border-2 border-black rounded-full text-xs font-semibold">
                Demo Mode
              </span>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-semibold text-sm mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-sm mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full pl-12 pr-12 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 rounded-xl p-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full btn-memphis bg-memphis-purple flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  เข้าสู่ระบบ
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          {isDemo && (
            <div className="mt-6 p-4 bg-memphis-yellow/20 border-2 border-memphis-yellow rounded-xl">
              <p className="text-sm text-black/70 text-center mb-2">
                <strong>Demo Mode:</strong> ยังไม่ได้เชื่อมต่อ Supabase
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full py-2 bg-memphis-yellow border-2 border-black rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
              >
                ใช้ข้อมูล Demo เข้าสู่ระบบ
              </button>
              <p className="text-xs text-black/50 text-center mt-2">
                Email: {demoCredentials.email}<br />
                Password: {demoCredentials.password}
              </p>
            </div>
          )}

          {!isDemo && (
            <div className="mt-6 p-4 bg-gray-100 border-2 border-gray-300 rounded-xl">
              <p className="text-sm text-gray-600 text-center">
                เข้าสู่ระบบด้วยบัญชี Admin ที่สร้างใน Supabase
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminLoginSection;
