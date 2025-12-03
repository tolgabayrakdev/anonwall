import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  title: {
    default: 'AnonWall - Anonim Paylaşım Platformu',
    template: '%s | AnonWall',
  },
  description: 'Düşüncelerinizi özgürce paylaşın. AnonWall ile kimliğinizi gizleyerek anonim paylaşımlar yapın, toplulukla etkileşime geçin ve trend paylaşımları keşfedin.',
  keywords: ['anonim', 'paylaşım', 'sosyal medya', 'anonim platform', 'düşünce paylaşımı', 'anonim sosyal ağ', 'mikroblog'],
  authors: [{ name: 'AnonWall' }],
  creator: 'AnonWall',
  publisher: 'AnonWall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'AnonWall',
    title: 'AnonWall - Anonim Paylaşım Platformu',
    description: 'Düşüncelerinizi özgürce paylaşın. Kimliğinizi gizleyerek anonim paylaşımlar yapın.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AnonWall',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnonWall - Anonim Paylaşım Platformu',
    description: 'Düşüncelerinizi özgürce paylaşın. Kimliğinizi gizleyerek anonim paylaşımlar yapın.',
    images: ['/og-image.png'],
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
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
