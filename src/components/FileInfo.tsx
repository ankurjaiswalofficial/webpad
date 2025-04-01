import React from 'react';
import { FileData } from "@/lib/fileSystem";
import { Loader2, FileText } from "lucide-react";

interface FileInfoProps {
  currentFile: FileData | null;
  isSaving: boolean;
}

export function FileInfo({ currentFile, isSaving }: Readonly<FileInfoProps>) {
  if (!currentFile) {
    return (
      <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-md text-muted-foreground">
        <FileText size={16} />
        <span>No file opened. Create a new file or open an existing one.</span>
      </div>
    );
  }

  const lastModified = new Date(currentFile.lastModified).toLocaleString();

  return (
    <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-md">
      <div className="flex items-center flex-wrap gap-2">
        <FileText size={16} />
        <span className="font-medium w-3/4 text-nowrap text-ellipsis overflow-hidden text-xs md:text-base">{currentFile.name}</span>
        <span className="text-xs text-muted-foreground w-5/6 text-nowrap overflow-hidden text-ellipsis">Last modified: {lastModified}</span>
      </div>
      <div className="flex items-center gap-1 text-xs p-2">
        {isSaving ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>Saved</span>
        )}
      </div>
    </div>
  );
}
