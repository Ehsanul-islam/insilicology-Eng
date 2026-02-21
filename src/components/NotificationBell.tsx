import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

const NotificationBell = () => {
    const { unreadCount } = useNotifications();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside the dropdown
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);

    const displayCount = unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null;

    return (
        <div ref={containerRef} className="relative">
            {/* Bell button */}
            <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                onClick={() => setOpen((prev) => !prev)}
                className="relative"
            >
                <Bell className="w-4 h-4" />

                {/* Unread badge */}
                {displayCount && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {displayCount}
                    </span>
                )}
            </Button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <NotificationPanel onClose={() => setOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
