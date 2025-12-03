import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { HomeClient } from './HomeClient';
import LandingPage from './landing/page';

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'Anonim paylaşımları keşfedin, beğenin ve trend listelerini takip edin.',
  openGraph: {
    title: 'AnonWall - Anonim Paylaşım Platformu',
    description: 'Anonim paylaşımları keşfedin, beğenin ve trend listelerini takip edin.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  // Check authentication on server side
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;
  const isAuthenticated = !!authToken;

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <HomeClient />;
}
