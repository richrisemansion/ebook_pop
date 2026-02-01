import { Shield } from 'lucide-react';

interface AdminLoginButtonProps {
  onClick: () => void;
}

const AdminLoginButton: React.FC<AdminLoginButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-memphis-purple text-white px-4 py-3 border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
    >
      <div className="w-8 h-8 bg-white/20 border-2 border-white rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <Shield className="w-4 h-4" />
      </div>
      <div className="text-left">
        <span className="text-xs opacity-80 block">สำหรับเจ้าของร้าน</span>
        <span className="font-fredoka font-bold text-sm">Admin Login</span>
      </div>
    </button>
  );
};

export default AdminLoginButton;
