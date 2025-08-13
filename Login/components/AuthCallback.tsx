'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useRouter } from '../App';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash (for OAuth callbacks)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Set the session from the URL params
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('Auth callback error:', error);
            router.replace('/login?error=' + encodeURIComponent(error.message));
            return;
          }
        }

        // Check current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          router.replace('/login?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          router.replace('/dashboard');
        } else {
          // No session found, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.replace('/login?error=' + encodeURIComponent('Authentication failed'));
      }
    };

    // Small delay to ensure the component is mounted
    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}