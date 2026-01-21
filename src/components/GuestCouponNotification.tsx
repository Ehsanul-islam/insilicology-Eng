import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const GuestCouponNotification = () => {
    const { user, loading } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log('GuestCouponNotification: mounted', { user, loading });
        // Wait for auth to load
        if (loading) {
            console.log('GuestCouponNotification: loading auth...');
            return;
        }

        // If user is logged in, hide it
        if (user) {
            console.log('GuestCouponNotification: user logged in, hiding');
            setIsVisible(false);
            return;
        }

        // Check if previously dismissed
        const isDismissed = localStorage.getItem('dismissed_guest_coupon');
        console.log('GuestCouponNotification: isDismissed?', isDismissed);
        if (isDismissed) return;

        // Show after delay
        console.log('GuestCouponNotification: showing details in 1.5s');
        const timer = setTimeout(() => {
            console.log('GuestCouponNotification: setting visible true');
            setIsVisible(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [user, loading]);

    // Auto-dismiss after 10 seconds
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('dismissed_guest_coupon', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed z-[9999] bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-full md:max-w-xs"
                >
                    <div className="bg-card/95 backdrop-blur-md border border-purple-500/20 shadow-lg rounded-2xl overflow-hidden relative group">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-secondary text-muted-foreground transition-colors z-20 backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col gap-3 pt-8 px-4 pb-4">
                            <div className="text-center space-y-1">
                                <h3 className="font-bold text-lg leading-tight">
                                    Get a <span className="text-purple-600 dark:text-purple-400">$5 Coupon</span> on Sign Up!
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Special offer for new users. Code: <code className="bg-secondary px-1 py-0.5 rounded font-mono text-xs font-bold text-primary">WELCOME100</code>
                                </p>
                            </div>

                            <Button asChild className="w-3/4 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md font-semibold" size="default">
                                <Link to="/auth?tab=signup">
                                    Sign Up Now
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
