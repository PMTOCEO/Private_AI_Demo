import { useCallback } from 'react';
import { useAuth } from '../../Authentication/context/AuthContext';
import { supabase } from '../../Database/services/supabase';
import type { FileItem } from '../types/file';

export function useFiles() {
  const { user, isAuthenticated } = useAuth();

  const getFiles = useCallback(async () => {
    if (!isAuthenticated || !user) {
      console.log('Get files failed: No authenticated user');
      return [];
    }
  
    try {
      // Get files from database
      const { data: files, error: filesError } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (filesError) {
        console.error('Database query error:', filesError);
        throw filesError;
      }

      return files.map(file => ({
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
        owner: user.email || 'You',
        shared: file.shared,
        storagePath: file.storage_path,
        parentId: file.parent_id,
        order: file.order
      }));

    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }, [user, isAuthenticated]);

  const uploadFile = useCallback(async (file: File, description?: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('No authenticated user');
    }

    try {
      // Create storage path
      const timestamp = Date.now();
      const storagePath = `${timestamp}-${file.name}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('private')
        .upload(storagePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get file URL
      const { data: urlData } = await supabase.storage
        .from('private')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      // Create database record
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          description,
          size: file.size,
          mime_type: file.type,
          storage_path: storagePath,
          public_url: urlData?.signedUrl,
          shared: false
        })
        .select()
        .single();

      if (dbError) {
        // Cleanup storage if database insert fails
        await supabase.storage
          .from('private')
          .remove([storagePath]);
        throw dbError;
      }

      return {
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
        owner: user.email || 'You',
        shared: fileRecord.shared,
        storagePath: fileRecord.storage_path,
        parentId: fileRecord.parent_id,
        order: fileRecord.order
      } as FileItem;

    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, [user, isAuthenticated]);

  const updateFile = useCallback(async (fileId: string, updates: Partial<FileItem>) => {
    if (!isAuthenticated || !user) {
      throw new Error('No authenticated user');
    }

    try {
      const { error } = await supabase
        .from('files')
        .update({
          name: updates.name,
          description: updates.description,
          shared: updates.shared,
          parent_id: updates.parentId,
          order: updates.order,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }, [user, isAuthenticated]);

  const deleteFile = useCallback(async (fileId: string, storagePath: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('No authenticated user');
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('private')
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }

      // Delete database record
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw dbError;
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }, [user, isAuthenticated]);

  return {
    getFiles,
    uploadFile,
    updateFile,
    deleteFile
  };
}
