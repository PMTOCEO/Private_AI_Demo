import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../../Authentication/services/supabase';
import type { FileItem } from '../types/file';

export function useFiles() {
  const { user } = useAuth0();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(async (file: File, description?: string) => {
    if (!user) {
      console.log('Upload failed: No authenticated user');
      return null;
    }

    try {
      console.log('Starting file upload:', {
        fileName: file.name,
        fileSize: file.size,
        userId: user.sub
      });

      setIsUploading(true);
      setUploadProgress(0);

      // Upload file to Supabase Storage
      const filePath = `${user.sub}/${Date.now()}-${file.name}`;
      console.log('Uploading to storage:', { filePath });

      const { error: uploadError, data } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', { path: data.path });

      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(data.path);

      console.log('Generated public URL:', publicUrl);

      // Create file record in database
      console.log('Creating database record');
      const { error: dbError, data: fileRecord } = await supabase
        .from('files')
        .insert({
          name: file.name,
          description,
          size: file.size,
          mime_type: file.type,
          storage_path: data.path,
          public_url: publicUrl,
          user_id: user.sub,
          shared: false
        })
        .select('*')
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('Database record created:', fileRecord);

      // Return formatted file item
      const fileItem = {
        id: fileRecord.id,
        name: fileRecord.name,
        description: fileRecord.description,
        size: `${Math.round(fileRecord.size / 1024)} KB`,
        type: 'file' as const,
        fileType: {
          mimeType: fileRecord.mime_type,
          extension: fileRecord.name.split('.').pop() || '',
          displayName: fileRecord.name
        },
        dataUrl: fileRecord.public_url,
        createdDate: new Date(fileRecord.created_at).toLocaleString(),
        lastModified: fileRecord.updated_at ? new Date(fileRecord.updated_at).toLocaleString() : null,
        permissions: fileRecord.shared ? 'Shared' : 'Private',
        owner: user.email || 'You'
      } as FileItem;

      console.log('Returning file item:', fileItem);
      return fileItem;

    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [user]);

  const getFiles = useCallback(async () => {
    if (!user) {
      console.log('Get files failed: No authenticated user');
      return [];
    }

    try {
      console.log('Fetching files for user:', user.sub);

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      console.log('Retrieved files:', data);

      const fileItems = data.map(file => ({
        id: file.id,
        name: file.name,
        description: file.description,
        size: `${Math.round(file.size / 1024)} KB`,
        type: 'file' as const,
        fileType: {
          mimeType: file.mime_type,
          extension: file.name.split('.').pop() || '',
          displayName: file.name
        },
        dataUrl: file.public_url,
        createdDate: new Date(file.created_at).toLocaleString(),
        lastModified: file.updated_at ? new Date(file.updated_at).toLocaleString() : null,
        permissions: file.shared ? 'Shared' : 'Private',
        owner: user.email || 'You'
      }));

      console.log('Returning file items:', fileItems);
      return fileItems;
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }, [user]);

  return {
    uploadFile,
    getFiles,
    isUploading,
    uploadProgress
  };
}