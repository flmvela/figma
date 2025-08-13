'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from '../App';

interface DashboardPageProps {
  user: any;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isSigningOut}
          >
            <LogOut className="h-4 w-4" />
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Welcome Back!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Last Sign In:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
                {user?.user_metadata?.name && (
                  <p><strong>Name:</strong> {user.user_metadata.name}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Congratulations! You've successfully authenticated with Supabase. 
                You can now build out your application with user-specific features.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Your session is automatically managed</p>
                <p>• Authentication state persists across page reloads</p>
                <p>• Sign out will redirect you back to the login page</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Methods Tested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>✅ Email + Password Authentication</p>
                <p>✅ Magic Link (Passwordless) Authentication</p>
                <p>✅ OAuth (Google & GitHub) Authentication</p>
                <p>✅ Session Management & Auto-redirect</p>
                <p>✅ Error Handling & User Feedback</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}