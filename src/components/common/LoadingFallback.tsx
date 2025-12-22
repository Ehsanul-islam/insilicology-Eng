import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingFallbackProps {
  variant?: 'page' | 'hero' | 'card' | 'minimal';
}

const LoadingFallback = memo(({ variant = 'page' }: LoadingFallbackProps) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="container mx-auto px-6 py-20 pt-28">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="flex gap-4 mb-12">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // Default 'page' variant
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8 animate-pulse">
        <Skeleton className="h-10 w-64 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
});

LoadingFallback.displayName = 'LoadingFallback';

export default LoadingFallback;
