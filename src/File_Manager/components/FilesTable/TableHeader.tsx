export function TableHeader() {
  return (
    <div className="grid grid-cols-[auto_auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="w-6"></div>
      <div className="w-6"></div>
      <div className="text-gray-900 dark:text-white font-medium">Name</div>
      <div className="text-gray-900 dark:text-white font-medium">Size</div>
      <div className="text-gray-900 dark:text-white font-medium">File Type</div>
      <div className="text-gray-900 dark:text-white font-medium">Created</div>
      <div className="text-gray-900 dark:text-white font-medium">Modified</div>
      <div className="w-6"></div>
    </div>
  );
}