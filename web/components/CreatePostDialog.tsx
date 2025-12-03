'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, LogIn, X } from 'lucide-react';
import { createPost, getCategories, Category } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
}

export function CreatePostDialog({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

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
      onOpenChange(false);
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
      onOpenChange(false);
      onPostCreated?.();
    } catch (err: any) {
      if (err.message.includes('Giriş') || err.message.includes('Token')) {
        router.push('/login');
        onOpenChange(false);
      } else {
        setError(err.message || 'Post oluşturulamadı');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      setContent('');
      setCategoryId(undefined);
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Paylaşım</DialogTitle>
          <DialogDescription>
            Düşüncelerinizi anonim olarak paylaşın
          </DialogDescription>
        </DialogHeader>

        {authLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Yükleniyor...
          </div>
        ) : !isAuthenticated ? (
          <div className="py-8 space-y-4 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Paylaşım yapmak için giriş yapmalısınız</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Anonim paylaşımlarınızı yapmak için hesabınıza giriş yapın veya kayıt olun.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/login" onClick={() => onOpenChange(false)}>
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register" onClick={() => onOpenChange(false)}>
                <Button variant="outline">
                  Kayıt Ol
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError(null);
                }}
                placeholder="Ne düşünüyorsun?"
                className="min-h-[120px] resize-none"
                maxLength={500}
                autoFocus
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
                  className={`text-xs px-3 py-1 rounded-full border-2 transition-colors ${
                    !categoryId
                      ? 'border-primary text-primary bg-transparent'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  Tümü
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`text-xs px-3 py-1 rounded-full border-2 transition-colors ${
                      categoryId === cat.id
                        ? 'font-semibold'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ 
                      borderColor: categoryId === cat.id ? cat.color : cat.color + '40',
                      color: categoryId === cat.id ? cat.color : cat.color + 'CC',
                      backgroundColor: 'transparent'
                    }}
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

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Gönderiliyor...' : 'Paylaş'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

