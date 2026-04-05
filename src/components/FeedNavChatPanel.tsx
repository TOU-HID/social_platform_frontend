import chat1Image from '../assets/images/chat1_img.png';
import chat2Image from '../assets/images/chat2_img.png';
import chat3Image from '../assets/images/chat3_img.png';

const chats = [
  {
    name: 'Ryan Roslansky',
    message: 'Let’s review the design updates.',
    time: '2m',
    image: chat1Image,
    unread: true,
  },
  {
    name: 'Steve Jobs',
    message: 'See you in the event meeting.',
    time: '10m',
    image: chat2Image,
  },
  {
    name: 'Dylan Field',
    message: 'New prototype is ready.',
    time: '25m',
    image: chat3Image,
  },
];

export const FeedNavChatPanel = () => {
  return (
    <div className='feed-theme-popup absolute right-0 top-full z-40 mt-[2px] w-[300px] rounded-xl border border-[#e8ebf5] bg-white p-3 shadow-[0_12px_36px_rgba(17,32,50,0.14)]'>
      <div className='mb-3 flex items-center justify-between'>
        <h4 className='text-sm font-semibold text-[#112032]'>Chats</h4>
        <a href='#0' className='text-xs font-medium text-[#2f5ce8]'>
          Open chat
        </a>
      </div>

      <div className='space-y-2'>
        {chats.map((chat) => (
          <div
            key={chat.name}
            className='flex items-center gap-2 rounded-lg p-2 hover:bg-[#f7f9ff]'
          >
            <img
              src={chat.image}
              alt={chat.name}
              className='h-9 w-9 rounded-full object-cover'
            />
            <div className='min-w-0 flex-1'>
              <div className='flex items-center justify-between gap-2'>
                <p className='truncate text-sm font-medium text-[#1f2a44]'>
                  {chat.name}
                </p>
                <span className='text-[11px] text-[#7a839f]'>{chat.time}</span>
              </div>
              <p className='truncate text-xs text-[#6f7894]'>{chat.message}</p>
            </div>
            {chat.unread ? (
              <span className='inline-flex h-2.5 w-2.5 rounded-full bg-[#ff4d4f]' />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
