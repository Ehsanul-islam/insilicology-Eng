import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const WelcomeModal = () => {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const checkAndShowModal = async () => {
            if (user && user.created_at) {
                const createdTime = new Date(user.created_at).getTime();
                const now = new Date().getTime();
                const diffMinutes = (now - createdTime) / (1000 * 60);

                // Check if user is "new" (created within last 5 minutes)
                // And hasn't seen the modal yet (stored in localStorage)
                const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);

                if (diffMinutes < 5 && !hasSeenWelcome) {
                    // Start checking for coupon usage
                    const { supabase } = await import('@/integrations/supabase/client');
                    const { data: usageData } = await supabase
                        .from('coupon_usages')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('coupon_code', 'WELCOME100')
                        .maybeSingle();

                    // If coupon NOT used, show modal
                    if (!usageData) {
                        // Small delay for better UX
                        const timer = setTimeout(() => setIsVisible(true), 1500);
                        return () => clearTimeout(timer);
                    }
                }
            }
        };

        checkAndShowModal();
    }, [user]);

    // Auto-dismiss after 10 seconds
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        if (user) {
            localStorage.setItem(`welcome_seen_${user.id}`, 'true');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const copyCoupon = () => {
        navigator.clipboard.writeText('WELCOME100');
        setCopied(true);
        toast.success('Coupon copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed z-50 bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-full md:max-w-xs"
                >
                    <div className="bg-card/95 backdrop-blur-md border border-purple-500/20 shadow-lg rounded-2xl overflow-hidden relative group">
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-secondary text-muted-foreground transition-colors z-20 backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col gap-3 pt-8 px-4 pb-4">
                            <div className="text-center space-y-1">
                                <h3 className="font-bold text-lg leading-tight">
                                    Welcome to Insilicology! <span className="text-purple-600 dark:text-purple-400">$5 Coupon!</span>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Use it on your first course. Code: <code className="bg-secondary px-1 py-0.5 rounded font-mono text-xs font-bold text-primary">WELCOME100</code>
                                </p>
                            </div>

                            <Button
                                asChild
                                className="w-3/4 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md font-semibold"
                                size="default"
                            >
                                <a href="/courses">
                                    Browse Courses
                                </a>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
