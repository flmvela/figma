'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
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

    handleAuthCallback();
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