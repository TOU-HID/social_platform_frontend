import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi, getAccessToken, setAccessToken } from '../lib/api';
import type { User } from '../types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  setCurrentUser: (user: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (!getAccessToken()) {
          const refreshed = await authApi.refresh();
          setAccessToken(refreshed.accessToken);
        }
        const me = await authApi.me();
        setUser(me.user);
      } catch {
        setAccessToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: (token: string, nextUser: User) => {
        setAccessToken(token);
        setUser(nextUser);
      },
      setCurrentUser: (nextUser: User) => {
        setUser(nextUser);
      },
      logout: async () => {
        await authApi.logout();
        setAccessToken('');
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
