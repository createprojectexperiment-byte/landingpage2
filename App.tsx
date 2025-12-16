import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabase';
import type { Product, Testimonial } from './types';
import Hero from './components/Hero';
import ProductsSection from './components/ProductsSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AdminBanner from './components/AdminBanner';
import ThemeToggle from './components/ThemeToggle';
import { LoadingIcon } from './components/Icons';

const App: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    const [products, setProducts] = useState<Product[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch public data from our own caching API endpoint instead of directly from Supabase.
            const response = await fetch('/api/data');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `API error: ${response.statusText}`);
            }
            const data = await response.json();
            
            setProducts(data.products || []);
            setTestimonials(data.testimonials || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load page data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsAdmin(!!session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsAdmin(!!session);
        });

        return () => subscription.unsubscribe();
    }, [fetchData]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Sign out failed.');
        } else {
            toast.success('Signed out successfully.');
            setIsAdmin(false);
        }
    };
    
    const onUnlock = () => {
        if (!session) {
            setShowAuthModal(true);
        } else {
            toast.info('You are already logged in as admin.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-light dark:bg-brand-dark">
                <LoadingIcon className="w-12 h-12 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative text-gray-800 dark:text-gray-200">
            <Toaster position="top-right" richColors />
            {isAdmin && <AdminBanner onSignOut={handleSignOut} />}
            
            <div className={`fixed top-4 right-4 z-50 ${isAdmin ? 'pt-16 md:pt-0' : ''}`}>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>

            <Hero onUnlock={onUnlock} isAdmin={isAdmin}/>
            <ProductsSection products={products} isAdmin={isAdmin} refreshData={fetchData} />
            <TestimonialsSection testimonials={testimonials} isAdmin={isAdmin} refreshData={fetchData} />
            <Footer />

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </div>
    );
};

export default App;
