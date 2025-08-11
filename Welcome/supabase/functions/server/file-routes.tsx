import { Hono } from "npm:hono";
import { supabase, BUCKET_NAME } from './storage.tsx';

export const fileRoutes = new Hono();

// File upload
fileRoutes.post('/make-server-cdba2fd9/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileName = `${user.id}/${Date.now()}-${file.name}`;

    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return c.json({ error: 'Upload failed' }, 500);
    }

    // Create signed URL for private access
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    return c.json({ 
      fileName: data.path,
      signedUrl: urlData?.signedUrl
    });
  } catch (error) {
    console.log('File upload server error:', error);
    return c.json({ error: 'Internal server error during upload' }, 500);
  }
});