"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { EditorToolbar } from "./EditorToolbar";
import { FileData } from "@/lib/fileSystem";

interface EditorToolbarMobileProps {
  currentFile: FileData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorRef: React.MutableRefObject<any>;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  wordCount: number;
  charCount: number;
  autoSave: boolean;
  setAutoSave: (enabled: boolean) => void;
}

export function EditorToolbarMobile(props: Readonly<EditorToolbarMobileProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full">
        <SheetHeader>
          <SheetTitle>Editor Settings</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <EditorToolbar {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
