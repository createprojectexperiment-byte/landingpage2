import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

const TAPS_REQUIRED = 5;
const WAIT_DURATION_MS = 10000;
const TAP_RESET_MS = 1000;

export const useAdminGesture = (onUnlock: () => void) => {
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
        // Jika sedang menunggu timer 10 detik, abaikan tap tambahan
        if (waitTimeoutRef.current) return;

        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);

        // Reset hitungan jika tidak mengetuk lagi dalam 1 detik
        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
        }
        tapTimeoutRef.current = window.setTimeout(resetTaps, TAP_RESET_MS);

        // Jika mencapai 5 tap
        if (newTapCount === TAPS_REQUIRED) {
            clearTimeout(tapTimeoutRef.current); 
            // HANYA munculkan notifikasi ini, tidak ada hitungan 1/5, 2/5 dst.
            toast.info(`Mode rahasia terdeteksi. Tunggu ${WAIT_DURATION_MS / 1000} detik...`);
            
            waitTimeoutRef.current = window.setTimeout(() => {
                toast.success('Akses Admin Terbuka!');
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

    return { handleTap };
};
