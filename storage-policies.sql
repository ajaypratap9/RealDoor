-- Fix for Supabase Storage Uploads
-- Run this in your Supabase SQL Editor to allow authenticated users to upload files

-- 1. Allow authenticated users to upload files to the "documents" bucket
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'documents' );

-- 2. Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE
TO authenticated 
USING ( bucket_id = 'documents' );

-- 3. Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes" 
ON storage.objects FOR DELETE
TO authenticated 
USING ( bucket_id = 'documents' );

-- 4. Allow public read access to the bucket (since you set it to Public)
CREATE POLICY "Allow public read" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'documents' );
