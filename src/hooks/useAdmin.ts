import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UseAdminAuthReturn {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

// Demo admin credentials for when Supabase is not configured
const DEMO_ADMIN_EMAIL = 'admin@popplayground.com';
const DEMO_ADMIN_PASSWORD = 'admin123';

export function useAdminAuth(): UseAdminAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing session
    useEffect(() => {
        const checkSession = async () => {
            if (!isSupabaseConfigured()) {
                // Check localStorage for demo session
                const demoSession = localStorage.getItem('demo_admin_session');
                if (demoSession) {
                    setUser({ email: DEMO_ADMIN_EMAIL } as User);
                }
                setLoading(false);
                return;
            }

            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);
                setUser(currentSession?.user || null);
            } catch (err) {
                console.error('Error checking session:', err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Subscribe to auth changes if Supabase is configured
        if (isSupabaseConfigured()) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (_event, newSession) => {
                    setSession(newSession);
                    setUser(newSession?.user || null);
                }
            );

            return () => {
                subscription.unsubscribe();
            };
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        // Always allow demo credentials for testing
        if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
            localStorage.setItem('demo_admin_session', 'true');
            setUser({ email: DEMO_ADMIN_EMAIL } as User);
            setLoading(false);
            return true;
        }

        // If not demo credentials and Supabase is configured, try Supabase Auth
        if (isSupabaseConfigured()) {
            try {
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError) {
                    if (authError.message.includes('Invalid login')) {
                        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
                    } else {
                        setError(authError.message);
                    }
                    setLoading(false);
                    return false;
                }

                setSession(data.session);
                setUser(data.user);
                setLoading(false);
                return true;
            } catch (err) {
                console.error('Login error:', err);
                setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
                setLoading(false);
                return false;
            }
        }

        // Not demo credentials and Supabase not configured
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setLoading(false);
        return false;
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);

        if (!isSupabaseConfigured()) {
            localStorage.removeItem('demo_admin_session');
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        session,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
    };
}

// Demo credentials info for display
export const getDemoCredentials = () => ({
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
});
