import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  course_id: string | null;
  type: string;
  title: string;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // ── Fetch notifications ───────────────────────────────────────────────────
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const { data, error } = await supabase
          .from('notifications' as any)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) {
          console.warn('[useNotifications] fetch warning:', error.message);
          return [];
        }
        return (data as unknown as Notification[]) ?? [];
      } catch (err) {
        console.warn('[useNotifications] unexpected error:', err);
        return [];
      }
    },
    enabled: !!userId,
    retry: false,
  });

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  // ── Mark single notification as read ─────────────────────────────────────
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications' as any)
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] });
      const previous = queryClient.getQueryData<Notification[]>(['notifications', userId]);
      queryClient.setQueryData<Notification[]>(['notifications', userId], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications', userId], context.previous);
      }
    },
  });

  // ── Mark all notifications as read ───────────────────────────────────────
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications' as any)
        .update({ is_read: true })
        .eq('user_id', userId!)
        .eq('is_read', false);
      if (error) throw error;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] });
      const previous = queryClient.getQueryData<Notification[]>(['notifications', userId]);
      queryClient.setQueryData<Notification[]>(['notifications', userId], (old = []) =>
        old.map((n) => ({ ...n, is_read: true }))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications', userId], context.previous);
      }
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, unreadCount, markAsRead, markAllAsRead };
};
