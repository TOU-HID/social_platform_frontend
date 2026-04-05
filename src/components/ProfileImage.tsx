type ProfileImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
};

const BACKEND_ORIGIN =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

const resolveImageUrl = (value?: string | null) => {
  const normalized = value?.trim();
  if (!normalized) return null;
  if (normalized.startsWith('blob:') || normalized.startsWith('data:')) {
    return normalized;
  }
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }
  return `${BACKEND_ORIGIN}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
};

export const ProfileImage = ({
  src,
  alt,
  className = 'h-10 w-10 overflow-hidden rounded-full',
  imageClassName = 'h-full w-full object-cover',
}: ProfileImageProps) => {
  const resolvedUrl = resolveImageUrl(src);

  return (
    <div className={className}>
      {resolvedUrl ? (
        <img src={resolvedUrl} alt={alt} className={imageClassName} />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-[#eef2f7] text-[#9aa5bd]'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            fill='none'
            viewBox='0 0 18 18'
            aria-hidden='true'
          >
            <path
              fill='currentColor'
              d='M9 9a3.5 3.5 0 10-3.5-3.5A3.5 3.5 0 009 9zm0 1.4c-3.06 0-5.8 1.55-5.8 3.6 0 .44.36.8.8.8h10c.44 0 .8-.36.8-.8 0-2.05-2.74-3.6-5.8-3.6z'
            />
          </svg>
        </div>
      )}
    </div>
  );
};
