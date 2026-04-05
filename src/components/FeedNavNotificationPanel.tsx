import friendReqImage from '../assets/images/friend-req.png';
import profileImage from '../assets/images/profile-1.png';

const notifications = [
  {
    actor: 'Steve Jobs',
    text: 'posted a link in your timeline.',
    time: '42 minutes ago',
    image: friendReqImage,
  },
  {
    actor: 'Freelancer USA',
    text: 'group name has been updated by admin.',
    time: '42 minutes ago',
    image: profileImage,
  },
  {
    actor: 'Steve Jobs',
    text: 'posted a link in your timeline.',
    time: '42 minutes ago',
    image: friendReqImage,
  },
];

export const FeedNavNotificationPanel = () => {
  return (
    <div className='feed-theme-popup absolute right-0 top-full z-40 mt-[2px] w-[320px] rounded-xl border border-[#e8ebf5] bg-white p-3 shadow-[0_12px_36px_rgba(17,32,50,0.14)]'>
      <div className='mb-3 flex items-center justify-between'>
        <h4 className='text-sm font-semibold text-[#112032]'>Notifications</h4>
        <button
          type='button'
          className='rounded-md px-2 py-1 text-[11px] font-medium text-[#6f7894] hover:bg-[#f5f7ff]'
        >
          Mark all read
        </button>
      </div>

      <div className='mb-3 flex gap-2'>
        <button
          type='button'
          className='rounded-full bg-[#377dff] px-3 py-1 text-xs font-medium text-white'
        >
          All
        </button>
        <button
          type='button'
          className='rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-medium text-[#2f5ce8]'
        >
          Unread
        </button>
      </div>

      <div className='max-h-72 space-y-2 overflow-y-auto pr-1'>
        {notifications.map((notification, index) => (
          <div
            key={`${notification.actor}-${index}`}
            className='flex gap-2 rounded-lg p-2 hover:bg-[#f7f9ff]'
          >
            <img
              src={notification.image}
              alt={notification.actor}
              className='h-9 w-9 rounded-full object-cover'
            />
            <div>
              <p className='text-xs leading-5 text-[#4d5a78]'>
                <span className='font-semibold text-[#1f2a44]'>
                  {notification.actor}
                </span>{' '}
                {notification.text}
              </p>
              <p className='text-[11px] text-[#7a839f]'>{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
