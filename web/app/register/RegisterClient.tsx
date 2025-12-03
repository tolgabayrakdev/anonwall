'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';

export function RegisterClient() {
  const router = useRouter();
  const { refreshUser, isAuthenticated, loading } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(phone.replace(/\s+/g, ''), password);
      
      // If verification is required, redirect to verify page
      if (result.requiresVerification) {
        router.push(`/verify?phone=${encodeURIComponent(result.phone)}`);
      } else {
        // Auth context'i güncelle (shouldn't happen with new flow)
        await refreshUser();
        router.push('/trending');
      }
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız');
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
            <h1 className="text-3xl font-bold mb-2">Kayıt Ol</h1>
            <p className="text-muted-foreground">
              AnonWall'a katıl ve anonim paylaşımlar yap
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
                placeholder="En az 6 karakter"
                className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
                minLength={6}
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
              {isSubmitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Giriş yap
            </Link>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

