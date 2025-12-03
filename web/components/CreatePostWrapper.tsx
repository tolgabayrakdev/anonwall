'use client';

import { useState } from 'react';
import { CreatePost } from './CreatePost';

export function CreatePostWrapper() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    // Reload page after a short delay to show new post
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return <CreatePost onPostCreated={handlePostCreated} />;
}

