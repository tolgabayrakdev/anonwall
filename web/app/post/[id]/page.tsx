import { Metadata } from 'next';
import { PostDetailClient } from './PostDetailClient';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postId = params.id;
  
  // Try to fetch post for dynamic metadata
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/posts/${postId}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (response.ok) {
      const post = await response.json();
      const contentPreview = post.content.substring(0, 150);
      
      return {
        title: `Paylaşım | AnonWall`,
        description: contentPreview,
        openGraph: {
          title: `AnonWall Paylaşımı`,
          description: contentPreview,
          type: 'article',
        },
        twitter: {
          card: 'summary',
          title: `AnonWall Paylaşımı`,
          description: contentPreview,
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }
  } catch (error) {
    // Fallback if post fetch fails
  }

  return {
    title: 'Paylaşım | AnonWall',
    description: 'AnonWall paylaşım detay sayfası',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PostDetailPage({ params }: Props) {
  return <PostDetailClient postId={params.id} />;
}
