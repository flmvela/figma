import { Hono } from "npm:hono";
import { supabase } from './storage.tsx';
import * as kv from './kv_store.tsx';

export const progressRoutes = new Hono();

// Update student progress
progressRoutes.post('/make-server-cdba2fd9/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { curriculumId, lessonId, completed, score, timeSpent } = await c.req.json();
    
    const progressId = `${user.id}:${curriculumId}:${lessonId}`;
    const progress = {
      userId: user.id,
      curriculumId,
      lessonId,
      completed: completed || false,
      score: score || 0,
      timeSpent: timeSpent || 0,
      updated_at: new Date().toISOString()
    };

    await kv.set(`progress:${progressId}`, progress);

    return c.json({ progress });
  } catch (error) {
    console.log('Progress update error:', error);
    return c.json({ error: 'Error updating progress' }, 500);
  }
});

// Get student progress for curriculum
progressRoutes.get('/make-server-cdba2fd9/progress/:curriculumId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const curriculumId = c.req.param('curriculumId');
    const progressEntries = await kv.getByPrefix(`progress:${user.id}:${curriculumId}:`);
    
    return c.json({ progress: progressEntries });
  } catch (error) {
    console.log('Progress fetch error:', error);
    return c.json({ error: 'Error fetching progress' }, 500);
  }
});