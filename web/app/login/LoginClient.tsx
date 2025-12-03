'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';

export function LoginClient() {
  const router = useRouter();
  const { refreshUser, isAuthenticated, loading } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Eğer kullanıcı zaten giriş yapmışsa trending sayfasına yönlendir
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/trending');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone || !password) {
      setError('Telefon numarası ve şifre gereklidir');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(phone.replace(/\s+/g, ''), password);
      // Check if verification is required
      if (error && error.includes('doğrulamanız gerekiyor')) {
        // Try to parse the error response
        try {
          const errorData = JSON.parse(error);
          if (errorData.requiresVerification && errorData.phone) {
            router.push(`/verify?phone=${encodeURIComponent(errorData.phone)}&from=login`);
            return;
          }
        } catch {
          // If parsing fails, check if it's a fetch error
          if (error && error.includes('requiresVerification')) {
            router.push(`/verify?phone=${encodeURIComponent(phone)}&from=login`);
            return;
          }
        }
      }
      
      // Auth context'i güncelle
      await refreshUser();
      router.push('/trending');
    } catch (err: any) {
      // Check if verification is required
      if (err.requiresVerification && err.phone) {
        router.push(`/verify?phone=${encodeURIComponent(err.phone)}&from=login`);
        return;
      }
      
      setError(err.message || 'Giriş başarısız');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading durumunda veya zaten giriş yapmışsa hiçbir şey gösterme
  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation session={null} />
      <main className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Giriş Yap</h1>
            <p className="text-muted-foreground">
              AnonWall hesabına giriş yap
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Telefon Numarası
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5XXXXXXXXX"
                className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Hesabın yok mu?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Kayıt ol
            </Link>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

