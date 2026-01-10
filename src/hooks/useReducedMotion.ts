import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 * 
 * @returns {boolean} Whether user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if matchMedia is supported
        if (typeof window === 'undefined' || !window.matchMedia) {
            return;
        }

        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(query.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        // Modern browsers
        if (query.addEventListener) {
            query.addEventListener('change', handleChange);
            return () => query.removeEventListener('change', handleChange);
        }
        // Fallback for older browsers
        else if (query.addListener) {
            query.addListener(handleChange);
            return () => query.removeListener(handleChange);
        }
    }, []);

    return prefersReducedMotion;
};
