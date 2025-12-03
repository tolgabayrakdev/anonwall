'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Post, getPosts } from '@/lib/api';
import { PostCard } from './PostCard';
import { Loader2 } from 'lucide-react';

interface PostListProps {
  categoryId?: number;
  initialPosts?: Post[];
}

export function PostList({ categoryId, initialPosts = [] }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // initialPosts değiştiğinde state'i güncelle
  useEffect(() => {
    setPosts(initialPosts);
    setOffset(initialPosts.length);
    setHasMore(initialPosts.length === 20); // Eğer 20 post geldiyse daha fazla olabilir
  }, [initialPosts]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Lazy loading: Load 20 posts at a time
      const newPosts = await getPosts(20, offset, categoryId);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        });
        setOffset((prev) => prev + newPosts.length);
        setHasMore(newPosts.length === 20); // Eğer 20'den az geldiyse daha fazla yok
      }
    } catch (error) {
      console.error('Load posts error:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, offset, categoryId]);

  useEffect(() => {
    // Intersection Observer for better performance (lazy loading)
    if (!sentinelRef.current || !hasMore || isLoading) return;

    const observerOptions = {
      root: null,
      rootMargin: '300px', // Load 300px before reaching the end
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, isLoading, hasMore]);

  const handleLikeChange = (postId: number, liked: boolean, likesCount: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, is_liked: liked, likes_count: likesCount }
          : post
      )
    );
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLikeChange={handleLikeChange}
        />
      ))}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Daha fazla post yok
        </div>
      )}
      {/* Sentinel element for Intersection Observer (lazy loading) */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  );
}

export type { PostListProps };

