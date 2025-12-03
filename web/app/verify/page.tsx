import { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyClient } from './VerifyClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Telefon Doğrulama',
  description: 'Telefon numaranızı doğrulayarak hesabınızı aktifleştirin.',
  robots: {
    index: false, // Verification page shouldn't be indexed
    follow: false,
  },
};

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
