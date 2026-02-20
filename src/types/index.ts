export interface Author {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: Category;
  author: Author;
  tags: string[];
  read_time: number;
  views: number;
  status: 'draft' | 'published';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  avatar: string;
  content: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total_pages: number;
  total: number;
}
