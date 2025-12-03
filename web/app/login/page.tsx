import { Metadata } from 'next';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'AnonWall hesabınıza giriş yapın ve anonim paylaşımlarınıza devam edin.',
  robots: {
    index: false, // Login page shouldn't be indexed
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
