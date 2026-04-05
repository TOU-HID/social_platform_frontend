import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../lib/api';
import { formatTimeAgo } from '../lib/time';
import { useAuth } from '../providers/AuthProvider';
import type { Post } from '../types';
import { PostActionDropdown } from './PostActionDropdown';
import { PostCommentSection } from './PostCommentSection';
import { ProfileImage } from './ProfileImage';

const resolveImageUrl = (value?: string | null) => {
  const normalized = value?.trim();
  if (!normalized) return null;
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }
  const backendOrigin =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';
  return `${backendOrigin}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
};

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [expandedComments, setExpandedComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const isMine = user?.id === post.author.id;

  const togglePostLikeMutation = useMutation({
    mutationFn: ({ targetId, active }: { targetId: string; active: boolean }) =>
      feedApi.toggleLike({ targetType: 'post', targetId, active }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: () =>
      feedApi.updatePost({
        postId: post.id,
        content: editContent,
        image: editImage,
        removeImage,
      }),
    onSuccess: () => {
      setEditing(false);
      setMenuOpen(false);
      setEditImage(null);
      setRemoveImage(false);
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: () => feedApi.deletePost(post.id),
    onSuccess: () => {
      setMenuOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const shownImage = removeImage ? null : resolveImageUrl(post.imageUrl);
  const visibleLikers = post.recentLikers || [];
  const remainingLikers = Math.max(0, post.likeCount - visibleLikers.length);

  return (
    <article className='feed-theme-card post-card rounded-md border border-[#e7eaf4] bg-white shadow-sm'>
      <div className='px-4 py-4'>
        <div className='mb-3 flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <ProfileImage
              src={post.author.profileImageUrl}
              alt='Post author'
              className='h-10 w-10 overflow-hidden rounded-full'
            />
            <div>
              <h3 className='text-md font-normal text-[#1c2642]'>
                {post.author.firstName} {post.author.lastName}
              </h3>
              <p className='text-sm text-[#7a839f]'>
                {formatTimeAgo(post.createdAt)} · {post.visibility}
              </p>
            </div>
          </div>

          <div className='relative'>
            <button
              type='button'
              className='rounded-md p-1 text-[#7c84a1] hover:bg-slate-100'
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='4'
                height='17'
                fill='none'
                viewBox='0 0 4 17'
              >
                <circle cx='2' cy='2' r='2' fill='currentColor' />
                <circle cx='2' cy='8' r='2' fill='currentColor' />
                <circle cx='2' cy='15' r='2' fill='currentColor' />
              </svg>
            </button>

            {menuOpen ? (
              <PostActionDropdown
                isMine={isMine}
                onClose={() => setMenuOpen(false)}
                onEdit={() => {
                  if (!isMine) {
                    setMenuOpen(false);
                    return;
                  }
                  setEditing(true);
                  setMenuOpen(false);
                }}
                onDelete={() => {
                  if (!isMine) {
                    setMenuOpen(false);
                    return;
                  }
                  const ok = window.confirm('Delete this post?');
                  if (ok) {
                    deletePostMutation.mutate();
                  }
                }}
              />
            ) : null}
          </div>
        </div>

        {editing ? (
          <div className='mb-3 space-y-3'>
            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              className='w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100'
              rows={4}
            />

            <div className='flex flex-wrap items-center gap-2'>
              <input
                type='file'
                accept='image/*'
                className='rounded-lg border border-slate-300 px-3 py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-slate-200 file:px-2 file:py-1'
                onChange={(event) => {
                  setEditImage(event.target.files?.[0] || null);
                  if (event.target.files?.[0]) {
                    setRemoveImage(false);
                  }
                }}
              />

              {post.imageUrl && (
                <button
                  type='button'
                  className='rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100'
                  onClick={() => setRemoveImage((prev) => !prev)}
                >
                  {removeImage ? 'Keep image' : 'Remove image'}
                </button>
              )}
            </div>

            <div className='flex gap-2'>
              <button
                type='button'
                className='rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60'
                onClick={() => updatePostMutation.mutate()}
                disabled={updatePostMutation.isPending}
              >
                {updatePostMutation.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                type='button'
                className='rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100'
                onClick={() => {
                  setEditing(false);
                  setEditContent(post.content || '');
                  setEditImage(null);
                  setRemoveImage(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {post.content && (
              <p className='mb-3 text-sm leading-6 text-slate-700'>
                {post.content}
              </p>
            )}

            {shownImage && (
              <img
                src={shownImage}
                alt='Post'
                className='mb-3 max-h-[430px] w-full rounded-xl object-cover'
              />
            )}
          </>
        )}

        <div className='mt-1 flex items-center justify-between pb-3'>
          <div className='flex items-center'>
            {visibleLikers.map((liker, index) => (
              <ProfileImage
                key={`${post.id}-${liker.id}`}
                src={liker.profileImageUrl}
                alt={`${liker.firstName} ${liker.lastName}`}
                className={`h-7 w-7 overflow-hidden rounded-full border-2 border-white ${index === 0 ? '' : '-ml-2'}`}
              />
            ))}
            {remainingLikers > 0 && (
              <span className='-ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-[#eef2fa] px-1 text-xs font-medium text-[#44506c]'>
                {remainingLikers}+
              </span>
            )}
          </div>

          <div className='flex items-center gap-4 text-xs text-[#6f7894]'>
            <span>{post.commentCount} Comment</span>
            <span>{post.likeCount} Share</span>
          </div>
        </div>
      </div>

      <div className='post-actions-bar my-3 grid h-12 grid-cols-3 gap-2 bg-gray-50 px-2'>
        <button
          className='inline-flex items-center justify-center gap-1 px-2 py-2 text-sm text-[#55607c] transition hover:bg-blue-100'
          onClick={() =>
            togglePostLikeMutation.mutate({
              targetId: post.id,
              active: !post.likedByMe,
            })
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='19'
            height='19'
            fill='none'
            viewBox='0 0 19 19'
          >
            <path
              fill='#FFCC4D'
              d='M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z'
            />
            <path
              fill='#664500'
              d='M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z'
            />
            <path
              fill='#664500'
              d='M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z'
            />
          </svg>
          <span>Emoji</span>
        </button>

        <button
          className='inline-flex items-center justify-center gap-1 px-2 py-2 text-sm text-[#55607c] transition hover:bg-blue-100'
          onClick={() => setExpandedComments((prev) => !prev)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='21'
            height='21'
            fill='none'
            viewBox='0 0 21 21'
          >
            <path
              stroke='currentColor'
              d='M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z'
            />
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6.938 9.313h7.125M10.5 14.063h3.563'
            />
          </svg>
          <span>Comment</span>
        </button>

        <button
          className={`inline-flex items-center justify-center gap-1 px-2 py-2 text-sm transition hover:bg-blue-100 ${post.likedByMe ? 'text-[#3478f6]' : 'text-[#55607c]'}`}
          onClick={() =>
            togglePostLikeMutation.mutate({
              targetId: post.id,
              active: !post.likedByMe,
            })
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='none'
            viewBox='0 0 20 20'
          >
            <path
              stroke='currentColor'
              strokeWidth='1.6'
              d='M10 18s-6-3.455-6-8.455A3.545 3.545 0 017.545 6c1.07 0 2.057.478 2.455 1.232A2.87 2.87 0 0112.455 6 3.545 3.545 0 0116 9.545C16 14.545 10 18 10 18z'
            />
          </svg>
          <span>{post.likedByMe ? 'Liked' : 'Like'}</span>
        </button>
      </div>

      {expandedComments && <PostCommentSection postId={post.id} />}
    </article>
  );
};

type PostSectionProps = {
  posts: Post[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore: () => void;
};

export const PostSection = ({
  posts,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: PostSectionProps) => {
  const sortedPosts = useMemo(() => posts, [posts]);

  return (
    <>
      <div className='space-y-4'>
        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <button
          className='mt-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60'
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </button>
      )}
    </>
  );
};
