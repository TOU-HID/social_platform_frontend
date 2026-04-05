export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: 'public' | 'private';
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  likedByMe: boolean;
  recentLikers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string | null;
  }>;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string | null;
  };
};

export type Reply = {
  id: string;
  parentCommentId: string;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string | null;
  };
};

export type CommentItem = {
  id: string;
  postId: string;
  content: string;
  likeCount: number;
  replyCount: number;
  likedByMe: boolean;
  createdAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string | null;
  };
  replies: Reply[];
};

export type FeedResponse = {
  items: Post[];
  nextCursor: {
    cursorCreatedAt: string;
    cursorId: string;
  } | null;
};
