import React from 'react';
import { useAdminGesture } from '../hooks/useAdminGesture';

interface HeroProps {
    onUnlock: () => void;
    isAdmin: boolean;
}

const Hero: React.FC<HeroProps> = ({ onUnlock, isAdmin }) => {
    const { handleTap } = useAdminGesture(onUnlock);

    return (
        <section className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark py-20 px-4 text-center">
            <div className={`container mx-auto max-w-4xl relative ${isAdmin ? 'pt-16 md:pt-0' : ''}`}>
                <div 
                    onClick={isAdmin ? undefined : handleTap} 
                    className="absolute inset-0 z-10 cursor-pointer"
                    aria-label="Secret admin unlock area"
                ></div>
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">
                    Welcome To <span className="text-brand-primary">DFX Store</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Pusat Tools-Tools Trading Bermanfaat
                </p>
                <div className="mt-8">
                    <a 
                        href="#products"
                        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Lihat Produk
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
