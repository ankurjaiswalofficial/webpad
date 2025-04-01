/**
 * File System Service
 * Handles file operations for the live editor
 */

export interface FileData {
  name: string;
  path: string;
  content: string;
  lastModified: number;
}

// Cache for storing file data
const fileCache = new Map<string, FileData>();

/**
 * Opens a file from the user's system
 */
export const openFile = async (): Promise<FileData | null> => {
  try {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.jsx,.ts,.tsx,.html,.css,.json,.md';
    
    // Create a promise that resolves when a file is selected
    const fileSelected = new Promise<FileData | null>((resolve) => {
      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        
        if (!files || files.length === 0) {
          resolve(null);
          return;
        }
        
        const file = files[0];
        const content = await file.text();
        
        const fileData: FileData = {
          name: file.name,
          path: file.name, // Browser security prevents getting the full path
          content,
          lastModified: file.lastModified,
        };
        
        // Cache the file data
        fileCache.set(fileData.path, fileData);
        
        resolve(fileData);
      };
    });
    
    // Trigger the file dialog
    input.click();
    
    return await fileSelected;
  } catch (error) {
    console.error('Error opening file:', error);
    return null;
  }
};

/**
 * Saves file content to cache
 */
export const saveFile = (path: string, content: string): FileData | null => {
  try {
    const existingFile = fileCache.get(path);
    
    if (!existingFile) {
      return null;
    }
    
    const updatedFile: FileData = {
      ...existingFile,
      content,
      lastModified: Date.now(),
    };
    
    // Update cache
    fileCache.set(path, updatedFile);
    
    // Also save to localStorage as backup
    localStorage.setItem(`file_${path}`, JSON.stringify(updatedFile));
    
    return updatedFile;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
};

/**
 * Downloads the file to the user's system
 */
export const downloadFile = (path: string): void => {
  try {
    const fileData = fileCache.get(path);
    
    if (!fileData) {
      throw new Error('File not found in cache');
    }
    
    const blob = new Blob([fileData.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.name;
    a.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

/**
 * Retrieves a file from cache
 */
export const getFile = (path: string): FileData | null => {
  // Try to get from memory cache first
  const cachedFile = fileCache.get(path);
  
  if (cachedFile) {
    return cachedFile;
  }
  
  // Try to get from localStorage
  try {
    const storedFile = localStorage.getItem(`file_${path}`);
    
    if (storedFile) {
      const fileData = JSON.parse(storedFile) as FileData;
      fileCache.set(path, fileData); // Update memory cache
      return fileData;
    }
  } catch (error) {
    console.error('Error retrieving file from localStorage:', error);
  }
  
  return null;
};

/**
 * Creates a new empty file
 */
export const createNewFile = (name: string): FileData => {
  const fileData: FileData = {
    name,
    path: name,
    content: '',
    lastModified: Date.now(),
  };
  
  fileCache.set(fileData.path, fileData);
  localStorage.setItem(`file_${fileData.path}`, JSON.stringify(fileData));
  
  return fileData;
};
