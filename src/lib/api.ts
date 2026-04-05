import type { AuthResponse, CommentItem, FeedResponse, User } from '../types';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050'}/api/v1`;

let accessToken = '';

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

type RequestOptions = {
  method?: string;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  skipAuth?: boolean;
};

const parseJson = async (response: Response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const refreshAccessToken = async () => {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Session expired');
  }

  const data = (await parseJson(response)) as { accessToken: string };
  setAccessToken(data.accessToken);
  return data.accessToken;
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const request = async () => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || 'GET',
      body: options.body,
      credentials: 'include',
      headers: {
        ...(options.skipAuth || !accessToken
          ? {}
          : { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await parseJson(response);
      throw new Error(errorBody.message || 'Request failed');
    }

    return (await parseJson(response)) as T;
  };

  try {
    return await request();
  } catch (error) {
    if (options.skipAuth) throw error;
    if (!accessToken) throw error;

    await refreshAccessToken();
    return request();
  }
};

export const authApi = {
  register: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) =>
    apiRequest<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      skipAuth: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      skipAuth: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  me: () => apiRequest<{ user: User }>('/auth/me'),

  updateProfile: (payload: { firstName?: string; lastName?: string }) =>
    apiRequest<{ message: string; user: User }>('/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  updateProfileImage: (image: File) => {
    const formData = new FormData();
    formData.append('image', image);

    return apiRequest<{ message: string; user: User }>('/auth/profile-image', {
      method: 'PATCH',
      body: formData,
    });
  },

  removeProfileImage: () =>
    apiRequest<{ message: string; user: User }>('/auth/profile-image', {
      method: 'DELETE',
    }),

  logout: () =>
    apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  refresh: () =>
    apiRequest<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      skipAuth: true,
    }),
};

export const feedApi = {
  getPosts: (cursor?: { cursorCreatedAt: string; cursorId: string } | null) => {
    const params = new URLSearchParams({ limit: '20' });
    if (cursor?.cursorCreatedAt && cursor?.cursorId) {
      params.set('cursorCreatedAt', cursor.cursorCreatedAt);
      params.set('cursorId', cursor.cursorId);
    }

    return apiRequest<FeedResponse>(`/posts?${params.toString()}`);
  },

  createPost: (payload: {
    content: string;
    visibility: 'public' | 'private';
    image?: File | null;
  }) => {
    const formData = new FormData();
    formData.append('content', payload.content);
    formData.append('visibility', payload.visibility);
    if (payload.image) formData.append('image', payload.image);

    return apiRequest('/posts', {
      method: 'POST',
      body: formData,
    });
  },

  updatePost: (payload: {
    postId: string;
    content?: string;
    visibility?: 'public' | 'private';
    image?: File | null;
    removeImage?: boolean;
  }) => {
    const formData = new FormData();
    if (typeof payload.content !== 'undefined') {
      formData.append('content', payload.content);
    }
    if (payload.visibility) {
      formData.append('visibility', payload.visibility);
    }
    if (payload.image) {
      formData.append('image', payload.image);
    }
    if (payload.removeImage) {
      formData.append('removeImage', 'true');
    }

    return apiRequest(`/posts/${payload.postId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  deletePost: (postId: string) =>
    apiRequest<{ message: string }>(`/posts/${postId}`, {
      method: 'DELETE',
    }),

  toggleLike: (payload: {
    targetType: 'post' | 'comment';
    targetId: string;
    active: boolean;
  }) =>
    apiRequest('/reactions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  getLikers: (targetType: 'post' | 'comment', targetId: string) =>
    apiRequest<{ items: User[] }>(
      `/reactions/likers?targetType=${targetType}&targetId=${targetId}`,
    ),

  getComments: (postId: string) =>
    apiRequest<{ items: CommentItem[] }>(`/posts/${postId}/comments`),

  createComment: (postId: string, content: string) =>
    apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),

  createReply: (commentId: string, content: string) =>
    apiRequest(`/comments/${commentId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
};
