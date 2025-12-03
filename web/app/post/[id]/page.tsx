'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost, Post } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = parseInt(params.id as string);
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(postId)) {
      setError('Geçersiz post ID');
      setLoading(false);
      return;
    }

    async function loadPost() {
      try {
        const postData = await getPost(postId);
        setPost(postData);
      } catch (err: any) {
        setError(err.message || 'Post yüklenemedi');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  const handleLikeChange = (postId: number, liked: boolean, likesCount: number) => {
    if (post && post.id === postId) {
      setPost({ ...post, is_liked: liked, likes_count: likesCount });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation session={null} />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation session={null} />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center space-y-4 py-16">
            <h1 className="text-2xl font-bold">Post Bulunamadı</h1>
            <p className="text-muted-foreground">{error || 'Bu post mevcut değil veya silinmiş olabilir.'}</p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation session={null} />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <PostCard post={post} onLikeChange={handleLikeChange} />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

