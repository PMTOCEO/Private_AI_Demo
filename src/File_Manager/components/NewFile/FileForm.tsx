import type { FileType } from '../../types/file';

interface FileFormProps {
  fileName: string;
  description: string;
  fileType: FileType | null;
  onFileNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function FileForm({
  fileName,
  description,
  fileType,
  onFileNameChange,
  onDescriptionChange
}: FileFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          File Name
        </label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2
            focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
            text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          placeholder="Enter file name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          File Type
        </label>
        <div className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2
          text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
          {fileType ? (
            <div className="flex flex-col">
              <span>{fileType.displayName}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {fileType.mimeType}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">No file selected</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2
            focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
            text-gray-900 dark:text-white bg-white dark:bg-gray-800 resize-none"
          placeholder="Enter file description"
        />
      </div>
    </div>
  );
}