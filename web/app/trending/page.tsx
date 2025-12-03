'use client';

import { useEffect, useState } from 'react';
import { getTrendingPosts, getSession, Post } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TrendingPage() {
  const [trending24h, setTrending24h] = useState<Post[]>([]);
  const [trendingWeekly, setTrendingWeekly] = useState<Post[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [posts24h, postsWeekly, sess] = await Promise.all([
          getTrendingPosts('24h', 50),
          getTrendingPosts('weekly', 50),
          getSession().catch(() => null),
        ]);
        setTrending24h(posts24h);
        setTrendingWeekly(postsWeekly);
        setSession(sess);
      } catch (error) {
        console.error('Load error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
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
          <h1 className="text-3xl font-bold mb-2">Trendler</h1>
          <p className="text-muted-foreground">
            En çok beğenilen paylaşımlar
          </p>
        </div>

        <Tabs defaultValue="24h" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="24h">Son 24 Saat</TabsTrigger>
            <TabsTrigger value="weekly">Bu Hafta</TabsTrigger>
          </TabsList>
          <TabsContent value="24h" className="mt-6">
            <div className="space-y-4">
              {trending24h.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Henüz trend paylaşım yok
                </div>
              ) : (
                trending24h.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="mt-6">
            <div className="space-y-4">
              {trendingWeekly.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Henüz trend paylaşım yok
                </div>
              ) : (
                trendingWeekly.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNavigation />
    </div>
  );
}
