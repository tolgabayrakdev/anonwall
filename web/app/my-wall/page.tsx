import { Metadata } from 'next';
import { MyWallClient } from './MyWallClient';

export const metadata: Metadata = {
  title: 'Duvarım',
  description: 'Paylaştığınız tüm gönderileri görüntüleyin.',
  robots: {
    index: false, // Private page, don't index
    follow: false,
  },
};

export default function MyWallPage() {
  return <MyWallClient />;
}
