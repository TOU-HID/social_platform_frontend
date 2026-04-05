import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import loginImage from '../assets/images/login.png';
import logoImage from '../assets/images/logo.svg';
import googleImage from '../assets/images/google.svg';
import shape1 from '../assets/images/shape1.svg';
import shape2 from '../assets/images/shape2.svg';
import shape3 from '../assets/images/shape3.svg';
import darkShape from '../assets/images/dark_shape.svg';
import darkShape1 from '../assets/images/dark_shape1.svg';
import darkShape2 from '../assets/images/dark_shape2.svg';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await authApi.login({ email, password });
      login(data.accessToken, data.user);
      navigate('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='relative min-h-screen overflow-hidden bg-[#f8f9ff]'>
      <div className='pointer-events-none absolute -left-8 top-0 hidden md:block'>
        <img src={shape1} alt='' className='w-36 opacity-90' />
        <img src={darkShape} alt='' className='-mt-14 w-36 opacity-45' />
      </div>
      <div className='pointer-events-none absolute right-0 top-16 hidden md:block'>
        <img src={shape2} alt='' className='w-40 opacity-90' />
        <img src={darkShape1} alt='' className='-mt-16 w-40 opacity-40' />
      </div>
      <div className='pointer-events-none absolute bottom-0 left-1/2 hidden -translate-x-1/2 md:block'>
        <img src={shape3} alt='' className='w-52 opacity-90' />
        <img src={darkShape2} alt='' className='-mt-16 w-52 opacity-40' />
      </div>

      <div className='relative mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid w-full items-center gap-10 lg:grid-cols-12'>
          <div className='hidden lg:col-span-8 lg:flex lg:justify-center'>
            <img
              src={loginImage}
              alt='Login Visual'
              className='h-auto max-h-[78vh] w-full max-w-[760px] object-contain'
            />
          </div>

          <div className='mx-auto flex w-full max-w-[430px] flex-col items-center rounded-3xl bg-white/95 p-6 text-center shadow-[0_20px_60px_rgba(36,35,67,0.12)] backdrop-blur sm:p-8 lg:col-span-4'>
            <img src={logoImage} alt='Logo' className='mb-7 h-10 w-auto' />
            <p className='mb-2 text-sm font-medium text-[#7d84ab]'>
              Welcome back
            </p>
            <h1 className='mb-8 text-[32px] font-semibold leading-tight text-[#1e2147]'>
              Login to your account
            </h1>

            <button
              type='button'
              className='mb-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e3e7f5] bg-white px-4 py-3 text-sm font-medium text-[#4e5680]'
            >
              <img src={googleImage} alt='Google' className='h-5 w-5' />
              <span>Or sign-in with google</span>
            </button>

            <div className='relative mb-7 text-center'>
              <span className='absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#e9ebf5]' />
              <span className='relative bg-white px-4 text-sm text-[#8f95b2]'>
                Or
              </span>
            </div>

            <form onSubmit={onSubmit} className='w-full space-y-4'>
              <div>
                <label className='mb-2 block text-left text-md font-medium text-[#525b88]'>
                  Email
                </label>
                <input
                  type='email'
                  className='h-12 w-full rounded-xl border border-[#e0e4f2] bg-white px-4 text-[#1e2147] outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className='mb-2 block text-left text-md font-medium text-[#525b88]'>
                  Password
                </label>
                <input
                  type='password'
                  className='h-12 w-full rounded-xl border border-[#e0e4f2] bg-white px-4 text-[#1e2147] outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <div className='flex items-center justify-between gap-4 text-sm'>
                <label className='inline-flex items-center gap-2 text-[#6c739b]'>
                  <input
                    type='checkbox'
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className='h-4 w-4 rounded border-[#cad0e7] text-violet-600 focus:ring-violet-500'
                  />
                  Remember me
                </label>
                <button
                  type='button'
                  className='font-medium text-[#6f76a0] hover:text-violet-600'
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className='rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600'>
                  {error}
                </p>
              )}

              <button
                disabled={submitting}
                type='submit'
                className='mt-2 h-12 w-full rounded-xl bg-violet-600 px-4 text-base font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {submitting ? 'Logging in...' : 'Login now'}
              </button>
            </form>

            <p className='mt-8 text-center text-sm text-[#6c739b]'>
              Dont have an account?{' '}
              <Link
                to='/register'
                className='font-semibold text-violet-600 hover:underline'
              >
                Create New Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
