import { useEffect, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
    freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn {
    ref: (node: HTMLElement | null) => void;
    isIntersecting: boolean;
    entry?: IntersectionObserverEntry;
}

/**
 * Optimized intersection observer hook for lazy loading and scroll animations
 * 
 * @param {UseIntersectionObserverOptions} options - Intersection observer options
 * @returns {UseIntersectionObserverReturn} Ref callback and intersection state
 * 
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 * 
 * return (
 *   <div ref={ref}>
 *     {isIntersecting && <HeavyComponent />}
 *   </div>
 * );
 */
export const useIntersectionObserver = (
    options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
    const { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

    const [ref, setRef] = useState<HTMLElement | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [entry, setEntry] = useState<IntersectionObserverEntry>();

    const frozen = freezeOnceVisible && isIntersecting;

    useEffect(() => {
        if (!ref || frozen) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                setEntry(entry);
            },
            { threshold, root, rootMargin }
        );

        observer.observe(ref);

        return () => {
            observer.disconnect();
        };
    }, [ref, threshold, root, rootMargin, frozen]);

    const refCallback = useCallback((node: HTMLElement | null) => {
        setRef(node);
    }, []);

    return { ref: refCallback, isIntersecting, entry };
};
