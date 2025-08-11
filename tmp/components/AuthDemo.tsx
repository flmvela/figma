import { useState, useEffect } from 'react';
import { supabase, apiCall } from '../utils/supabase/client';
import { AdminDashboard } from './AdminDashboard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  institution: string;
}

export function AuthDemo() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    institution: '',
    role: 'educator'
  });

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.access_token);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Existing session:', session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.access_token);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const fetchUserProfile = async (accessToken?: string) => {
    setProfileLoading(true);
    try {
      console.log('Fetching user profile...');
      const token = accessToken || (await supabase.auth.getSession()).data.session?.access_token;
      
      if (!token) {
        console.error('No access token available');
        setProfileLoading(false);
        return;
      }

      const response = await apiCall('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile fetched:', data.profile);
        setUserProfile(data.profile);
        
        // Clear any previous error messages on successful profile fetch
        if (message.includes('Error')) {
          setMessage('');
        }
      } else {
        const errorData = await response.json();
        console.error('Profile fetch failed:', errorData);
        setMessage(`Profile error: ${errorData.error || 'Failed to load profile'}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error loading user profile. Please try signing in again.');
    }
    setProfileLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Creating account for:', formData.email, 'with role:', formData.role);
      const response = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Account created successfully! Signing you in...');
        // Now sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (error) {
          setMessage(`Sign in error: ${error.message}`);
        }
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error during signup');
      console.error('Signup error:', error);
    }
    
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Signing in:', formData.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setMessage(`Sign in error: ${error.message}`);
      } else {
        console.log('Sign in successful for:', data.user?.email);
        setMessage('Signed in successfully!');
      }
    } catch (error) {
      setMessage('Error during sign in');
      console.error('Sign in error:', error);
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
    setMessage('Signed out successfully!');
    setUser(null);
    setUserProfile(null);
  };

  // Debug info
  console.log('Current state:', {
    user: user?.email,
    userProfile: userProfile?.role,
    profileLoading
  });

  // Show loading while profile is being fetched
  if (user && profileLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-8">
          <div className="text-center">
            <div className="h-8 w-8 bg-learning-gradient rounded-full animate-pulse mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show admin dashboard for admin users
  if (user && userProfile?.role === 'admin') {
    console.log('Rendering admin dashboard for:', user.email);
    return <AdminDashboard user={user} onSignOut={handleSignOut} />;
  }

  // Show regular user interface for non-admin users
  if (user && userProfile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Gemeos!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">{userProfile.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="text-sm text-muted-foreground capitalize">Role:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                userProfile.role === 'admin' ? 'bg-red-100 text-red-800' :
                userProfile.role === 'educator' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {userProfile.role}
              </span>
            </div>
            {userProfile.institution && (
              <p className="text-sm text-muted-foreground mt-1">{userProfile.institution}</p>
            )}
          </div>
          
          {userProfile.role === 'educator' && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Educator Portal</h3>
              <p className="text-sm text-blue-800">Access curriculum creation tools, student analytics, and personalized learning resources.</p>
            </div>
          )}
          
          {userProfile.role === 'student' && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">Student Dashboard</h3>
              <p className="text-sm text-green-800">Continue your learning journey with AI-powered personalized curricula.</p>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
            
            {userProfile.role !== 'admin' && (
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fetchUserProfile()}
                  className="w-full text-xs"
                >
                  Refresh Profile
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={async () => {
                    try {
                      setMessage('Updating role to admin...');
                      const token = (await supabase.auth.getSession()).data.session?.access_token;
                      const response = await apiCall('/auth/fix-profile', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ role: 'admin' })
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        setUserProfile(data.profile);
                        setMessage('Role updated to admin!');
                      } else {
                        const errorData = await response.json();
                        setMessage(`Error: ${errorData.error}`);
                      }
                    } catch (error) {
                      console.error('Update role error:', error);
                      setMessage('Error updating role');
                    }
                  }}
                  className="w-full text-xs text-red-600"
                >
                  Set Role to Admin
                </Button>
              </div>
            )}
          </div>

          {message && (
            <Alert>
              <AlertDescription className="whitespace-pre-wrap">{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show error state if user exists but no profile
  if (user && !userProfile && !profileLoading) {
    const fixProfile = async (role = 'admin') => {
      try {
        setMessage('Creating profile...');
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const response = await apiCall('/auth/fix-profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role })
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
          setMessage('Profile created successfully!');
        } else {
          const errorData = await response.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Fix profile error:', error);
        setMessage('Error creating profile');
      }
    };

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Your account needs a profile setup. Click below to create your admin profile.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Button onClick={() => fixProfile('admin')} className="w-full">
              Create Admin Profile
            </Button>
            <Button onClick={() => fixProfile('educator')} variant="outline" className="w-full">
              Create Educator Profile
            </Button>
            <Button onClick={() => fetchUserProfile()} variant="ghost" className="w-full">
              Retry Loading Profile
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>User: {user.email}</p>
            <p>Choose your role to continue to the appropriate dashboard.</p>
          </div>
          
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show authentication form for non-authenticated users
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Gemeos Platform Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="educator@school.edu"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Dr. Jane Smith"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            value={formData.institution}
            onChange={(e) => setFormData({...formData, institution: e.target.value})}
            placeholder="University of Learning"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="educator">Educator</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleSignUp} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          
          <Button 
            onClick={handleSignIn} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>

        <div className="text-center space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={async () => {
              try {
                setMessage('Creating demo users...');
                const response = await apiCall('/auth/create-demo-users', { method: 'POST' });
                const data = await response.json();
                console.log('Demo users result:', data);
                setMessage(`Demo users created successfully!`);
              } catch (error) {
                console.error('Error creating demo users:', error);
                setMessage('Error creating demo users');
              }
            }}
            className="text-xs"
          >
            Create Demo Users
          </Button>
          <div className="text-xs text-muted-foreground">
            <p>Demo credentials for testing:</p>
            <p><strong>Admin:</strong> admin@gemeos.ai / admin123</p>
            <p><strong>Admin Alt:</strong> admin@gemeos.com / admin123</p>
            <p><strong>Educator:</strong> educator@school.edu / educator123</p>
          </div>
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}