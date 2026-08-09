export interface AuthorSummary {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  verified: boolean;
}

export interface PostWithMeta {
  id: string;
  content: string;
  mediaUrl: string | null;
  mediaType: "NONE" | "IMAGE" | "VIDEO";
  authorId: string;
  author: AuthorSummary;
  parentId: string | null;
  createdAt: string;
  _count: { likes: number; comments: number; reposts: number };
}

export interface CommentWithAuthor {
  id: string;
  content: string;
  postId: string;
  author: AuthorSummary;
  createdAt: string;
}
