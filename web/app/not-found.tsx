import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation session={null} />
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-16">
          {/* 404 Sayı */}
          <div className="relative">
            <h1 className="text-9xl font-bold text-muted-foreground/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">🔍</div>
            </div>
          </div>

          {/* Başlık ve Açıklama */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold">Sayfa Bulunamadı</h2>
            <p className="text-muted-foreground max-w-md">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
              Anonim duvarınıza geri dönmek ister misiniz?
            </p>
          </div>

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/trending">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri Git
              </Button>
            </Link>
          </div>

          {/* Ekstra Bilgi */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p>Eğer bu bir hata olduğunu düşünüyorsanız, lütfen bize bildirin.</p>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

