import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../lib/api';
import { formatTimeAgo } from '../lib/time';
import { useAuth } from '../providers/AuthProvider';
import type { CommentItem } from '../types';
import { ProfileImage } from './ProfileImage';

type PostCommentSectionProps = {
  postId: string;
};

const getDisplayName = (firstName?: string, lastName?: string) => {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  return fullName || 'Unknown User';
};

export const PostCommentSection = ({ postId }: PostCommentSectionProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => feedApi.getComments(postId),
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => feedApi.createComment(postId, content),
    onSuccess: () => {
      setCommentText('');
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => feedApi.createReply(commentId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const toggleCommentLikeMutation = useMutation({
    mutationFn: ({ targetId, active }: { targetId: string; active: boolean }) =>
      feedApi.toggleLike({ targetType: 'comment', targetId, active }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const showLikers = async (targetId: string) => {
    const response = await feedApi.getLikers('comment', targetId);
    const names = response.items.map(
      (liker) => `${liker.firstName} ${liker.lastName}`,
    );
    alert(names.length ? names.join('\n') : 'No likes yet');
  };

  const comments = commentsQuery.data?.items || [];
  const previousComments = Math.max(0, comments.length - 1);

  const submitComment = () => {
    const value = commentText.trim();
    if (!value) return;
    createCommentMutation.mutate(value);
  };

  const submitReply = (commentId: string) => {
    const value = (replyInput[commentId] || '').trim();
    if (!value) return;
    createReplyMutation.mutate({
      commentId,
      content: value,
    });
    setReplyInput((prev) => ({ ...prev, [commentId]: '' }));
  };

  return (
    <div className='post-comment-section'>
      <div className='comment-composer-area'>
        <div className='comment-composer-box'>
          <form
            className='comment-composer-form'
            onSubmit={(event) => {
              event.preventDefault();
              submitComment();
            }}
          >
            <div className='comment-composer-content'>
              <ProfileImage
                src={user?.profileImageUrl}
                alt='Comment author'
                className='comment-avatar-small h-7 w-7 overflow-hidden rounded-full'
              />

              {/* <div className='comment-composer-text-wrap'> */}
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submitComment();
                  }
                }}
                placeholder='Write a comment'
                className='comment-textarea-input'
              />
              {/* </div> */}
            </div>

            <div className='comment-composer-icons'>
              <button
                type='button'
                className='comment-composer-icon-btn'
                aria-label='Voice input'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='none'
                  viewBox='0 0 16 16'
                >
                  <path
                    fill='currentColor'
                    fillRule='evenodd'
                    d='M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>

              <button
                type='button'
                className='comment-composer-icon-btn'
                aria-label='Attach image'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='none'
                  viewBox='0 0 16 16'
                >
                  <path
                    fill='currentColor'
                    fillRule='evenodd'
                    d='M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {previousComments > 0 && (
        <div className='previous-comment-wrap'>
          <button type='button' className='previous-comment-btn'>
            View {previousComments} previous comments
          </button>
        </div>
      )}

      {comments.map((comment: CommentItem) => {
        const commentAuthorName = getDisplayName(
          comment.author.firstName,
          comment.author.lastName,
        );

        return (
          <div key={comment.id} className='comment-main'>
            <ProfileImage
              src={comment.author.profileImageUrl}
              alt={commentAuthorName}
              className='comment-avatar h-10 w-10 overflow-hidden rounded-full'
            />

            <div className='comment-area min-w-0 flex-1'>
              <div className='comment-details'>
                <div className='comment-details-top'>
                  <div className='comment-name'>
                    <h4 className='comment-name-title'>{commentAuthorName}</h4>
                  </div>
                </div>
                <p className='comment-status-text'>{comment.content}</p>

                <button
                  type='button'
                  className='comment-total-reactions'
                  onClick={() => void showLikers(comment.id)}
                >
                  <span className='comment-total-react'>
                    <span className='comment-reaction-like'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
                      </svg>
                    </span>
                    <span className='comment-reaction-heart'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                      </svg>
                    </span>
                  </span>
                  <span className='comment-total-count'>
                    {comment.likeCount}
                  </span>
                </button>
              </div>

              <div className='comment-reply-wrap'>
                <ul className='comment-reply-list'>
                  <li>
                    <button
                      type='button'
                      className='comment-reply-action'
                      onClick={() =>
                        toggleCommentLikeMutation.mutate({
                          targetId: comment.id,
                          active: !comment.likedByMe,
                        })
                      }
                    >
                      {comment.likedByMe ? 'Unlike' : 'Like'}
                    </button>
                  </li>
                  <li>
                    <button type='button' className='comment-reply-action'>
                      Reply.
                    </button>
                  </li>
                  <li>
                    <button type='button' className='comment-reply-action'>
                      Share
                    </button>
                  </li>
                  <li>
                    <span className='comment-reply-time'>
                      .{formatTimeAgo(comment.createdAt)}
                    </span>
                  </li>
                </ul>
              </div>

              {comment.replies.map((reply) => {
                const replyAuthorName = getDisplayName(
                  reply.author.firstName,
                  reply.author.lastName,
                );

                return (
                  <div
                    key={reply.id}
                    className='comment-main comment-reply-main'
                  >
                    <ProfileImage
                      src={reply.author.profileImageUrl}
                      alt={replyAuthorName}
                      className='comment-avatar h-8 w-8 overflow-hidden rounded-full'
                    />

                    <div className='comment-area min-w-0 flex-1'>
                      <div className='comment-details comment-details-reply'>
                        <p className='comment-name-title'>{replyAuthorName}</p>
                        <p className='comment-status-text'>{reply.content}</p>
                      </div>

                      <div className='comment-reply-wrap comment-reply-wrap-inner'>
                        <ul className='comment-reply-list'>
                          <li>
                            <button
                              type='button'
                              className='comment-reply-action'
                              onClick={() =>
                                toggleCommentLikeMutation.mutate({
                                  targetId: reply.id,
                                  active: !reply.likedByMe,
                                })
                              }
                            >
                              {reply.likedByMe ? 'Unlike' : 'Like'}
                            </button>
                          </li>
                          <li>
                            <button
                              type='button'
                              className='comment-reply-action'
                              onClick={() => void showLikers(reply.id)}
                            >
                              {reply.likeCount}
                            </button>
                          </li>
                          <li>
                            <span className='comment-reply-time'>
                              .{formatTimeAgo(reply.createdAt)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className='comment-composer-box comment-composer-box-reply'>
                <form
                  className='comment-composer-form'
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitReply(comment.id);
                  }}
                >
                  <div className='comment-composer-content'>
                    <ProfileImage
                      src={user?.profileImageUrl}
                      alt='Reply author'
                      className='comment-avatar-small h-7 w-7 overflow-hidden rounded-full'
                    />

                    <div className='comment-composer-text-wrap'>
                      <input
                        value={replyInput[comment.id] || ''}
                        onChange={(event) =>
                          setReplyInput((prev) => ({
                            ...prev,
                            [comment.id]: event.target.value,
                          }))
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            submitReply(comment.id);
                          }
                        }}
                        placeholder='Write a comment'
                        className='comment-text-input'
                      />
                    </div>
                  </div>

                  <div className='comment-composer-icons'>
                    <button
                      type='button'
                      className='comment-composer-icon-btn'
                      aria-label='Voice input'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 16 16'
                      >
                        <path
                          fill='currentColor'
                          fillRule='evenodd'
                          d='M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>

                    <button
                      type='button'
                      className='comment-composer-icon-btn'
                      aria-label='Attach image'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 16 16'
                      >
                        <path
                          fill='currentColor'
                          fillRule='evenodd'
                          d='M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
