import { useCallback } from 'react';
import { useAuth } from '../../Authentication/context/AuthContext';
import { supabase } from '../../Database/services/supabase';
import { getCurrentUserUuid } from '../../Authentication/utils/authUUID';
import type { FileItem } from '../types/file';

export function useFiles() {
  const { user } = useAuth();

  const getFiles = useCallback(async () => {
    if (!user) {
      console.log('Get files failed: No authenticated user');
      return [];
    }
  
    try {
      // Get user UUID
      const uuid = await getCurrentUserUuid(user);
      if (!uuid) {
        throw new Error('Failed to get user UUID');
      }

      // Get files using UUID
      const { data: files, error: filesError } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', uuid)
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
        owner: user.email || 'You'
      }));

    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }, [user]);

  return {
    getFiles
  };
}