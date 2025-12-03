'use client';

import { useState } from 'react';
import { Heart, Share2, Flag, MoreHorizontal } from 'lucide-react';
import { Post, toggleLike, reportPost } from '@/lib/api';
import { formatTimeAgo, sharePost } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PostCardProps {
  post: Post;
  onLikeChange?: (postId: number, liked: boolean, likesCount: number) => void;
}

export function PostCard({ post, onLikeChange }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiking, setIsLiking] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const result = await toggleLike(post.id);
      setIsLiked(result.liked);
      setLikesCount(result.likes_count);
      onLikeChange?.(post.id, result.liked, result.likes_count);
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReport = async () => {
    try {
      await reportPost(post.id, 'Uygunsuz içerik');
      alert('Rapor gönderildi. Teşekkürler!');
      setShowReportMenu(false);
    } catch (error) {
      console.error('Report error:', error);
      alert('Rapor gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleShare = () => {
    sharePost(post.id, post.content);
  };

  return (
    <article className="bg-card border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-lg">{post.anonymous_avatar}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{post.anonymous_username}</div>
            <div className="text-xs text-muted-foreground">
              {formatTimeAgo(post.created_at)}
            </div>
          </div>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowReportMenu(!showReportMenu)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {showReportMenu && (
            <div className="absolute right-0 top-8 bg-popover border border-border rounded-md shadow-lg z-10">
              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 rounded-md"
              >
                <Flag className="h-4 w-4" />
                Raporla
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Badge */}
      {post.category_name && (
        <div className="flex items-center">
          <span
            className="text-xs font-medium px-3 py-1 rounded-full text-white shadow-sm"
            style={{ backgroundColor: post.category_color || '#6366f1' }}
          >
            {post.category_name}
          </span>
        </div>
      )}

      {/* Content */}
      <p className="text-foreground whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 text-sm transition-colors ${
            isLiked
              ? 'text-red-500 hover:text-red-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Share2 className="h-5 w-5" />
          <span>Paylaş</span>
        </button>
      </div>
    </article>
  );
}

