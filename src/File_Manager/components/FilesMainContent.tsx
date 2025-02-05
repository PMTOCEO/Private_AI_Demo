import React from 'react';
import { FilesTabs } from './FilesTabs';
import { FilesTable } from './FilesTable';
import { FolderNavigation } from './FolderNavigation';

export function FilesMainContent() {
  const [activeTab, setActiveTab] = React.useState<'my-files' | 'shared'>('my-files');

  return (
    <main className="flex-1 flex flex-col px-8 pt-10">
      <div className="space-y-6">
        <div className="pt-4">
          <FilesTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <FolderNavigation />
        <FilesTable type={activeTab} />
      </div>
    </main>
  );
}