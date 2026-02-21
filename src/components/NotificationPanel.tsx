import React from 'react';
import { Bell, Video, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications, type Notification } from '@/hooks/useNotifications';

// ── NotificationItem ──────────────────────────────────────────────────────────

interface NotificationItemProps {
    notification: Notification;
    onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
    const { markAsRead } = useNotifications();
    const navigate = useNavigate();

    const handleClick = () => {
        markAsRead(notification.id);
        onClose();
        if (notification.type === 'live_session') {
            navigate('/my-sessions');
        }
    };

    const Icon = notification.type === 'live_session' ? Video : BookOpen;
    const iconColor =
        notification.type === 'live_session' ? 'text-primary' : 'text-blue-500';
    const iconBg =
        notification.type === 'live_session' ? 'bg-primary/10' : 'bg-blue-500/10';

    return (
        <button
            onClick={handleClick}
            className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors border-b border-border last:border-0 ${!notification.is_read ? 'bg-primary/5' : ''
                }`}
        >
            {/* Icon */}
            <div className={`shrink-0 mt-0.5 p-2 rounded-lg ${iconBg}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-0.5">
                <p className={`text-sm leading-snug ${!notification.is_read ? 'font-semibold' : 'font-medium'}`}>
                    {notification.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                </p>
                <p className="text-[11px] text-muted-foreground/70">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
            </div>

            {/* Unread dot */}
            {!notification.is_read && (
                <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-blue-500" />
            )}
        </button>
    );
};

// ── NotificationPanel ─────────────────────────────────────────────────────────

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();

    return (
        <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold flex-1">Notifications</h2>

                {unreadCount > 0 && (
                    <>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {unreadCount} unread
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2 text-primary hover:text-primary"
                            onClick={() => markAllAsRead()}
                        >
                            Mark all read
                        </Button>
                    </>
                )}
            </div>

            {/* List */}
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <Bell className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                        You'll be notified when a new live session is scheduled.
                    </p>
                </div>
            ) : (
                <ScrollArea className="max-h-[400px]">
                    <div>
                        {notifications.map((n) => (
                            <NotificationItem key={n.id} notification={n} onClose={onClose} />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default NotificationPanel;
