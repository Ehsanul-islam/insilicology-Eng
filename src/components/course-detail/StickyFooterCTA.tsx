import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StickyFooterCTAProps {
  price?: number | null;
  priceRegular?: number | null;
  onEnrollClick: () => void;
  isEnrolled?: boolean;
  upcoming?: boolean;
  courseTitle?: string;
}

const StickyFooterCTA = ({
  price,
  priceRegular,
  onEnrollClick,
  isEnrolled,
  upcoming,
  courseTitle,
}: StickyFooterCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const hasDiscount = priceRegular && price && price < priceRegular;
  const discountPercent = hasDiscount
    ? Math.round(((Number(priceRegular) - Number(price)) / Number(priceRegular)) * 100)
    : 0;

  useEffect(() => {
    const heroSection = document.querySelector('section'); // First section is hero
    const footer = document.querySelector('footer');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroSection) {
            // Show when hero is NOT visible (scrolled past it)
            setIsVisible(!entry.isIntersecting);
          }
          if (entry.target === footer) {
            // Hide when footer IS visible
            setIsFooterVisible(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    if (heroSection) observer.observe(heroSection);
    if (footer) observer.observe(footer);

    return () => {
      if (heroSection) observer.unobserve(heroSection);
      if (footer) observer.unobserve(footer);
    };
  }, []);

  // Don't show if enrolled
  if (isEnrolled) return null;

  const shouldShow = isVisible && !isFooterVisible;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-border" />
          
          {/* Content */}
          <div className="relative px-4 py-3 flex items-center justify-between gap-4">
            {/* Price Info */}
            <div className="flex flex-col">
              {courseTitle && (
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {courseTitle}
                </span>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-foreground">
                  {price ? `$${Number(price).toLocaleString()}` : 'Free'}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm line-through text-muted-foreground">
                      ${Number(priceRegular).toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onEnrollClick}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-6 font-semibold rounded-xl shadow-lg shadow-purple-500/25 group whitespace-nowrap"
                size="lg"
              >
                {upcoming ? (
                  'Pre-Register'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enroll Now
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Safe area padding for notched devices */}
          <div className="h-[env(safe-area-inset-bottom)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyFooterCTA;

