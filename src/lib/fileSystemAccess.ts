/**
 * File System Access API Service
 * Handles file operations using the File System Access API
 * This allows saving files directly to the user's device
 */

import { FileData } from './fileSystem';

// Store file handles for opened files
const fileHandles = new Map<string, FileSystemFileHandle>();

/**
 * Check if the File System Access API is supported by the browser
 */
export const isFileSystemAccessSupported = (): boolean => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
};

/**
 * Opens a file using the File System Access API
 */
export const openFileWithSystemAccess = async (): Promise<{ fileData: FileData; handle: FileSystemFileHandle } | null> => {
  try {
    if (!isFileSystemAccessSupported()) {
      throw new Error('File System Access API is not supported in this browser');
    }

    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Text Files',
          accept: {
            'text/*': ['.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md'],
          },
        },
      ],
      multiple: false,
    });

    const file = await handle.getFile();
    const content = await file.text();

    const fileData: FileData = {
      name: file.name,
      path: file.name,
      content,
      lastModified: file.lastModified,
    };

    // Store the file handle for later use
    fileHandles.set(fileData.path, handle);

    return { fileData, handle };
  } catch (error) {
    // User cancelled or other error
    console.error('Error opening file with system access:', error);
    return null;
  }
};

/**
 * Saves file content to the device using the File System Access API
 */
export const saveFileToDevice = async (path: string, content: string): Promise<boolean> => {
  try {
    let handle = fileHandles.get(path);

    // If we don't have a handle for this file, ask the user to select a location
    if (!handle) {
      handle = await window.showSaveFilePicker({
        suggestedName: path,
        types: [
          {
            description: 'Text Files',
            accept: {
              'text/*': ['.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md'],
            },
          },
        ],
      });
      fileHandles.set(path, handle);
    }

    // Create a writable stream and write the content
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();

    return true;
  } catch (error) {
    console.error('Error saving file to device:', error);
    return false;
  }
};

/**
 * Verifies if we have permission to write to a file
 */
export const verifyPermission = async (path: string): Promise<boolean> => {
  const handle = fileHandles.get(path);
  if (!handle) return false;

  // Check if we already have permission
  const options: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
  if ((await handle.queryPermission(options)) === 'granted') {
    return true;
  }

  // Request permission
  if ((await handle.requestPermission(options)) === 'granted') {
    return true;
  }

  return false;
};
