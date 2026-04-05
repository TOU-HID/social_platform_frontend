export const formatTimeAgo = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) return 'just now';

  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const year = 365 * day;

  if (diffInSeconds < minute) {
    return 'just now';
  }

  if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} minute ago`;
  }

  if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} hour ago`;
  }

  if (diffInSeconds < year) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} day ago`;
  }

  const years = Math.floor(diffInSeconds / year);
  return `${years} year ago`;
};
