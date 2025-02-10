import React from 'react';
import { FilesTabs } from './FilesTabs';
import { FilesTable } from './FilesTable';
import { FolderNavigation } from './FolderNavigation';
import type { FileItem } from '../types/file';

interface FilesMainContentProps {
  files: FileItem[];
  onFileUpdate: (fileId: string, updates: Partial<FileItem>) => Promise<void>;
  onFileDelete: (fileId: string, storagePath: string) => Promise<void>;
}

export function FilesMainContent({ files, onFileUpdate, onFileDelete }: FilesMainContentProps) {
  const [activeTab, setActiveTab] = React.useState<'my-files' | 'shared'>('my-files');

  return (
    <main className="flex-1 flex flex-col px-8 pt-10">
      <div className="space-y-6">
        <div className="pt-4">
          <FilesTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <FolderNavigation />
        <FilesTable 
          type={activeTab} 
          files={files}
          onFileUpdate={onFileUpdate}
          onFileDelete={onFileDelete}
        />
      </div>
    </main>
  );
}