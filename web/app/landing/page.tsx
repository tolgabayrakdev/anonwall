import Link from 'next/link';
import { Metadata } from 'next';
import { MessageSquare, Shield, TrendingUp, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { LandingClient } from './LandingClient';

export const metadata: Metadata = {
  title: 'AnonWall - Anonim Paylaşım Platformu',
  description: 'Düşüncelerinizi özgürce paylaşın. AnonWall ile kimliğinizi gizleyerek anonim paylaşımlar yapın, toplulukla etkileşime geçin ve trend paylaşımları keşfedin.',
  keywords: ['anonim', 'paylaşım', 'sosyal medya', 'anonim platform', 'düşünce paylaşımı', 'anonim sosyal ağ'],
  openGraph: {
    title: 'AnonWall - Anonim Paylaşım Platformu',
    description: 'Düşüncelerinizi özgürce paylaşın. Kimliğinizi gizleyerek anonim paylaşımlar yapın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'AnonWall',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnonWall - Anonim Paylaşım Platformu',
    description: 'Düşüncelerinizi özgürce paylaşın. Kimliğinizi gizleyerek anonim paylaşımlar yapın.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const features = [
  {
    icon: Shield,
    title: 'Tamamen Anonim',
    description: 'Kimliğinizi gizleyerek özgürce paylaşım yapın. Gerçek adınız veya fotoğrafınız asla görünmez.',
  },
  {
    icon: MessageSquare,
    title: 'Anında Paylaşım',
    description: 'Düşüncelerinizi hızlıca paylaşın, kategorilere göre organize edin ve toplulukla etkileşime geçin.',
  },
  {
    icon: Heart,
    title: 'Beğeni Sistemi',
    description: 'Beğendiğiniz paylaşımları beğenin ve trend listelerinde yer almalarını sağlayın.',
  },
  {
    icon: TrendingUp,
    title: 'Trend Listeleri',
    description: 'En popüler ve trend paylaşımları keşfedin. Günlük ve haftalık trend listeleriyle gündemi takip edin.',
  },
  {
    icon: Users,
    title: 'Topluluk',
    description: 'Binlerce anonim kullanıcıyla birlikte düşüncelerinizi paylaşın ve yeni bakış açıları keşfedin.',
  },
  {
    icon: Sparkles,
    title: 'Kategoriler',
    description: 'İlgi alanınıza göre kategorilere göz atın: Teknoloji, Spor, Sanat, Yemek ve daha fazlası.',
  },
];

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'AnonWall',
            description: 'Anonim paylaşım platformu',
            url: 'https://anonwall.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://anonwall.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Anonim Paylaşım Platformu</span>
              <span className="xs:hidden">Anonim Platform</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight px-2">
              Düşüncelerinizi{' '}
              <span className="text-primary">Özgürce</span>
              {' '}Paylaşın
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              AnonWall ile kimliğinizi gizleyerek düşüncelerinizi paylaşın, 
              toplulukla etkileşime geçin ve trend paylaşımları keşfedin.
            </p>

            <LandingClient />

            <p className="text-xs sm:text-sm text-muted-foreground px-4">
              Ücretsiz kayıt ol • Telefon doğrulaması ile güvenli
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Neden AnonWall?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Anonim paylaşım yaparak düşüncelerinizi özgürce ifade edin
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={index}
                    className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Hemen Katıl ve Paylaşmaya Başla
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Anonim kimliğinizle düşüncelerinizi paylaşın, beğenin ve trend listelerinde yer alın.
            </p>
            <LandingClient showLoginButton />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 sm:py-8 mt-12 sm:mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                © 2024 AnonWall. Tüm hakları saklıdır.
              </div>
              <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Ana Sayfa
                </Link>
                <Link href="/trending" className="hover:text-foreground transition-colors">
                  Trendler
                </Link>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Giriş
                </Link>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Kayıt
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
