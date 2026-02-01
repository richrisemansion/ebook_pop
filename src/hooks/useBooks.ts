import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { dbBookToBook } from '@/types/database';
import type { DbBook } from '@/types/database';
import type { Book, AgeCategory } from '@/types';
// Import static books as fallback when Supabase is not configured
import { books as staticBooks, categories as staticCategories } from '@/data/books';

interface UseBooksReturn {
    books: Book[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    getBooksByCategory: (category: AgeCategory) => Book[];
    getBookById: (id: string) => Book | undefined;
    getFeaturedBooks: () => Book[];
}

export function useBooks(): UseBooksReturn {
    const [books, setBooks] = useState<Book[]>(staticBooks);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = useCallback(async () => {
        // If Supabase is not configured, use static data
        if (!isSupabaseConfigured()) {
            setBooks(staticBooks);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: supabaseError } = await supabase
                .from('books')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (supabaseError) {
                throw supabaseError;
            }

            if (data) {
                const convertedBooks = (data as DbBook[]).map(dbBookToBook);
                setBooks(convertedBooks);
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('ไม่สามารถโหลดข้อมูลหนังสือได้');
            // Fallback to static data on error
            setBooks(staticBooks);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const getBooksByCategory = useCallback((category: AgeCategory): Book[] => {
        return books.filter(book => book.category === category);
    }, [books]);

    const getBookById = useCallback((id: string): Book | undefined => {
        return books.find(book => book.id === id);
    }, [books]);

    const getFeaturedBooks = useCallback((): Book[] => {
        return books.filter(book => book.isBestseller || book.isNew).slice(0, 6);
    }, [books]);

    return {
        books,
        loading,
        error,
        refetch: fetchBooks,
        getBooksByCategory,
        getBookById,
        getFeaturedBooks,
    };
}

// Hook for admin to manage books (CRUD operations)
interface UseAdminBooksReturn {
    books: Book[];
    loading: boolean;
    error: string | null;
    addBook: (book: Omit<DbBook, 'id' | 'created_at' | 'updated_at'>) => Promise<DbBook | null>;
    updateBook: (id: string, updates: Partial<DbBook>) => Promise<boolean>;
    deleteBook: (id: string) => Promise<boolean>;
    uploadCoverImage: (file: File, bookId: string) => Promise<string | null>;
    uploadPdfFile: (file: File, bookId: string) => Promise<string | null>;
    refetch: () => Promise<void>;
}

export function useAdminBooks(): UseAdminBooksReturn {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllBooks = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setBooks(staticBooks);
            return;
        }

        setLoading(true);
        try {
            const { data, error: supabaseError } = await supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false });

            if (supabaseError) throw supabaseError;

            if (data) {
                const convertedBooks = (data as DbBook[]).map(dbBookToBook);
                setBooks(convertedBooks);
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('ไม่สามารถโหลดข้อมูลหนังสือได้');
            setBooks(staticBooks);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllBooks();
    }, [fetchAllBooks]);

    const addBook = async (book: Omit<DbBook, 'id' | 'created_at' | 'updated_at'>): Promise<DbBook | null> => {
        if (!isSupabaseConfigured()) {
            setError('Supabase ยังไม่ได้ตั้งค่า');
            return null;
        }

        try {
            const { data, error: insertError } = await supabase
                .from('books')
                .insert(book as any)
                .select()
                .single();

            if (insertError) throw insertError;
            await fetchAllBooks();
            return data as DbBook;
        } catch (err) {
            console.error('Error adding book:', err);
            setError('ไม่สามารถเพิ่มหนังสือได้');
            return null;
        }
    };

    const updateBook = async (id: string, updates: Partial<DbBook>): Promise<boolean> => {
        if (!isSupabaseConfigured()) {
            setError('Supabase ยังไม่ได้ตั้งค่า');
            return false;
        }

        try {
            const { error: updateError } = await supabase
                .from('books')
                .update({ ...updates, updated_at: new Date().toISOString() } as any)
                .eq('id', id);

            if (updateError) throw updateError;
            await fetchAllBooks();
            return true;
        } catch (err) {
            console.error('Error updating book:', err);
            setError('ไม่สามารถแก้ไขหนังสือได้');
            return false;
        }
    };

    const deleteBook = async (id: string): Promise<boolean> => {
        if (!isSupabaseConfigured()) {
            setError('Supabase ยังไม่ได้ตั้งค่า');
            return false;
        }

        try {
            // Soft delete - set is_active to false
            const { error: deleteError } = await supabase
                .from('books')
                .update({ is_active: false, updated_at: new Date().toISOString() } as any)
                .eq('id', id);

            if (deleteError) throw deleteError;
            await fetchAllBooks();
            return true;
        } catch (err) {
            console.error('Error deleting book:', err);
            setError('ไม่สามารถลบหนังสือได้');
            return false;
        }
    };

    const uploadCoverImage = async (file: File, bookId: string): Promise<string | null> => {
        if (!isSupabaseConfigured()) {
            setError('Supabase ยังไม่ได้ตั้งค่า');
            return null;
        }

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${bookId}-cover.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('book-covers')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('book-covers')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (err) {
            console.error('Error uploading cover:', err);
            setError('ไม่สามารถอัปโหลดรูปปกได้');
            return null;
        }
    };

    const uploadPdfFile = async (file: File, bookId: string): Promise<string | null> => {
        if (!isSupabaseConfigured()) {
            setError('Supabase ยังไม่ได้ตั้งค่า');
            return null;
        }

        try {
            const fileName = `${bookId}.pdf`;

            const { error: uploadError } = await supabase.storage
                .from('book-pdfs')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get signed URL for private bucket
            const { data } = await supabase.storage
                .from('book-pdfs')
                .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

            return data?.signedUrl || null;
        } catch (err) {
            console.error('Error uploading PDF:', err);
            setError('ไม่สามารถอัปโหลด PDF ได้');
            return null;
        }
    };

    return {
        books,
        loading,
        error,
        addBook,
        updateBook,
        deleteBook,
        uploadCoverImage,
        uploadPdfFile,
        refetch: fetchAllBooks,
    };
}

// Export static data helpers for compatibility
export { staticCategories as categories };
