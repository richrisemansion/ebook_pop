import React, { useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Eye, Mail, Search, Filter, ExternalLink } from 'lucide-react';
import { useAdminOrders } from '@/hooks/useOrders';
import type { OrderStatus } from '@/types/database';
import { FloatingCircle } from '@/components/MemphisPatterns';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AdminOrdersSectionProps {
    onBack: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'รอชำระเงิน', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" /> },
    paid: { label: 'รอตรวจสอบ', color: 'bg-blue-100 text-blue-700', icon: <Package className="w-4 h-4" /> },
    verified: { label: 'ยืนยันแล้ว', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
    completed: { label: 'สำเร็จ', color: 'bg-purple-100 text-purple-700', icon: <CheckCircle className="w-4 h-4" /> },
    cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> },
};

const AdminOrdersSection: React.FC<AdminOrdersSectionProps> = ({ onBack }) => {
    const { orders, loading, updateOrderStatus, markPdfsSent, stats } = useAdminOrders();
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleVerifyAndSend = async (orderId: string) => {
        // Prevent double click
        if (loading) return;

        const isPending = orders.find(o => o.id === orderId)?.status === 'pending';
        const loadingToast = toast.loading(isPending ? 'กำลังยืนยันยอดเงิน...' : 'กำลังดำเนินการ...');

        try {
            // 1. Verify Payment
            console.log('Verifying order:', orderId);
            const verifySuccess = await updateOrderStatus(orderId, 'verified');
            if (!verifySuccess) {
                toast.error('ยืนยันยอดเงินไม่สำเร็จ', { id: loadingToast });
                return;
            }

            // 2. Send PDFs (Auto send)
            console.log('Sending PDFs for order:', orderId);
            const sendSuccess = await markPdfsSent(orderId);
            if (sendSuccess) {
                toast.success('ทำรายการสำเร็จ! (ยืนยันและส่ง PDF แล้ว)', { id: loadingToast });
                setSelectedOrder(null); // Close dialog explicitly
            } else {
                toast.warning('ยืนยันยอดเงินแล้ว แต่ส่ง PDF ไม่สำเร็จ กรุณากดส่งใหม่', { id: loadingToast });
                // Don't close dialog so they can try "Resend PDF"
            }
        } catch (error) {
            console.error('Error in handleVerifyAndSend:', error);
            toast.error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ', { id: loadingToast });
        }
    };

    const handleReject = async (orderId: string) => {
        if (!confirm('ยืนยันที่จะปฏิเสธ/ยกเลิกคำสั่งซื้อนี้?')) return;

        const success = await updateOrderStatus(orderId, 'cancelled', 'Admin ยกเลิก/ปฏิเสธ');
        if (success) {
            toast.success('ยกเลิกคำสั่งซื้อแล้ว');
            setSelectedOrder(null);
        } else {
            toast.error('เกิดข้อผิดพลาด');
        }
    };

    const handleResendPdfs = async (orderId: string) => {
        const loadingToast = toast.loading('กำลังส่งอีเมล...');
        const success = await markPdfsSent(orderId);
        if (success) {
            toast.success('ส่ง PDF ซ้ำเรียบร้อยแล้ว!', { id: loadingToast });
        } else {
            toast.error('ส่ง PDF ไม่สำเร็จ', { id: loadingToast });
        }
    };

    const selectedOrderData = orders.find(o => o.id === selectedOrder);

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
            <FloatingCircle color="#06FFA5" size={30} className="bottom-20 left-[3%] opacity-30" />

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-black/70 hover:text-black font-semibold mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        กลับไป Dashboard
                    </button>

                    <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                        <h1 className="font-fredoka font-bold text-2xl text-black mb-2">จัดการคำสั่งซื้อ</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
                                <p className="text-sm text-yellow-700">รอตรวจสอบ</p>
                                <p className="font-fredoka font-bold text-2xl text-yellow-700">{stats.pending}</p>
                            </div>
                            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3">
                                <p className="text-sm text-green-700">ยืนยันแล้ว</p>
                                <p className="font-fredoka font-bold text-2xl text-green-700">{stats.verified}</p>
                            </div>
                            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-3">
                                <p className="text-sm text-purple-700">สำเร็จ</p>
                                <p className="font-fredoka font-bold text-2xl text-purple-700">{stats.completed}</p>
                            </div>
                            <div className="bg-memphis-green/20 border-2 border-memphis-green rounded-xl p-3">
                                <p className="text-sm text-black/70">รายได้รวม</p>
                                <p className="font-fredoka font-bold text-2xl text-black">฿{stats.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border-4 border-black rounded-3xl p-4 mb-6 shadow-[6px_6px_0px_0px_#000]">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ค้นหา Order ID, ชื่อ, อีเมล, เบอร์โทร..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-3 border-black rounded-xl focus:outline-none focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
                                className="pl-12 pr-8 py-3 bg-gray-50 border-3 border-black rounded-xl focus:outline-none focus:bg-white transition-colors appearance-none cursor-pointer"
                            >
                                <option value="all">ทุกสถานะ</option>
                                <option value="pending">รอชำระเงิน</option>
                                <option value="paid">รอตรวจสอบ</option>
                                <option value="verified">ยืนยันแล้ว</option>
                                <option value="completed">สำเร็จ</option>
                                <option value="cancelled">ยกเลิก</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                    <h2 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
                        <Package className="w-6 h-6 text-memphis-purple" />
                        คำสั่งซื้อ ({filteredOrders.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-memphis-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-black/60">กำลังโหลด...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-black/20 mx-auto mb-4" />
                            <p className="text-black/60">ไม่พบคำสั่งซื้อ</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border-3 border-black rounded-2xl p-4 hover:shadow-[4px_4px_0px_0px_#000] transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-bold">{order.order_number}</span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[order.status].color}`}>
                                                    {statusConfig[order.status].icon}
                                                    {statusConfig[order.status].label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-black/70">{order.customer_name}</p>
                                            <p className="text-xs text-black/50">{order.customer_email}</p>
                                        </div>

                                        {/* Amount & Date */}
                                        <div className="text-right">
                                            <p className="font-fredoka font-bold text-xl text-memphis-pink">
                                                ฿{order.total_amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-black/50">
                                                {new Date(order.created_at).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order.id)}
                                                className="p-2 bg-gray-100 border-2 border-black rounded-lg hover:bg-gray-200 transition-colors"
                                                title="ดูรายละเอียด"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            {order.status === 'paid' && (
                                                <button
                                                    onClick={() => handleVerifyAndSend(order.id)}
                                                    className="p-2 bg-memphis-green border-2 border-black rounded-lg hover:opacity-80 transition-opacity"
                                                    title="ยืนยันและส่ง PDF"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl bg-white border-4 border-black rounded-3xl p-0 overflow-hidden shadow-[8px_8px_0px_0px_#000]">
                    {selectedOrderData && (
                        <div className="p-6">
                            <DialogHeader>
                                <DialogTitle className="font-fredoka font-bold text-2xl flex items-center gap-2">
                                    <Package className="w-6 h-6 text-memphis-purple" />
                                    {selectedOrderData.order_number}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="mt-4 space-y-4">
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig[selectedOrderData.status].color}`}>
                                        {statusConfig[selectedOrderData.status].icon}
                                        {statusConfig[selectedOrderData.status].label}
                                    </span>
                                    {selectedOrderData.pdfs_sent && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-memphis-green/20 text-green-700 rounded-full text-xs font-semibold">
                                            <Mail className="w-3 h-3" />
                                            ส่ง PDF แล้ว
                                        </span>
                                    )}
                                </div>

                                {/* Customer Info */}
                                <div className="bg-gray-50 rounded-xl p-4 border-2 border-black/10">
                                    <h4 className="font-semibold mb-2">ข้อมูลลูกค้า</h4>
                                    <p className="text-sm">ชื่อ: {selectedOrderData.customer_name}</p>
                                    <p className="text-sm">อีเมล: {selectedOrderData.customer_email}</p>
                                    <p className="text-sm">โทร: {selectedOrderData.customer_phone}</p>
                                </div>

                                {/* Items */}
                                <div className="bg-gray-50 rounded-xl p-4 border-2 border-black/10">
                                    <h4 className="font-semibold mb-2">รายการสินค้า ({selectedOrderData.items.length})</h4>
                                    <div className="space-y-2">
                                        {selectedOrderData.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span>{item.title} x{item.quantity}</span>
                                                <span className="font-semibold">฿{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 flex justify-between font-fredoka font-bold">
                                            <span>รวม</span>
                                            <span className="text-memphis-pink">฿{selectedOrderData.total_amount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Slip Image */}
                                {selectedOrderData.slip_image_url && (
                                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-black/10">
                                        <h4 className="font-semibold mb-2">สลิปโอนเงิน</h4>
                                        <div className="flex gap-4">
                                            <img
                                                src={selectedOrderData.slip_image_url}
                                                alt="Slip"
                                                className="w-40 h-auto border-2 border-black rounded-lg"
                                            />
                                            <div className="text-sm">
                                                <p>วันที่โอน: {selectedOrderData.transfer_date || '-'}</p>
                                                <p>เวลา: {selectedOrderData.transfer_time || '-'}</p>
                                                <a
                                                    href={selectedOrderData.slip_image_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-memphis-blue hover:underline mt-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    ดูขนาดเต็ม
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row gap-2 pt-4">
                                    {/* Actions for Pending and Paid orders */}
                                    {['pending', 'paid'].includes(selectedOrderData.status) && (
                                        <>
                                            <button
                                                onClick={() => handleVerifyAndSend(selectedOrderData.id)}
                                                className="flex-1 btn-memphis bg-memphis-green flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                {selectedOrderData.status === 'pending' ? 'ยืนยันยอดเงิน (Manual)' : 'ยืนยันยอดเงิน & ส่ง PDF'}
                                            </button>
                                            <button
                                                onClick={() => handleReject(selectedOrderData.id)}
                                                className="flex-1 btn-memphis bg-red-white text-red-600 border-red-200 flex items-center justify-center gap-2 hover:bg-red-50"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                {selectedOrderData.status === 'pending' ? 'ยกเลิกออเดอร์' : 'ปฏิเสธสลิป'}
                                            </button>
                                        </>
                                    )}

                                    {/* Show Resend button if verified or completed */}
                                    {['verified', 'completed'].includes(selectedOrderData.status) && (
                                        <button
                                            onClick={() => handleResendPdfs(selectedOrderData.id)}
                                            className="flex-1 btn-memphis bg-memphis-pink flex items-center justify-center gap-2 text-white"
                                        >
                                            <Mail className="w-5 h-5" />
                                            {selectedOrderData.pdfs_sent ? 'ส่ง PDF ซ้ำ' : 'ส่ง PDF ให้ลูกค้า'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default AdminOrdersSection;
