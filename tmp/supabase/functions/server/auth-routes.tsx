import { Hono } from "npm:hono";
import { supabase } from './storage.tsx';
import * as kv from './kv_store.tsx';

export const authRoutes = new Hono();

// User signup
authRoutes.post('/make-server-cdba2fd9/auth/signup', async (c) => {
  try {
    const { email, password, role, name, institution } = await c.req.json();
    
    // Validate role
    const validRoles = ['student', 'educator', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'educator';
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        role: userRole,
        institution: institution || ''
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user_profile:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role: userRole,
      institution: institution || '',
      created_at: new Date().toISOString()
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup server error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile
authRoutes.get('/make-server-cdba2fd9/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    console.log('Fetching profile for token:', accessToken ? 'present' : 'missing');
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      console.log('Auth error:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('User authenticated:', user.email, 'ID:', user.id);
    
    let profile = await kv.get(`user_profile:${user.id}`);
    console.log('Profile from KV:', profile);
    
    // If no profile exists, create one from user metadata
    if (!profile && user.user_metadata) {
      console.log('Creating profile from user metadata:', user.user_metadata);
      profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name || user.email,
        role: user.user_metadata.role || 'educator',
        institution: user.user_metadata.institution || '',
        created_at: new Date().toISOString()
      };
      
      // Store the profile for future use
      await kv.set(`user_profile:${user.id}`, profile);
      console.log('Profile created and stored:', profile);
    }
    
    if (!profile) {
      console.log('No profile found, creating default');
      // Create a default profile if nothing exists
      profile = {
        id: user.id,
        email: user.email,
        name: user.email,
        role: 'educator',
        institution: '',
        created_at: new Date().toISOString()
      };
      await kv.set(`user_profile:${user.id}`, profile);
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Error fetching profile' }, 500);
  }
});

// Create demo users (for development/testing)
authRoutes.post('/make-server-cdba2fd9/auth/create-demo-users', async (c) => {
  try {
    const demoUsers = [
      {
        email: 'admin@gemeos.ai',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        institution: 'Gemeos Platform'
      },
      {
        email: 'admin@gemeos.com',
        password: 'admin123',
        name: 'Admin User Alt',
        role: 'admin',
        institution: 'Gemeos Platform'
      },
      {
        email: 'educator@school.edu',
        password: 'educator123',
        name: 'Dr. Sarah Johnson',
        role: 'educator',
        institution: 'MIT'
      }
    ];

    const results = [];
    for (const demoUser of demoUsers) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: demoUser.email,
        password: demoUser.password,
        user_metadata: { 
          name: demoUser.name,
          role: demoUser.role,
          institution: demoUser.institution
        },
        email_confirm: true
      });

      if (!error && data.user) {
        await kv.set(`user_profile:${data.user.id}`, {
          id: data.user.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          institution: demoUser.institution,
          created_at: new Date().toISOString()
        });
        results.push({ email: demoUser.email, status: 'created' });
      } else {
        results.push({ email: demoUser.email, status: 'error', error: error?.message });
      }
    }

    return c.json({ results });
  } catch (error) {
    console.log('Demo users creation error:', error);
    return c.json({ error: 'Error creating demo users' }, 500);
  }
});

// Fix missing profile for existing user
authRoutes.post('/make-server-cdba2fd9/auth/fix-profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { role = 'admin' } = await c.req.json();
    
    const profile = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      role: role,
      institution: user.user_metadata?.institution || 'Gemeos Platform',
      created_at: new Date().toISOString()
    };
    
    await kv.set(`user_profile:${user.id}`, profile);
    console.log('Profile fixed for user:', user.email, profile);
    
    return c.json({ profile, message: 'Profile created successfully' });
  } catch (error) {
    console.log('Fix profile error:', error);
    return c.json({ error: 'Error fixing profile' }, 500);
  }
});