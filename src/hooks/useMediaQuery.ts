import { useEffect, useState } from 'react';

/**
 * Hook for responsive behavior based on media queries
 * 
 * @param {string} query - Media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} Whether the media query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Check if matchMedia is supported
        if (typeof window === 'undefined' || !window.matchMedia) {
            return;
        }

        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Modern browsers
        if (media.addEventListener) {
            media.addEventListener('change', listener);
            return () => media.removeEventListener('change', listener);
        }
        // Fallback for older browsers
        else if (media.addListener) {
            media.addListener(listener);
            return () => media.removeListener(listener);
        }
    }, [query]);

    return matches;
};

/**
 * Predefined breakpoint hooks for common use cases
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsMobileOrTablet = () => useMediaQuery('(max-width: 1023px)');
