import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, CartItem, CustomerInfo, Order } from '@/types';

interface CartState {
  items: CartItem[];
  customer: CustomerInfo | null;
  currentOrder: Order | null;
  
  // Actions
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setCustomer: (customer: CustomerInfo) => void;
  createOrder: () => Order | null;
  setCurrentOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customer: null,
      currentOrder: null,

      addToCart: (book: Book) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === book.id);
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === book.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          return { items: [...state.items, { ...book, quantity: 1 }] };
        });
      },

      removeFromCart: (bookId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== bookId)
        }));
      },

      updateQuantity: (bookId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(bookId);
          return;
        }
        set((state) => ({
          items: state.items.map(item =>
            item.id === bookId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      setCustomer: (customer: CustomerInfo) => {
        set({ customer });
      },

      createOrder: () => {
        const { items, customer, getTotalPrice } = get();
        if (items.length === 0 || !customer) return null;

        const order: Order = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          items: [...items],
          customer: { ...customer },
          totalAmount: getTotalPrice(),
          status: 'pending',
          createdAt: new Date()
        };

        set({ currentOrder: order });
        return order;
      },

      setCurrentOrder: (order: Order | null) => {
        set({ currentOrder: order });
      },

      updateOrderStatus: (orderId: string, status: Order['status']) => {
        set((state) => ({
          currentOrder: state.currentOrder?.id === orderId
            ? { ...state.currentOrder, status }
            : state.currentOrder
        }));
      }
    }),
    {
      name: 'pop-playground-cart'
    }
  )
);
