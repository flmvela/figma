import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export const initializeStorage = async () => {
  const bucketName = 'make-cdba2fd9-educational-content';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(bucketName, { public: false });
    if (error) {
      console.log('Error creating bucket:', error);
    } else {
      console.log('Created educational content bucket');
    }
  }
};

export { supabase };
export const BUCKET_NAME = 'make-cdba2fd9-educational-content';