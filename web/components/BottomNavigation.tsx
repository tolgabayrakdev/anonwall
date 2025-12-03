'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, TrendingUp, User, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    {
      href: '/',
      label: 'Ana Sayfa',
      icon: Home,
      show: true,
    },
    {
      href: '/trending',
      label: 'Trendler',
      icon: TrendingUp,
      show: true,
    },
    {
      href: '/my-wall',
      label: 'Duvarım',
      icon: User,
      show: isAuthenticated,
    },
    {
      href: '/login',
      label: 'Giriş',
      icon: LogIn,
      show: !isAuthenticated,
    },
    {
      href: '/register',
      label: 'Kayıt',
      icon: UserPlus,
      show: !isAuthenticated,
    },
  ].filter(item => item.show);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      {isAuthenticated && user ? (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">{user.anonymousAvatar}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium truncate max-w-[120px]">
                {user.anonymousUsername}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href === '/' && pathname === '/') ||
            (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

