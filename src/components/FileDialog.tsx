import React from 'react';
import { Button } from "@/components/ui/button";
import { FileData, openFile, createNewFile, downloadFile } from "@/lib/fileSystem";
import { openFileWithSystemAccess, isFileSystemAccessSupported } from "@/lib/fileSystemAccess";
import { Plus, Download, FolderOpen, HardDrive } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FileDialogProps {
  onFileOpen: (file: FileData) => void;
  currentFile: FileData | null;
}

export function FileDialog({ onFileOpen, currentFile }: Readonly<FileDialogProps>) {
  const handleOpenFile = async () => {
    const file = await openFile();
    if (file) {
      onFileOpen(file);
    }
  };

  const handleOpenFileWithSystemAccess = async () => {
    const result = await openFileWithSystemAccess();
    if (result) {
      onFileOpen(result.fileData);
    }
  };

  const handleNewFile = () => {
    const fileName = prompt('Enter file name (with extension):', 'untitled.txt');
    if (fileName) {
      const newFile = createNewFile(fileName);
      onFileOpen(newFile);
    }
  };

  const handleDownload = () => {
    if (currentFile) {
      downloadFile(currentFile.path);
    }
  };
  
  // Check if File System Access API is supported
  const fsApiSupported = isFileSystemAccessSupported();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-md">
      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mr-auto">WebPad</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewFile}
            >
              <Plus className="mr-1" size={16} />
              <span className='hidden md:block'>New File</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new text file with a custom name</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenFile}
            >
              <FolderOpen className="mr-1" size={16} />
              <span className='hidden md:block'>Open File</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open a text file from your browser&apos;s storage</p>
          </TooltipContent>
        </Tooltip>

        {fsApiSupported && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenFileWithSystemAccess}
              >
                <HardDrive className="mr-1" size={16} />
                <span className='hidden md:block'>Open from Device</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open a file directly from your device using File System Access API</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!currentFile}
            >
              <Download className="mr-1" size={16} />
              <span className='hidden md:block'>Download</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download the current file to your device</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
