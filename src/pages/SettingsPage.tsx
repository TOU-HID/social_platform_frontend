import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { TopNavBar } from '../components/TopNavBar';
import { ProfileImage } from '../components/ProfileImage';

export const SettingsPage = () => {
  const { user, setCurrentUser, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl || null);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
  }, [user?.firstName, user?.lastName]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(user?.profileImageUrl || null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile, user?.profileImageUrl]);

  const updateImageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error('Please select an image');
      }
      return authApi.updateProfileImage(selectedFile);
    },
    onSuccess: (response) => {
      setCurrentUser(response.user);
      setSelectedFile(null);
      setStatusMessage('Profile image updated successfully.');
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: () =>
      authApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
    onSuccess: (response) => {
      setCurrentUser(response.user);
      setStatusMessage('Profile name updated successfully.');
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: () => authApi.removeProfileImage(),
    onSuccess: (response) => {
      setCurrentUser(response.user);
      setSelectedFile(null);
      setStatusMessage('Profile image removed successfully.');
    },
  });

  return (
    <div className='min-h-screen bg-[#f6f8fc]'>
      <TopNavBar
        user={user}
        onLogout={() => {
          void logout();
        }}
      />

      <main className='mx-auto w-full max-w-[900px] px-4 pb-8 pt-[100px] sm:px-6 lg:pt-[84px]'>
        <section className='rounded-2xl border border-[#e9edf7] bg-white p-6 shadow-sm sm:p-8'>
          <h1 className='text-xl font-semibold text-[#112032] text-center'>
            Settings
          </h1>
          <p className='mt-1 text-sm text-[#6f7894] text-center'>
            Update your profile picture.
          </p>

          <div className='mt-6 flex flex-col gap-8 sm:flex-row justify-between items-center'>
            <div className='w-full flex flex-col items-center gap-4'>
              <ProfileImage
                src={previewUrl}
                alt='Profile preview'
                className='h-28 w-28 overflow-hidden rounded-full border border-[#e3e8f5]'
              />
              <div className='text-center'>
                <p className='text-base font-semibold text-[#112032]'>
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </p>
                <p className='text-sm text-[#6f7894]'>
                  {user?.email || 'No email available'}
                </p>
              </div>
            </div>

            <div className='w-full max-w-sm space-y-3'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#112032]'>
                  First Name
                </label>
                <input
                  type='text'
                  value={firstName}
                  className='w-full rounded-lg border border-[#dbe1f0] px-3 py-2 text-sm text-[#1a2640] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100'
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setStatusMessage(null);
                  }}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#112032]'>
                  Last Name
                </label>
                <input
                  type='text'
                  value={lastName}
                  className='w-full rounded-lg border border-[#dbe1f0] px-3 py-2 text-sm text-[#1a2640] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100'
                  onChange={(event) => {
                    setLastName(event.target.value);
                    setStatusMessage(null);
                  }}
                />
              </div>

              <button
                type='button'
                className='rounded-lg bg-[#112032] px-5 py-2 text-sm font-medium text-white hover:bg-[#0b1624] disabled:cursor-not-allowed disabled:opacity-60'
                disabled={
                  !firstName.trim() ||
                  !lastName.trim() ||
                  updateNameMutation.isPending ||
                  updateImageMutation.isPending ||
                  removeImageMutation.isPending
                }
                onClick={() => updateNameMutation.mutate()}
              >
                {updateNameMutation.isPending ? 'Saving name...' : 'Save name'}
              </button>

              <input
                type='file'
                accept='image/*'
                className='w-full rounded-lg border border-[#dbe1f0] px-3 py-2 text-sm text-[#1a2640] file:mr-3 file:rounded-md file:border-0 file:bg-[#eef2ff] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#243256]'
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] || null);
                  setStatusMessage(null);
                }}
              />

              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  className='rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60'
                  disabled={
                    !selectedFile ||
                    updateNameMutation.isPending ||
                    updateImageMutation.isPending ||
                    removeImageMutation.isPending
                  }
                  onClick={() => updateImageMutation.mutate()}
                >
                  {updateImageMutation.isPending ? 'Saving...' : 'Save photo'}
                </button>

                <button
                  type='button'
                  className='rounded-lg border border-[#d7dced] px-5 py-2 text-sm font-medium text-[#33415f] hover:bg-[#f5f7fc] disabled:cursor-not-allowed disabled:opacity-60'
                  disabled={
                    !user?.profileImageUrl ||
                    updateNameMutation.isPending ||
                    updateImageMutation.isPending ||
                    removeImageMutation.isPending
                  }
                  onClick={() => {
                    setStatusMessage(null);
                    removeImageMutation.mutate();
                  }}
                >
                  {removeImageMutation.isPending
                    ? 'Removing...'
                    : 'Remove photo'}
                </button>
              </div>

              {updateImageMutation.isError && (
                <p className='text-sm text-rose-600'>
                  {updateImageMutation.error instanceof Error
                    ? updateImageMutation.error.message
                    : 'Could not update profile image'}
                </p>
              )}

              {updateNameMutation.isError && (
                <p className='text-sm text-rose-600'>
                  {updateNameMutation.error instanceof Error
                    ? updateNameMutation.error.message
                    : 'Could not update profile name'}
                </p>
              )}

              {removeImageMutation.isError && (
                <p className='text-sm text-rose-600'>
                  {removeImageMutation.error instanceof Error
                    ? removeImageMutation.error.message
                    : 'Could not remove profile image'}
                </p>
              )}

              {statusMessage && (
                <p className='text-sm text-emerald-600'>{statusMessage}</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
