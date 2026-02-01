export type AgeCategory = 'baby' | 'preschool' | 'elementary' | 'preteen';

export type OrderStatus = 'pending' | 'paid' | 'verified' | 'completed' | 'cancelled';

// Database row types
export interface DbBook {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    price: number;
    original_price: number | null;
    cover_image_url: string | null;
    pdf_url: string | null;
    category: AgeCategory;
    age_range: string;
    pages: number | null;
    features: string[] | null;
    is_new: boolean;
    is_bestseller: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbOrder {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    items: OrderItem[];
    total_amount: number;
    status: OrderStatus;
    slip_image_url: string | null;
    transfer_date: string | null;
    transfer_time: string | null;
    pdfs_sent: boolean;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    pdf_url: string;
}

// Database type for Supabase client
export interface Database {
    public: {
        Tables: {
            books: {
                Row: DbBook;
                Insert: Omit<DbBook, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<DbBook, 'id' | 'created_at' | 'updated_at'>>;
            };
            orders: {
                Row: DbOrder;
                Insert: Omit<DbOrder, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<DbOrder, 'id' | 'created_at' | 'updated_at'>>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            age_category: AgeCategory;
            order_status: OrderStatus;
        };
    };
}

// Helper function to convert DB book to frontend Book type
export function dbBookToBook(dbBook: DbBook) {
    return {
        id: dbBook.id,
        title: dbBook.title,
        subtitle: dbBook.subtitle || '',
        description: dbBook.description || '',
        price: dbBook.price,
        originalPrice: dbBook.original_price || undefined,
        image: dbBook.cover_image_url || '/images/book-placeholder.jpg',
        pdfUrl: dbBook.pdf_url || '',
        category: dbBook.category,
        ageRange: dbBook.age_range,
        pages: dbBook.pages || 0,
        rating: 4.5, // Default rating until we add reviews
        reviews: 0,
        features: dbBook.features || [],
        isNew: dbBook.is_new,
        isBestseller: dbBook.is_bestseller,
        isActive: dbBook.is_active,
    };
}
