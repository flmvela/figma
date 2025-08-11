import { Hono } from "npm:hono";
import { supabase } from './storage.tsx';
import * as kv from './kv_store.tsx';

export const analyticsRoutes = new Hono();

// Get analytics overview
analyticsRoutes.get('/make-server-cdba2fd9/analytics/overview', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's curricula count
    const curriculaIds = await kv.getByPrefix(`user_curricula:${user.id}:`);
    
    // Get recent progress entries
    const recentProgress = await kv.getByPrefix(`progress:${user.id}:`);
    const completedLessons = recentProgress.filter(p => p.completed).length;
    
    const analytics = {
      totalCurricula: curriculaIds.length,
      completedLessons,
      totalProgress: recentProgress.length,
      lastActivity: new Date().toISOString()
    };

    return c.json({ analytics });
  } catch (error) {
    console.log('Analytics error:', error);
    return c.json({ error: 'Error fetching analytics' }, 500);
  }
});