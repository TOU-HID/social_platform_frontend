type PostActionDropdownProps = {
  isMine: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

const baseItems = ['Save Post', 'Turn On Notification', 'Hide'];

export const PostActionDropdown = ({
  isMine,
  onEdit,
  onDelete,
  onClose,
}: PostActionDropdownProps) => {
  return (
    <div className='absolute right-0 top-8 z-20 w-56 rounded-lg border border-[#e6e9f5] bg-white p-1.5 shadow-[0_10px_28px_rgba(17,32,50,0.12)]'>
      {baseItems.map((item) => (
        <button
          key={item}
          type='button'
          className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100'
          onClick={onClose}
        >
          <span className='h-1.5 w-1.5 rounded-full bg-[#377dff]' />
          {item}
        </button>
      ))}

      {isMine ? (
        <>
          <button
            type='button'
            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100'
            onClick={onEdit}
          >
            <span className='h-1.5 w-1.5 rounded-full bg-[#377dff]' />
            Edit Post
          </button>
          <button
            type='button'
            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50'
            onClick={onDelete}
          >
            <span className='h-1.5 w-1.5 rounded-full bg-rose-500' />
            Delete Post
          </button>
        </>
      ) : null}
    </div>
  );
};
