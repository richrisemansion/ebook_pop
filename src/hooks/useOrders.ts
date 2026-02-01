import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { DbOrder, OrderStatus, OrderItem } from '@/types/database';

// Demo orders for when Supabase is not configured
const demoOrders: DbOrder[] = [
    {
        id: 'demo-1',
        order_number: 'ORD-2024-001',
        customer_name: 'คุณสมหญิง ใจดี',
        customer_email: 'somying@example.com',
        customer_phone: '081-234-5678',
        items: [
            { id: 'baby-1', title: 'จิตวิทยาลึกลับของทารก', price: 299, quantity: 1, pdf_url: '' }
        ],
        total_amount: 299,
        status: 'pending',
        slip_image_url: null,
        transfer_date: null,
        transfer_time: null,
        pdfs_sent: false,
        admin_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'demo-2',
        order_number: 'ORD-2024-002',
        customer_name: 'คุณประยุทธ์ รักลูก',
        customer_email: 'prayuth@example.com',
        customer_phone: '092-345-6789',
        items: [
            { id: 'preschool-1', title: 'จิตใจน้อยๆ ที่อยากรู้อยากเห็น', price: 329, quantity: 1, pdf_url: '' },
            { id: 'elementary-1', title: 'ความมั่นใจเริ่มต้นที่บ้าน', price: 379, quantity: 1, pdf_url: '' }
        ],
        total_amount: 708,
        status: 'verified',
        slip_image_url: '/images/book-0-1.jpg',
        transfer_date: '2024-01-15',
        transfer_time: '14:30',
        pdfs_sent: true,
        admin_notes: null,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
    },
];

interface UseOrdersReturn {
    orders: DbOrder[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    getOrdersByStatus: (status: OrderStatus) => DbOrder[];
    getOrderById: (id: string) => DbOrder | undefined;
}

export function useOrders(): UseOrdersReturn {
    const [orders, setOrders] = useState<DbOrder[]>(demoOrders);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setOrders(demoOrders);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: supabaseError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (supabaseError) throw supabaseError;

            if (data) {
                setOrders(data as DbOrder[]);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('ไม่สามารถโหลดข้อมูลออเดอร์ได้');
            setOrders(demoOrders);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();

        // Subscribe to realtime updates if Supabase is configured
        if (isSupabaseConfigured()) {
            const channel = supabase
                .channel('orders-changes')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'orders' },
                    () => {
                        fetchOrders();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [fetchOrders]);

    const getOrdersByStatus = useCallback((status: OrderStatus): DbOrder[] => {
        return orders.filter(order => order.status === status);
    }, [orders]);

    const getOrderById = useCallback((id: string): DbOrder | undefined => {
        return orders.find(order => order.id === id);
    }, [orders]);

    return {
        orders,
        loading,
        error,
        refetch: fetchOrders,
        getOrdersByStatus,
        getOrderById,
    };
}

// Hook for admin to manage orders
interface UseAdminOrdersReturn {
    orders: DbOrder[];
    loading: boolean;
    error: string | null;
    updateOrderStatus: (id: string, status: OrderStatus, notes?: string) => Promise<boolean>;
    markPdfsSent: (id: string) => Promise<boolean>;
    refetch: () => Promise<void>;
    stats: {
        pending: number;
        verified: number;
        completed: number;
        totalRevenue: number;
    };
}

export function useAdminOrders(): UseAdminOrdersReturn {
    const { orders, loading, error, refetch } = useOrders();

    const updateOrderStatus = async (id: string, status: OrderStatus, notes?: string): Promise<boolean> => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, skipping order update');
            return true; // Return true for demo mode
        }

        try {
            const updates: Partial<DbOrder> = {
                status,
                updated_at: new Date().toISOString(),
            };
            if (notes) {
                updates.admin_notes = notes;
            }

            const { error: updateError } = await supabase
                .from('orders')
                .update(updates as any)
                .eq('id', id);

            if (updateError) throw updateError;
            await refetch();
            return true;
        } catch (err) {
            console.error('Error updating order status:', err);
            return false;
        }
    };

    const markPdfsSent = async (id: string): Promise<boolean> => {
        if (!isSupabaseConfigured()) {
            return true;
        }

        try {
            // 1. Call Edge Function to send email
            console.log('Invoking send-order-email for order:', id);
            const { data: emailData, error: emailError } = await supabase.functions.invoke('send-order-email', {
                body: { orderId: id }
            });

            if (emailError) {
                console.error('Error sending email via Edge Function:', emailError);
                // We might still want to mark as sent manually if it's a transient error, 
                // but for now let's treat it as a failure so user can retry.
                // Or maybe we Log it but continue updating DB status if the function succeeded partially?
                // Let's assume if function fails, we tell user.
                throw emailError;
            }

            console.log('Email sent successfully:', emailData);

            // 2. Update status in DB
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    pdfs_sent: true,
                    status: 'completed',
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', id);

            if (updateError) throw updateError;
            await refetch();
            return true;
        } catch (err) {
            console.error('Error marking PDFs sent:', err);
            return false;
        }
    };

