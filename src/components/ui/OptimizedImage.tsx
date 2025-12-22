import { memo } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

const OptimizedImage = memo(({
    src,
    alt,
    className = '',
    width,
    height,
    ...props
}: OptimizedImageProps) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            {...props}
        />
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
