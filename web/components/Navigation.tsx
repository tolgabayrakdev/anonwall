'use client';

import Link from 'next/link';
import { Home, TrendingUp, User, LogOut } from 'lucide-react';
import { Session } from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';

interface NavigationProps {
  session: Session | null;
}

export function Navigation({ session }: NavigationProps) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            AnonWall
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Link>
            <Link
              href="/trending"
              className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Trendler
            </Link>
            <Link
              href="/my-wall"
              className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground transition-colors"
            >
              <User className="h-4 w-4" />
              Duvarım
            </Link>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{user.anonymousAvatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.anonymousUsername}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Giriş
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kayıt
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

