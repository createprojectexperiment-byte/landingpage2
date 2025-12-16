import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface HeroProps {
    onUnlock: () => void;
    isAdmin: boolean;
}

const TAPS_REQUIRED = 5;
const WAIT_DURATION_MS = 10000;
const TAP_RESET_MS = 1000;

const Hero: React.FC<HeroProps> = ({ onUnlock, isAdmin }) => {
    // Logika gesture dipindahkan ke sini agar tidak perlu import file luar yang bikin error
    const [tapCount, setTapCount] = useState(0);
    const tapTimeoutRef = useRef<number | null>(null);
    const waitTimeoutRef = useRef<number | null>(null);

    const resetTaps = useCallback(() => {
        setTapCount(0);
        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
            tapTimeoutRef.current = null;
        }
    }, []);

    const handleTap = useCallback(() => {
        if (waitTimeoutRef.current) return;

        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);

        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
        }
        tapTimeoutRef.current = window.setTimeout(resetTaps, TAP_RESET_MS);

        if (newTapCount === TAPS_REQUIRED) {
            clearTimeout(tapTimeoutRef.current); 
            toast.info(`Secret gesture activated. Please wait ${WAIT_DURATION_MS / 1000} seconds...`);
            
            waitTimeoutRef.current = window.setTimeout(() => {
                toast.success('Admin access unlocked!');
                onUnlock();
                resetTaps();
                waitTimeoutRef.current = null;
            }, WAIT_DURATION_MS);
        } 
    }, [tapCount, onUnlock, resetTaps]);
    
    useEffect(() => {
        return () => {
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
            if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
        };
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark py-20 px-4 text-center">
            <div className={`container mx-auto max-w-4xl relative ${isAdmin ? 'pt-16 md:pt-0' : ''}`}>
                <h1 
                    onClick={isAdmin ? undefined : handleTap}
                    className="text-4xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white select-none cursor-default active:scale-95 transition-transform origin-center"
                >
                    Welcome To <span className="text-brand-primary">DFX Store</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Pusat Tools-Tools Trading Bermanfaat
                </p>
                
                <div className="mt-8 relative z-20">
                    <a 
                        href="#products"
                        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 inline-block"
                    >
                        Lihat Produk
                    </a>
                </div>
            </div>
        </section>
    );
};
export default Hero;
