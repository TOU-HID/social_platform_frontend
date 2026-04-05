import avatarImage from '../assets/images/Avatar.png';
import people1Image from '../assets/images/people1.png';
import people2Image from '../assets/images/people2.png';
import people3Image from '../assets/images/people3.png';

const friends = [
  {
    name: 'Steve Jobs',
    role: 'CEO of Apple',
    image: people1Image,
    online: false,
  },
  {
    name: 'Ryan Roslansky',
    role: 'CEO of Linkedin',
    image: people2Image,
    online: true,
  },
  {
    name: 'Dylan Field',
    role: 'CEO of Figma',
    image: people3Image,
    online: true,
  },
  {
    name: 'Steve Jobs',
    role: 'CEO of Apple',
    image: people1Image,
    online: false,
  },
  {
    name: 'Ryan Roslansky',
    role: 'CEO of Linkedin',
    image: people2Image,
    online: true,
  },
];

export const FeedRightSidebar = () => {
  return (
    <div className='space-y-4 pb-4'>
      <section className='feed-theme-card rounded-md border border-[#e7eaf4] bg-white px-6 py-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h4 className='text-base font-semibold text-[#1f2a44]'>
            You Might Like
          </h4>
          <a
            href='#0'
            className='text-xs leading-[18px] font-normal text-[#1890FF]'
          >
            See All
          </a>
        </div>

        <hr className='m-0 border-0 border-t border-[#ECECEC] bg-[#ECECEC]' />

        <div className='pt-0'>
          <div className='my-6 flex items-center'>
            <img
              src={avatarImage}
              alt='Radovan SkillArena'
              className='mr-5 h-[50px] w-[50px] rounded-full object-cover'
            />
            <div>
              <p className='text-[16px] leading-6 font-medium text-[#212121]'>
                Radovan SkillArena
              </p>
              <p className='text-xs leading-[18px] font-normal text-[#212121]'>
                Founder & CEO at Trophy
              </p>
            </div>
          </div>

          <div className='flex'>
            <button
              type='button'
              className='mx-1 rounded-[6px] border border-[#f1f1f1] bg-transparent px-10 py-[9px] text-[14px] leading-[22px] font-medium text-[#959EAE] transition hover:bg-[#377DFF] hover:text-white'
            >
              Ignore
            </button>
            <button
              type='button'
              className='mx-1 rounded-[6px] border border-[#f1f1f1] bg-[#377DFF] px-10 py-[9px] text-[14px] leading-[22px] font-medium text-white transition hover:bg-[#1890FF]'
            >
              Follow
            </button>
          </div>
        </div>
      </section>

      <section className='feed-theme-card rounded-md border border-[#e7eaf4] bg-white px-6 py-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h4 className='text-base font-semibold text-[#1f2a44]'>
            Your Friends
          </h4>
          <a href='#0' className='text-xs font-normal text-[#2f5ce8]'>
            See All
          </a>
        </div>

        <div className='relative mb-4'>
          <svg
            className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]'
            xmlns='http://www.w3.org/2000/svg'
            width='17'
            height='17'
            fill='none'
            viewBox='0 0 17 17'
          >
            <circle cx='7' cy='7' r='6' stroke='currentColor' />
            <path stroke='currentColor' strokeLinecap='round' d='M16 16l-3-3' />
          </svg>

          <input
            type='search'
            placeholder='input search text'
            className='feed-theme-input h-10 w-full rounded-full border border-[#e6e8f1] bg-gray-100 pl-10 pr-4 text-sm text-[#616b8a] outline-none'
          />
        </div>

        <div className='space-y-4'>
          {friends.map((friend, index) => (
            <div
              key={`${friend.name}-${index}`}
              className='flex items-center justify-between gap-2 pb-3 hover:bg-gray-200 rounded-md p-2'
            >
              <div className='flex items-center gap-2.5'>
                <img
                  src={friend.image}
                  alt={friend.name}
                  className='h-9 w-9 rounded-full object-cover'
                />
                <div>
                  <p className='text-sm font-medium text-[#1f2a44]'>
                    {friend.name}
                  </p>
                  <p className='text-xs text-[#7a839f]'>{friend.role}</p>
                </div>
              </div>

              {friend.online ? (
                <span className='inline-flex h-3 w-3 rounded-full border-2 border-white bg-[#0acf83]' />
              ) : (
                <span className='text-[11px] text-[#8a93ad]'>5 minute ago</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
