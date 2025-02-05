import type { FileItem } from '../../types/file';

interface FileMetadataProps {
  file: FileItem;
  fileName: string;
  description: string;
  onInputChange: (field: 'name' | 'description', value: string) => void;
}

export function FileMetadata({ file, fileName, description, onInputChange }: FileMetadataProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 
            focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
            text-gray-900 dark:text-white bg-white dark:bg-gray-800"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2
            focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
            text-gray-900 dark:text-white bg-white dark:bg-gray-800 resize-none"
          placeholder="Add a description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <p className="text-gray-900 dark:text-white mt-1">
            {file.fileType?.displayName || file.type}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
          <p className="text-gray-900 dark:text-white mt-1">{file.size}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
          <p className="text-gray-900 dark:text-white mt-1">{file.createdDate}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modified</label>
          <p className="text-gray-900 dark:text-white mt-1">{file.lastModified || '—'}</p>
        </div>
      </div>
    </div>
  );
}