'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyPhone, resendVerificationCode } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const phone = searchParams.get('phone') || '';
  const fromLogin = searchParams.get('from') === 'login';
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(90); // 90 saniye geri sayım
  const [canResend, setCanResend] = useState(false);

  // Geri sayım timer'ı
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!code || code.length !== 6) {
      setError('Lütfen 6 haneli doğrulama kodunu girin');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyPhone(phone, code);
      
      // Save token
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        await refreshUser();
      }
      
      router.push('/trending');
    } catch (err: any) {
      setError(err.message || 'Doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    
    setResending(true);
    setResendSuccess(false);
    setError('');
    
    try {
      await resendVerificationCode(phone);
      setResendSuccess(true);
      setCountdown(90); // Geri sayımı sıfırla
      setCanResend(false); // Butonu tekrar devre dışı bırak
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Kod gönderilemedi');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!phone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-bold">Telefon numarası bulunamadı</h1>
          <p className="text-muted-foreground">
            Doğrulama sayfasına telefon numarası ile erişmeniz gerekiyor.
          </p>
          <Link href="/register">
            <Button>Kayıt Sayfasına Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pb-16 md:pb-0">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Telefon Doğrulama</h1>
          {fromLogin ? (
            <div className="space-y-2">
              <p className="text-destructive font-medium">
                Önce hesabınızı doğrulamanız gerekiyor
              </p>
              <p className="text-muted-foreground">
                <strong>{phone}</strong> numarasına gönderilen doğrulama kodunu girin
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              <strong>{phone}</strong> numarasına gönderilen doğrulama kodunu girin
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-2">
              Doğrulama Kodu
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
                setError('');
              }}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {resendSuccess && (
            <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-md">
              Doğrulama kodu tekrar gönderildi!
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Doğrulanıyor...
              </>
            ) : (
              'Doğrula'
            )}
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || resending}
              className={`text-sm transition-colors ${
                canResend && !resending
                  ? 'text-primary hover:text-primary/80 cursor-pointer'
                  : 'text-muted-foreground cursor-not-allowed'
              }`}
            >
              {resending ? (
                <>
                  <Loader2 className="h-4 w-4 inline mr-1 animate-spin" />
                  Gönderiliyor...
                </>
              ) : canResend ? (
                'Kodu tekrar gönder'
              ) : (
                `Kodu tekrar gönder (${formatTime(countdown)})`
              )}
            </button>
            <div>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Geri dön
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

