'use client';

import { useEffect, useState } from 'react';
import { getPosts, getSession, Post } from '@/lib/api';
import { CreatePostButton } from '@/components/CreatePostButton';
import { PostList } from '@/components/PostList';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function HomeClient() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [initialPosts, setInitialPosts] = useState<Post[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Redirect to landing if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/landing');
      return;
    }

    async function loadData() {
      try {
        const [posts, sess] = await Promise.all([
          getPosts(20, 0).catch(() => []),
          getSession().catch(() => null),
        ]);
        setInitialPosts(posts);
        setSession(sess);
      } catch (error) {
        console.error('Load error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    // Only load posts if authenticated
    if (!authLoading && isAuthenticated) {
      loadData();
    }
  }, [refreshKey, isAuthenticated, authLoading, router]);

  const handlePostCreated = () => {
    // Yeni post eklendiğinde scroll'u en üste al ve listeyi yenile
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRefreshKey((prev) => prev + 1);
  };

  if (loading || authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation session={session} />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AnonWall</h1>
          <p className="text-muted-foreground">
            Anonim paylaşımlarınızı yapın, düşüncelerinizi özgürce ifade edin.
          </p>
        </div>

        <div className="space-y-6">
          <CreatePostButton onPostCreated={handlePostCreated} />
          <PostList key={refreshKey} initialPosts={initialPosts} />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

