import { Metadata } from 'next';
import { TrendingClient } from './TrendingClient';

export const metadata: Metadata = {
  title: 'Trendler',
  description: 'En çok beğenilen ve trend paylaşımları keşfedin. Son 24 saat ve bu haftanın en popüler içerikleri.',
  openGraph: {
    title: 'Trendler | AnonWall',
    description: 'En çok beğenilen ve trend paylaşımları keşfedin.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TrendingPage() {
  return <TrendingClient />;
}
