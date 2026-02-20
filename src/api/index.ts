import type { Post, Category, Author, Comment, PaginatedResponse } from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Posts
export const getPosts = (page = 1, category?: string) => {
  const params = new URLSearchParams({ page: String(page) });
  if (category) params.set('category', category);
  return fetchJSON<PaginatedResponse<Post>>(`/posts.php?${params}`);
};

export const getPost = (slug: string) =>
  fetchJSON<Post>(`/post.php?slug=${slug}`);

export const getFeaturedPost = () =>
  fetchJSON<Post>(`/posts.php?featured=1`);

export const searchPosts = (q: string) =>
  fetchJSON<Post[]>(`/posts.php?search=${encodeURIComponent(q)}`);

// Categories
export const getCategories = () =>
  fetchJSON<Category[]>(`/categories.php`);

// Authors
export const getAuthors = () =>
  fetchJSON<Author[]>(`/authors.php`);

// Comments
export const getComments = (postId: number) =>
  fetchJSON<Comment[]>(`/comments.php?post_id=${postId}`);

export const addComment = (postId: number, author_name: string, content: string) =>
  fetchJSON<Comment>(`/comments.php`, {
    method: 'POST',
    body: JSON.stringify({ post_id: postId, author_name, content }),
  });

// Dashboard
export const createPost = (data: Partial<Post>) =>
  fetchJSON<Post>(`/posts.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updatePost = (id: number, data: Partial<Post>) =>
  fetchJSON<Post>(`/posts.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deletePost = (id: number) =>
  fetchJSON<void>(`/posts.php?id=${id}`, { method: 'DELETE' });

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/upload.php`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
