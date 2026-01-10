import React from 'react';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Responsive container with proper breakpoints and consistent padding
 * Replaces manual padding/margin for better consistency across the app
 * 
 * @example
 * <ResponsiveContainer>
 *   <YourContent />
 * </ResponsiveContainer>
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto ${className}`}>
            {children}
        </div>
    );
};
