'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatePostDialog } from './CreatePostDialog';

interface CreatePostButtonProps {
  onPostCreated?: () => void;
}

export function CreatePostButton({ onPostCreated }: CreatePostButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePostCreated = () => {
    setDialogOpen(false);
    // Sayfayı yenile
    if (onPostCreated) {
      onPostCreated();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="w-full justify-start text-left h-auto py-3 px-4 bg-card border border-border hover:bg-accent"
        variant="outline"
      >
        <MessageSquare className="h-5 w-5 mr-3 text-muted-foreground" />
        <span className="text-muted-foreground">Ne düşünüyorsun?</span>
      </Button>
      <CreatePostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPostCreated={handlePostCreated}
      />
    </>
  );
}

