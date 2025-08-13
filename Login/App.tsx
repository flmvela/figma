'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './lib/supabase/client';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import AuthCallback from './components/AuthCallback';

// Simple router context for navigation
const RouterContext = createContext<{
  currentPath: string;
  navigate: (path: string) => void;
  searchParams: URLSearchParams;
}>({
  currentPath: '/',
  navigate: () => {},
  searchParams: new URLSearchParams()
});

export const useRouter = () => {
  const context = useContext(RouterContext);
  return {
    replace: context.navigate,
    push: context.navigate,
  };
};

export const useSearchParams = () => {
  const context = useContext(RouterContext);
  return context.searchParams;
};

export default function App() {
  const [currentPath, setCurrentPath] = useState('/login');
  const [searchParams, setSearchParams] = useState(new URLSearchParams());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = (path: string) => {
    const [pathname, search] = path.split('?');
    setCurrentPath(pathname);
    setSearchParams(new URLSearchParams(search || ''));
  };

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          if (currentPath === '/login' || currentPath === '/') {
            navigate('/dashboard');
          }
        } else {
          setUser(null);
          if (currentPath !== '/login' && currentPath !== '/auth/callback') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentPath]);

  const routerValue = {
    currentPath,
    navigate,
    searchParams
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <RouterContext.Provider value={routerValue}>
      <div className="min-h-screen">
        {currentPath === '/login' && <LoginPage />}
        {currentPath === '/dashboard' && <DashboardPage user={user} />}
        {currentPath === '/auth/callback' && <AuthCallback />}
      </div>
    </RouterContext.Provider>
  );
}