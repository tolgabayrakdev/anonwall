'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, LogIn } from 'lucide-react';
import { createPost, getCategories, Category } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Categories load error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!content.trim()) {
      setError('İçerik boş olamaz');
      return;
    }

    if (content.length > 500) {
      setError('İçerik 500 karakterden uzun olamaz');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createPost(content.trim(), categoryId);
      setContent('');
      setCategoryId(undefined);
      onPostCreated?.();
    } catch (err: any) {
      if (err.message.includes('Giriş') || err.message.includes('Token')) {
        router.push('/login');
      } else {
        setError(err.message || 'Post oluşturulamadı');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 text-center text-muted-foreground">
        Yükleniyor...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Paylaşım yapmak için giriş yapmalısınız</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Anonim paylaşımlarınızı yapmak için hesabınıza giriş yapın veya kayıt olun.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/login">
            <Button>
              <LogIn className="h-4 w-4 mr-2" />
              Giriş Yap
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">
              Kayıt Ol
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div>
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          placeholder="Ne düşünüyorsun?"
          className="min-h-[100px] resize-none"
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {content.length}/500
          </span>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId(undefined)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              !categoryId
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors text-white ${
                categoryId === cat.id
                  ? 'opacity-100 ring-2 ring-offset-2 ring-offset-background'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Gönderiliyor...' : 'Paylaş'}
      </Button>
    </form>
  );
}

