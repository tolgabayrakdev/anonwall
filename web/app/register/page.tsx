import { Metadata } from 'next';
import { RegisterClient } from './RegisterClient';

export const metadata: Metadata = {
  title: 'Kayıt Ol',
  description: 'AnonWall\'a katılın ve anonim paylaşımlar yapmaya başlayın. Ücretsiz kayıt olun.',
  robots: {
    index: false, // Register page shouldn't be indexed
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
