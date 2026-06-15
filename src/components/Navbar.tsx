import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, Shield, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();

  useEffect(() => {
    const checkRoles = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsInstructor(false);
        return;
      }

      const { data: adminData, error: adminError } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });
      if (adminError) console.error('Error checking admin role:', adminError);
      setIsAdmin(!!adminData);

      const { data: instructorData, error: instructorError } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'instructor',
      });
      if (instructorError) console.error('Error checking instructor role:', instructorError);
      setIsInstructor(!!instructorData);
    };
    checkRoles();
  }, [user]);

  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const mainNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/research' },
    { name: 'Courses', href: '/courses' },
  ];

  const othersDropdownLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Community', href: '/community' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 font-siliguri">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <img
              src="/logo-icon.svg"
              className="w-14 h-14 object-contain transform group-hover:scale-110 transition-transform duration-300"
              alt="insilicology Logo"
            />
            <span className="text-base lg:text-lg font-bold font-sans bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent hidden sm:inline tracking-tight translate-y-[4px]">
              insilicology
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5"
              >
                {link.name}
              </Link>
            ))}

            {/* Others Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5">
                  Others
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {othersDropdownLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons / User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-500 text-white text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.user_metadata?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 text-primary font-medium">
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isInstructor && (
                    <DropdownMenuItem asChild>
                      <Link to="/instructor" className="flex items-center gap-2 text-primary font-medium">
                        <GraduationCap className="w-4 h-4" />
                        Instructor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/my-certificates">My Certificates</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 shadow-sm transition-all"
                asChild
              >
                <Link to="/auth">Login / Sign Up</Link>
              </Button>
            )}
          </div>

          {/* Mobile actions: Login button + menu (mobile only) */}
          <div className="md:hidden flex items-center gap-2">
            {!user && (
              <Button
                size="sm"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 shadow-sm transition-all"
                asChild
              >
                <Link to="/auth">Login / Sign Up</Link>
              </Button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in border-t border-gray-200">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            {/* Mobile Nav Links */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Others Links */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Others</p>
              {othersDropdownLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Auth */}
            {user && (
              <div className="pt-4 space-y-2 border-t border-gray-200">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                {isAdmin && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                {isInstructor && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/instructor" className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Instructor
                    </Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navbar);
