// Convert rich text content to plain text for display in sidebar/preview
export function richTextToPreview(content: string, maxLength: number = 100): string {
    try {
      // Try to parse as JSON (for new messages)
      const parsed = JSON.parse(content);
      if (parsed.text) {
        return truncateText(parsed.text, maxLength);
      }
    } catch {
      // If not JSON, try to extract text from HTML
      return truncateText(stripHtml(content), maxLength);
    }
    return truncateText(content, maxLength);
  }
  
  // Convert rich text content to plain text for API
  export function richTextToPlain(content: string): string {
    try {
      // Try to parse as JSON (for new messages)
      const parsed = JSON.parse(content);
      if (parsed.text) {
        return parsed.text;
      }
    } catch {
      // If not JSON, strip HTML tags
      return stripHtml(content);
    }
    return content;
  }
  
  // Helper function to strip HTML tags
  function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  
  // Helper function to truncate text
  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }