import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { feedApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { TopNavBar } from '../components/TopNavBar';
import { CreatePostSection } from '../components/CreatePostSection';
import { FeedLeftSidebar } from '../components/FeedLeftSidebar';
import { FeedRightSidebar } from '../components/FeedRightSidebar';
import { FeedStoryStrip } from '../components/FeedStoryStrip';
import { PostSection } from '../components/PostSection';

export const FeedPage = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = window.localStorage.getItem('app-theme-mode');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return 'light';
  });

  const feedQuery = useInfiniteQuery({
    queryKey: ['feed'],
    initialPageParam: null as {
      cursorCreatedAt: string;
      cursorId: string;
    } | null,
    queryFn: ({ pageParam }) => feedApi.getPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = useMemo(
    () => feedQuery.data?.pages.flatMap((page) => page.items) || [],
    [feedQuery.data],
  );

  useEffect(() => {
    document.body.classList.toggle('app-theme-dark', theme === 'dark');
    document.body.classList.toggle('app-theme-light', theme === 'light');
    window.localStorage.setItem('app-theme-mode', theme);
  }, [theme]);

  return (
    <div className='feed-theme-page bg-white'>
      <div className='theme-switch-wrap'>
        <button
          type='button'
          className='theme-switch-btn'
          onClick={() =>
            setTheme((previousTheme) =>
              previousTheme === 'dark' ? 'light' : 'dark',
            )
          }
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className='theme-switch-knob' />
          <span className='theme-switch-icon theme-switch-icon-sun'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='11'
              height='16'
              fill='none'
              viewBox='0 0 11 16'
            >
              <path
                fill='#fff'
                d='M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z'
              />
            </svg>
          </span>
          <span className='theme-switch-icon theme-switch-icon-moon'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle cx='12' cy='12' r='4.389' stroke='#fff' />
              <path
                stroke='#fff'
                strokeLinecap='round'
                d='M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05'
              />
            </svg>
          </span>
        </button>
      </div>

      <TopNavBar
        user={user}
        onLogout={() => {
          void logout();
        }}
      />

      <main className='feed-main-layout mx-auto grid w-full max-w-[1340px] gap-4 px-3 pt-[100px] sm:px-6 lg:h-screen lg:grid-cols-12 lg:overflow-hidden lg:px-6 lg:pt-[72px]'>
        <aside className='no-scrollbar hidden lg:col-span-3 lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1 lg:pt-[28px]'>
          <FeedLeftSidebar />
        </aside>

        <section className='no-scrollbar lg:col-span-6 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:px-1 lg:pt-[28px]'>
          <FeedStoryStrip />
          <CreatePostSection />
          <PostSection
            posts={posts}
            hasNextPage={feedQuery.hasNextPage}
            isFetchingNextPage={feedQuery.isFetchingNextPage}
            onLoadMore={() => {
              void feedQuery.fetchNextPage();
            }}
          />
        </section>

        <aside className='no-scrollbar hidden lg:col-span-3 lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pl-1 lg:pt-[28px]'>
          <FeedRightSidebar />
        </aside>
      </main>
    </div>
  );
};
