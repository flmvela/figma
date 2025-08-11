import { useState, useEffect } from 'react';
import { supabase, apiCall } from './utils/supabase/client';
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { StudentExperienceSection } from "./components/StudentExperienceSection";
import { PlatformPillarsSection } from "./components/PlatformPillarsSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { AuthDemo } from "./components/AuthDemo";
import { AdminDashboard } from "./components/AdminDashboard";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  institution: string;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('App: Auth state changed:', event, session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.access_token);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('App: Initial session check:', session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.access_token);
      }
    } catch (error) {
      console.error('App: Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (accessToken?: string) => {
    setProfileLoading(true);
    try {
      console.log('App: Fetching user profile...');
      const token = accessToken || (await supabase.auth.getSession()).data.session?.access_token;
      
      if (!token) {
        console.error('App: No access token available');
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
        console.log('App: Profile fetched:', data.profile);
        setUserProfile(data.profile);
      } else {
        const errorData = await response.json();
        console.error('App: Profile fetch failed:', errorData);
      }
    } catch (error) {
      console.error('App: Error fetching profile:', error);
    }
    setProfileLoading(false);
  };

  const handleSignOut = async () => {
    console.log('App: Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    setShowAuth(false);
  };

  // Show loading state
  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 bg-learning-gradient rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Gemeos Platform...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and has admin role, show admin dashboard
  if (user && userProfile?.role === 'admin') {
    console.log('App: Rendering AdminDashboard for admin user:', user.email);
    return <AdminDashboard user={user} onSignOut={handleSignOut} />;
  }

  // If user is authenticated but not admin, show auth demo (for role management)
  if (user) {
    console.log('App: Rendering AuthDemo for non-admin user:', user.email, 'Role:', userProfile?.role);
    return (
      <div className="min-h-screen bg-section-blue">
        <div className="container mx-auto px-4 py-8">
          <AuthDemo />
        </div>
      </div>
    );
  }

  // Show auth page if requested
  if (showAuth) {
    return (
      <div className="min-h-screen bg-section-blue">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mb-4">
            <button 
              onClick={handleBackToLanding}
              className="text-primary hover:underline mb-4"
            >
              ← Back to Landing Page
            </button>
          </div>
          <AuthDemo />
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  console.log('App: Rendering landing page for non-authenticated user');
  return (
    <div className="min-h-screen">
      {/* Alternating background colors for visual separation and readability */}
      <HeroSection onLoginClick={handleLoginClick} />
      <HowItWorksSection />
      <StudentExperienceSection />
      <PlatformPillarsSection />
      <FinalCTASection />
    </div>
  );
}