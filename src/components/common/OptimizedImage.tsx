import React, { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import ImageSkeleton from '@/components/ImageSkeleton';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * Optimized image component with lazy loading and loading states
 * Uses Intersection Observer to only load images when they enter viewport
 * 
 * @param {boolean} priority - If true, loads immediately without lazy loading
 * 
 * @example
 * <OptimizedImage 
 *   src="/path/to/image.jpg" 
 *   alt="Description"
 *   className="w-full h-auto"
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    priority = false,
    onLoad,
    onError,
}) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const { ref, isIntersecting } = useIntersectionObserver({
        threshold: 0.01,
        freezeOnceVisible: true,
    });

    const shouldLoad = priority || isIntersecting;

    const handleLoad = () => {
        setLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setError(true);
        onError?.();
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            {shouldLoad && !error && (
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            )}
            {!loaded && !error && shouldLoad && (
                <div className="absolute inset-0">
                    <ImageSkeleton />
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
                    Failed to load image
                </div>
            )}
        </div>
    );
};
