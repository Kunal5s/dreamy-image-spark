
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
    email: string;
    photoURL?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  slug: string;
  excerpt: string;
  tags: string[];
}

export interface BlogPostFormData {
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  excerpt: string;
  tags: string[];
}
