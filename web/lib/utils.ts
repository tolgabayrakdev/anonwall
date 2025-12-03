import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: string): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  // Format: "15:30 - 2 saat önce" veya "15:30 - 3 Aralık"
  const timeStr = postDate.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  if (diffInSeconds < 60) {
    return `${timeStr} - şimdi`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${timeStr} - ${minutes} dakika önce`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${timeStr} - ${hours} saat önce`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${timeStr} - ${days} gün önce`;
  } else {
    const dateStr = postDate.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
    return `${timeStr} - ${dateStr}`;
  }
}

export function sharePost(postId: number, content: string): void {
  const url = `${window.location.origin}/post/${postId}`;
  const text = `${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'AnonWall Paylaşımı',
      text,
      url,
    }).catch(() => {
      // If share fails, fallback to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Link kopyalandı!');
      }).catch(() => {
        // If clipboard also fails, show URL
        prompt('Linki kopyalayın:', url);
      });
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      alert('Link kopyalandı!');
    }).catch(() => {
      // If clipboard fails, show URL
      prompt('Linki kopyalayın:', url);
    });
  }
}
