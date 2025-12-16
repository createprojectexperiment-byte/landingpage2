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
        // If we are already waiting for the 10s timer, do nothing
        if (waitTimeoutRef.current) return;

        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);

        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
        }
        tapTimeoutRef.current = window.setTimeout(resetTaps, TAP_RESET_MS);

        if (newTapCount === TAPS_REQUIRED) {
            clearTimeout(tapTimeoutRef.current); // Don't reset taps after 5th tap
            toast.info(`Secret gesture activated. Please wait ${WAIT_DURATION_MS / 1000} seconds...`);
            
            waitTimeoutRef.current = window.setTimeout(() => {
                toast.success('Admin access unlocked!');
                onUnlock();
                resetTaps();
                waitTimeoutRef.current = null;
            }, WAIT_DURATION_MS);
        } else if (newTapCount < TAPS_REQUIRED) {
             toast(`${newTapCount}/${TAPS_REQUIRED} taps detected...`);
        }
    }, [tapCount, onUnlock, resetTaps]);
    
    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
            if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
        };
    }, []);

    return { handleTap };
};
