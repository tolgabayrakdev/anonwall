'use client';

import { useEffect, useState } from 'react';
import { getMyPosts, Post } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function MyWallPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      async function loadData() {
        try {
          const posts = await getMyPosts(50, 0);
          setMyPosts(posts);
        } catch (error: any) {
          console.error('Load error:', error);
          if (error.message.includes('Giriş') || error.message.includes('Token')) {
            router.push('/login');
          }
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation session={null} />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Duvarım</h1>
          </div>
          <p className="text-muted-foreground">
            Paylaştığınız tüm gönderiler
          </p>
        </div>

        <div className="space-y-4">
          {myPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">Henüz paylaşım yapmadınız</p>
              <a href="/" className="text-primary hover:underline">
                İlk paylaşımınızı yapın →
              </a>
            </div>
          ) : (
            myPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
