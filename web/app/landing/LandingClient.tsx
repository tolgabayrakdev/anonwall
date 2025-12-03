'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface LandingClientProps {
  showLoginButton?: boolean;
}

export function LandingClient({ showLoginButton = false }: LandingClientProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
      <Button 
        size="lg" 
        className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
        onClick={() => router.push('/register')}
      >
        {showLoginButton ? 'Ücretsiz Kayıt Ol' : 'Hemen Başla'}
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      {showLoginButton && (
        <Button 
          size="lg" 
          variant="outline"
          className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
          onClick={() => router.push('/login')}
        >
          Zaten Hesabım Var
        </Button>
      )}
      {!showLoginButton && (
        <Button 
          size="lg" 
          variant="outline"
          className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
          onClick={() => router.push('/login')}
        >
          Giriş Yap
        </Button>
      )}
    </div>
  );
}

