'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, Github } from 'lucide-react';
import { useRouter, useSearchParams } from '../App';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    magicLinkEmail: ''
  });

  // Check for error from URL params (from auth callback)
  const urlError = searchParams.get('error');
  if (urlError && !error) {
    setError(urlError);
  }

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        router.replace('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMagicLinkLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.magicLinkEmail,
        options: {
          emailRedirectTo: `${window.location.origin}#/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Check your email for the sign-in link.');
      }
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
      console.error('Magic link error:', err);
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsOAuthLoading(provider);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}#/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
        setIsOAuthLoading(null);
      }
      // Don't reset loading state if successful - user will be redirected
    } catch (err) {
      setError('OAuth authentication failed. Please try again.');
      console.error('OAuth error:', err);
      setIsOAuthLoading(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Email + Password Form */}
            <form onSubmit={handleEmailPasswordLogin} className="space-y-4 mb-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  aria-invalid={error ? 'true' : 'false'}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  aria-invalid={error ? 'true' : 'false'}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
              <div>
                <Label htmlFor="magicLinkEmail">Email for magic link</Label>
                <Input
                  id="magicLinkEmail"
                  type="email"
                  value={formData.magicLinkEmail}
                  onChange={(e) => handleInputChange('magicLinkEmail', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={isMagicLinkLoading}
                aria-busy={isMagicLinkLoading}
              >
                {isMagicLinkLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending magic link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send magic link
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth('google')}
                disabled={!!isOAuthLoading}
                aria-busy={isOAuthLoading === 'google'}
              >
                {isOAuthLoading === 'google' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth('github')}
                disabled={!!isOAuthLoading}
                aria-busy={isOAuthLoading === 'github'}
              >
                {isOAuthLoading === 'github' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to GitHub...
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </>
                )}
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}