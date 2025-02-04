import type { FileItem } from '../types/file';

// Search through file contents and metadata
export function searchFiles(files: FileItem[], query: string): FileItem[] {
  if (!query.trim()) return files;

  const normalizedQuery = query.toLowerCase().trim();
  const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 0);
  
  return searchFilesRecursively(files, searchTerms);
}

// Recursively search through file tree
function searchFilesRecursively(files: FileItem[], searchTerms: string[]): FileItem[] {
  const results: FileItem[] = [];

  for (const file of files) {
    if (matchesSearchTerms(file, searchTerms)) {
      results.push(file);
    }

    // If it's a folder, search its contents
    if (file.type === 'folder' && file.children) {
      const childResults = searchFilesRecursively(file.children, searchTerms);
      results.push(...childResults);
    }
  }

  return results;
}

// Check if file matches search terms
function matchesSearchTerms(file: FileItem, searchTerms: string[]): boolean {
  const searchableFields = [
    file.name.toLowerCase(),
    file.fileType?.displayName.toLowerCase() || '',
    file.description?.toLowerCase() || '',
    file.content?.toLowerCase() || '',
    ...getMetadataSearchTerms(file)
  ];

  return searchTerms.every(term =>
    searchableFields.some(field => field.includes(term))
  );
}

// Extract searchable metadata
function getMetadataSearchTerms(file: FileItem): string[] {
  const terms: string[] = [];

  // Add file type specific terms
  if (file.type === 'folder') {
    terms.push('folder', 'directory');
  } else {
    terms.push('file');
    if (file.fileType?.extension) {
      terms.push(file.fileType.extension.toLowerCase());
    }
  }

  // Add date related terms
  const createdDate = new Date(file.createdDate);
  terms.push(
    createdDate.toLocaleDateString(),
    createdDate.toLocaleString('default', { month: 'long' }).toLowerCase(),
    createdDate.getFullYear().toString()
  );

  if (file.lastModified) {
    const modifiedDate = new Date(file.lastModified);
    terms.push(
      modifiedDate.toLocaleDateString(),
      modifiedDate.toLocaleString('default', { month: 'long' }).toLowerCase(),
      modifiedDate.getFullYear().toString()
    );
  }

  // Add size related terms
  if (file.size) {
    terms.push(file.size.toLowerCase());
  }

  return terms;
}