    // Calculate stats
    const stats = {
        pending: orders.filter(o => o.status === 'pending' || o.status === 'paid').length,
        verified: orders.filter(o => o.status === 'verified').length,
        completed: orders.filter(o => o.status === 'completed').length,
        totalRevenue: orders
            .filter(o => o.status === 'completed' || o.status === 'verified')
            .reduce((sum, o) => sum + o.total_amount, 0),
    };

    return {
        orders,
        loading,
        error,
        updateOrderStatus,
        markPdfsSent,
        refetch,
        stats,
    };
}

// Hook for creating orders (customer side)
interface UseCreateOrderReturn {
    createOrder: (orderData: CreateOrderInput) => Promise<DbOrder | null>;
    uploadSlip: (orderId: string, file: File, transferDate: string, transferTime: string) => Promise<boolean>;
    loading: boolean;
    error: string | null;
}

interface CreateOrderInput {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
}

export function useCreateOrder(): UseCreateOrderReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateOrderNumber = () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    };

    const createOrder = async (orderData: CreateOrderInput): Promise<DbOrder | null> => {
        setLoading(true);
        setError(null);

        const orderNumber = generateOrderNumber();

        // If Supabase is not configured, return a mock order
        if (!isSupabaseConfigured()) {
            const mockOrder: DbOrder = {
                id: `mock-${Date.now()}`,
                order_number: orderNumber,
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone,
                items: orderData.items,
                total_amount: orderData.totalAmount,
                status: 'pending',
                slip_image_url: null,
                transfer_date: null,
                transfer_time: null,
                pdfs_sent: false,
                admin_notes: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setLoading(false);
            return mockOrder;
        }

        try {
            const { data, error: insertError } = await supabase
                .from('orders')
                .insert({
                    order_number: orderNumber,
                    customer_name: orderData.customerName,
                    customer_email: orderData.customerEmail,
                    customer_phone: orderData.customerPhone,
                    items: orderData.items,
                    total_amount: orderData.totalAmount,
                    status: 'pending',
                    pdfs_sent: false,
                } as any)
                .select()
                .single();

            if (insertError) throw insertError;
            return data as DbOrder;
        } catch (err) {
            console.error('Error creating order:', err);
            setError('ไม่สามารถสร้างออเดอร์ได้');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const uploadSlip = async (
        orderId: string,
        file: File,
        transferDate: string,
        transferTime: string
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured()) {
            setLoading(false);
            return true; // Mock success
        }

        try {
            // Upload slip image
            const fileExt = file.name.split('.').pop();
            const fileName = `${orderId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('order-slips')
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            // Store the file path (admin will use signed URLs to view)
            const slipPath = `order-slips/${fileName}`;

            // Update order with slip info
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    slip_image_url: slipPath,
                    transfer_date: transferDate,
                    transfer_time: transferTime,
                    status: 'paid',
                    updated_at: new Date().toISOString(),
                } as any)
                .eq('id', orderId);

            if (updateError) {
                console.error('Update error:', updateError);
                throw updateError;
            }

            // Fetch the updated order to send notification
            const { data: updatedOrder } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            // Send Telegram notification to admin
            if (updatedOrder) {
                try {
                    // Generate a signed URL for the slip image to send to Telegram
                    // Give it a long expiry (e.g., 7 days) so admin can view it later
                    let slipUrlForTelegram = '';
                    if (updatedOrder.slip_image_url) {
                        const path = updatedOrder.slip_image_url.replace('order-slips/', '');
                        const { data: signedData } = await supabase
                            .storage
                            .from('order-slips')
                            .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days

                        if (signedData?.signedUrl) {
                            slipUrlForTelegram = signedData.signedUrl;
                        }
                    }

                    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                    await fetch(`${supabaseUrl}/functions/v1/notify-telegram`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId: updatedOrder.id,
                            orderNumber: updatedOrder.order_number,
                            customerName: updatedOrder.customer_name,
                            customerEmail: updatedOrder.customer_email,
                            customerPhone: updatedOrder.customer_phone,
                            totalAmount: updatedOrder.total_amount,
                            itemCount: updatedOrder.items?.length || 0,
                            slipImageUrl: slipUrlForTelegram // Send the full signed URL
                        }),
                    });
                } catch (notifyError) {
                    console.error('Telegram notification error:', notifyError);
                    // Don't fail the upload if notification fails
                }
            }

            return true;
        } catch (err) {
            console.error('Error uploading slip:', err);
            setError('ไม่สามารถอัปโหลดสลิปได้');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        createOrder,
        uploadSlip,
        loading,
        error,
    };
}
