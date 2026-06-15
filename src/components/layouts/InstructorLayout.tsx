
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Video,
    Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { startCase } from 'lodash';

const InstructorLayout = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/instructor', icon: LayoutDashboard },
        { name: 'My Courses', href: '/instructor/courses', icon: BookOpen },
        { name: 'Live Sessions', href: '/instructor/live-sessions', icon: Video },
        // { name: 'Students', href: '/instructor/students', icon: Users }, // Future
        // { name: 'Earnings', href: '/instructor/earnings', icon: DollarSign }, // Future
        { name: 'Settings', href: '/profile/settings', icon: Settings },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <img src="/logo-icon.svg" className="h-10 w-10 object-contain animate-fade-in" alt="insilicology Logo" />
                    <span className="font-bold text-xl">Instructor</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
                >
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b flex items-center gap-2">
                            <img src="/logo-icon.svg" className="h-10 w-10 object-contain animate-fade-in" alt="insilicology Logo" />
                            <span className="font-bold text-xl text-purple-600 dark:text-purple-400">Instructor</span>
                        </div>



                        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href || (item.href !== '/instructor' && location.pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`
                      flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive
                                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                            }
                    `}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <item.icon className={`h-5 w-5 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t space-y-4">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Home className="h-5 w-5 text-gray-400" />
                                Back to Home
                            </Link>

                            <div className="flex items-center gap-3 px-3 py-2">
                                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                                    {user?.email?.[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.email}</p>
                                    <p className="text-xs text-muted-foreground truncate">Instructor</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default InstructorLayout;
