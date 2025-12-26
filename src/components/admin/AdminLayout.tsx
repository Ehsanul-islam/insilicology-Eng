import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Home, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();

  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'A';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              {title && (
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <Home className="w-4 h-4" />
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Notifications</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        You have 0 unread messages
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">My Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
