import { useRef } from 'react';
import cardStory1 from '../assets/images/card_ppl1.png';
import cardStory2 from '../assets/images/card_ppl2.png';
import cardStory3 from '../assets/images/card_ppl3.png';
import cardStory4 from '../assets/images/card_ppl4.png';
import miniPic from '../assets/images/mini_pic.png';
import mobileStory from '../assets/images/mobile_story_img.png';
import mobileStory1 from '../assets/images/mobile_story_img1.png';
import mobileStory2 from '../assets/images/mobile_story_img2.png';

const desktopStories = [
  { title: 'Your Story', image: cardStory1, own: true },
  { title: 'Ryan Roslansky', image: cardStory2 },
  { title: 'Ryan Roslansky', image: cardStory3 },
  { title: 'Ryan Roslansky', image: cardStory4 },
  { title: 'Steve Jobs', image: cardStory2 },
  { title: 'Dylan Field', image: cardStory3 },
];

const mobileStories = [
  { title: 'Your Story', image: mobileStory, own: true },
  { title: 'Ryan...', image: mobileStory1, active: true },
  { title: 'Ryan...', image: mobileStory2 },
  { title: 'Ryan...', image: mobileStory1, active: true },
  { title: 'Ryan...', image: mobileStory2 },
  { title: 'Steve...', image: mobileStory1, active: true },
  { title: 'Dylan...', image: mobileStory2 },
];

export const FeedStoryStrip = () => {
  const desktopStripRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className='feed-story-strip relative mb-4 hidden md:block'>
        <button
          type='button'
          className='absolute right-[-5px] top-1/2 z-20 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#f8fafc] bg-[#1890FF]'
          onClick={() => {
            desktopStripRef.current?.scrollBy({
              left: 260,
              behavior: 'smooth',
            });
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='9'
            height='8'
            fill='none'
            viewBox='0 0 9 8'
          >
            <path
              fill='#fff'
              d='M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z'
            />
          </svg>
        </button>

        <div
          ref={desktopStripRef}
          className='no-scrollbar flex gap-4 overflow-x-auto'
        >
          {desktopStories.map((story) =>
            story.own ? (
              <div
                key={`${story.title}-${story.image}`}
                className='min-w-[160px] flex-[0_0_23%] cursor-pointer overflow-hidden rounded-[6px]'
              >
                <div className='relative'>
                  <img
                    src={story.image}
                    alt={story.title}
                    className='h-40 w-full rounded-[6px] object-cover'
                  />
                  <div className='absolute inset-0 rounded-[6px] bg-black/50' />

                  <div className='absolute inset-x-0 bottom-0 rounded-t-[25.5px] rounded-b-[6px] bg-[#112032] pt-[30px]'>
                    <div className='absolute left-1/2 top-[-12px] -translate-x-1/2'>
                      <span className='inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#112032] bg-[#1890FF] text-white'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='10'
                          height='10'
                          fill='none'
                          viewBox='0 0 10 10'
                        >
                          <path
                            stroke='#fff'
                            strokeLinecap='round'
                            d='M.5 4.884h9M4.884 9.5v-9'
                          />
                        </svg>
                      </span>
                    </div>
                    <p className='mb-[10px] text-center text-xs leading-[19px] font-medium text-white'>
                      {story.title}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={`${story.title}-${story.image}`}
                className='min-w-[160px] flex-[0_0_23%] cursor-pointer overflow-hidden rounded-[6px]'
              >
                <div className='relative'>
                  <img
                    src={story.image}
                    alt={story.title}
                    className='h-40 w-full rounded-[6px] object-cover'
                  />
                  <div className='absolute inset-0 rounded-[6px] bg-black/50 transition hover:bg-black/70' />

                  <div className='absolute right-3 top-3 z-10'>
                    <img
                      src={miniPic}
                      alt='Story owner'
                      className='h-7 w-7 rounded-full border-2 border-white bg-[#ebf5ff]'
                    />
                  </div>

                  <div className='absolute inset-x-0 bottom-0 z-10'>
                    <p className='mb-[10px] text-center text-xs leading-[19px] font-medium text-white'>
                      {story.title}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className='feed-story-strip-mobile mb-4 md:hidden'>
        <div className='no-scrollbar flex items-center justify-between overflow-x-auto'>
          {mobileStories.map((story, index) => (
            <div
              key={`${story.title}-${index}`}
              className='flex-[0_0_70px] text-center'
            >
              <div
                className={`relative mx-auto h-[60px] w-[60px] overflow-hidden rounded-full ${story.own ? '' : story.active ? 'border-[3px] border-[#1890FF]' : 'border-[3px] border-[#C5C5C5]'}`}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className='h-[60px] w-[60px] rounded-full object-cover'
                />
                <div
                  className={`absolute inset-0 rounded-full ${story.own ? 'bg-black/50' : 'bg-gradient-to-b from-[#11203200] to-[#112032] opacity-50'}`}
                />

                {story.own ? (
                  <div className='absolute left-[44%] top-[54%] -translate-x-[44%] -translate-y-[54%]'>
                    <span className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#1890FF] text-white'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='12'
                        height='12'
                        fill='none'
                        viewBox='0 0 12 12'
                      >
                        <path
                          stroke='#fff'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M6 2.5v7M2.5 6h7'
                        />
                      </svg>
                    </span>
                  </div>
                ) : null}
              </div>
              <p
                className={`mt-3 text-xs leading-[1.2] font-medium ${story.own ? 'text-[#1890FF]' : 'truncate text-[#666]'}`}
              >
                {story.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
