import { Hono } from "npm:hono";
import { supabase } from './storage.tsx';
import * as kv from './kv_store.tsx';

export const curriculumRoutes = new Hono();

// Create curriculum
curriculumRoutes.post('/make-server-cdba2fd9/curriculum', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, description, subject, gradeLevel, content } = await c.req.json();
    
    const curriculumId = crypto.randomUUID();
    const curriculum = {
      id: curriculumId,
      title,
      description,
      subject,
      gradeLevel,
      content,
      createdBy: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(`curriculum:${curriculumId}`, curriculum);
    await kv.set(`user_curricula:${user.id}:${curriculumId}`, curriculumId);

    return c.json({ curriculum });
  } catch (error) {
    console.log('Curriculum creation error:', error);
    return c.json({ error: 'Error creating curriculum' }, 500);
  }
});

// Get user's curricula
curriculumRoutes.get('/make-server-cdba2fd9/curriculum', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const curriculaIds = await kv.getByPrefix(`user_curricula:${user.id}:`);
    const curricula = [];
    
    for (const id of curriculaIds) {
      const curriculum = await kv.get(`curriculum:${id}`);
      if (curriculum) curricula.push(curriculum);
    }

    return c.json({ curricula });
  } catch (error) {
    console.log('Curricula fetch error:', error);
    return c.json({ error: 'Error fetching curricula' }, 500);
  }
});