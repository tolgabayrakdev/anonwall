// API client for AnonWall

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Post {
  id: number;
  content: string;
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  category_color: string | null;
  anonymous_id: string;
  anonymous_username: string;
  anonymous_avatar: string;
  likes_count: number;
  is_liked?: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export interface Session {
  sessionId: string;
  anonymousId: string;
  anonymousUsername: string;
  anonymousAvatar: string;
}

export interface User {
  id: number;
  phone: string;
  anonymousId: string;
  anonymousUsername: string;
  anonymousAvatar: string;
  phoneVerified?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function getSession(): Promise<Session> {
  const response = await fetch(`${API_URL}/session`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Session alınamadı');
  return response.json();
}

export async function getPosts(limit = 20, offset = 0, categoryId?: number): Promise<Post[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  if (categoryId) params.append('categoryId', categoryId.toString());
  
  const response = await fetch(`${API_URL}/posts?${params}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Postlar yüklenemedi');
  return response.json();
}

export async function getPost(postId: number): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post bulunamadı');
    }
    throw new Error('Post yüklenemedi');
  }
  return response.json();
}

export async function getTrendingPosts(period: '24h' | 'weekly' = '24h', limit = 20): Promise<Post[]> {
  const params = new URLSearchParams({
    period,
    limit: limit.toString(),
  });
  
  const response = await fetch(`${API_URL}/posts/trending?${params}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Trend postlar yüklenemedi');
  return response.json();
}

export async function getMyPosts(limit = 20, offset = 0): Promise<Post[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Giriş yapmalısınız');
  }

  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  
  const response = await fetch(`${API_URL}/posts/my?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Postlar yüklenemedi');
  return response.json();
}

export async function createPost(content: string, categoryId?: number): Promise<Post> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ content, categoryId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Post oluşturulamadı');
  }
  return response.json();
}

export async function toggleLike(postId: number): Promise<{ liked: boolean; likes_count: number }> {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Beğeni işlemi başarısız');
  return response.json();
}

export async function reportPost(postId: number, reason?: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${postId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) throw new Error('Rapor gönderilemedi');
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Kategoriler yüklenemedi');
  return response.json();
}

// Auth functions
export async function register(phone: string, password: string): Promise<{ message: string; phone: string; requiresVerification: boolean }> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ phone, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Kayıt başarısız');
  }
  return response.json();
}

export async function verifyPhone(phone: string, code: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ phone, code }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Doğrulama başarısız');
  }
  const data = await response.json();
  // Store token in localStorage
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

export async function resendVerificationCode(phone: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/resend-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ phone }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Kod gönderilemedi');
  }
  return response.json();
}

export async function login(phone: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ phone, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    // If verification is required, throw error with special format
    if (error.requiresVerification) {
      const verificationError: any = new Error(error.error || 'Telefon numaranızı doğrulamanız gerekiyor');
      verificationError.requiresVerification = true;
      verificationError.phone = error.phone;
      throw verificationError;
    }
    throw new Error(error.error || 'Giriş başarısız');
  }
  const data = await response.json();
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

export async function getMe(): Promise<User> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token) {
    throw new Error('Token bulunamadı');
  }
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
    throw new Error('Kullanıcı bilgileri alınamadı');
  }
  const data = await response.json();
  return data.user;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

