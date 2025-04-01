"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";
import { FileDialog } from "@/components/FileDialog";
import { FileInfo } from "@/components/FileInfo";
import { EditorToolbar } from "@/components/EditorToolbar";
import { EditorToolbarMobile } from "@/components/EditorToolbarMobile";
import { FileData, saveFile } from "@/lib/fileSystem";
import { useTheme } from "next-themes";

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

export default function Home() {
  const [fileContent, setFileContent] = useState('');
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('monospace');
  const [autoSave, setAutoSave] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const { theme: systemTheme, setTheme: setSystemTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check if there was a previously opened file
    const lastOpenedFile = localStorage.getItem('lastOpenedFile');
    if (lastOpenedFile) {
      try {
        const fileData = JSON.parse(lastOpenedFile) as FileData;
        setCurrentFile(fileData);
        setFileContent(fileData.content);
      } catch (error) {
        console.error('Error loading last opened file:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Update word and character count when content changes
  useEffect(() => {
    if (fileContent) {
      // Calculate character count
      const chars = fileContent.length;
      setCharCount(chars);
      
      // Calculate word count (split by whitespace)
      const words = fileContent.trim() ? fileContent.trim().split(/\s+/).length : 0;
      setWordCount(words);
    } else {
      setCharCount(0);
      setWordCount(0);
    }
  }, [fileContent]);
  
  // Sync editor theme with system theme
  useEffect(() => {
    if (systemTheme === 'dark' || systemTheme === 'light') {
      setEditorTheme(systemTheme as 'dark' | 'light');
    }
  }, [systemTheme]);

  useEffect(() => {
    if (!currentFile || currentFile.content === fileContent || !autoSave) {
      return;
    }

    const performAutoSave = () => {
      setIsSaving(true);
      
      // Save to file system cache
      if (currentFile) {
        const updatedFile = saveFile(currentFile.path, fileContent);
        if (updatedFile) {
          setCurrentFile(updatedFile);
          // Also save as last opened file
          localStorage.setItem('lastOpenedFile', JSON.stringify(updatedFile));
        }
      }
      
      setTimeout(() => setIsSaving(false), 500);
    };

    const debounce = setTimeout(performAutoSave, 500);
    return () => clearTimeout(debounce);
  }, [fileContent, currentFile, autoSave]);

  const handleFileOpen = (file: FileData) => {
    setCurrentFile(file);
    setFileContent(file.content);
    localStorage.setItem('lastOpenedFile', JSON.stringify(file));
  };

  const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
    switch (extension) {
      // JavaScript family
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'mjs': return 'javascript';
      case 'cjs': return 'javascript';
      
      // Web development
      case 'html': return 'html';
      case 'htm': return 'html';
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'less': return 'less';
      case 'json': return 'json';
      case 'xml': return 'xml';
      case 'svg': return 'xml';
      case 'yaml': return 'yaml';
      case 'yml': return 'yaml';
      
      // Markdown and documentation
      case 'md': return 'markdown';
      case 'mdx': return 'markdown';
      case 'txt': return 'plaintext';
      
      // Programming languages
      case 'py': return 'python';
      case 'rb': return 'ruby';
      case 'php': return 'php';
      case 'go': return 'go';
      case 'rs': return 'rust';
      case 'java': return 'java';
      case 'c': return 'c';
      case 'h': return 'c';
      case 'cpp': return 'cpp';
      case 'hpp': return 'cpp';
      case 'cs': return 'csharp';
      case 'swift': return 'swift';
      case 'kt': return 'kotlin';
      case 'scala': return 'scala';
      
      // Shell and scripting
      case 'sh': return 'shell';
      case 'bash': return 'shell';
      case 'ps1': return 'powershell';
      case 'bat': return 'bat';
      case 'cmd': return 'bat';
      
      // Database
      case 'sql': return 'sql';
      
      // Configuration
      case 'ini': return 'ini';
      case 'toml': return 'toml';
      case 'dockerfile': return 'dockerfile';
      
      // Other
      case 'lua': return 'lua';
      case 'r': return 'r';
      case 'dart': return 'dart';
      case 'graphql': return 'graphql';
      case 'perl': return 'perl';
      case 'clj': return 'clojure';
      case 'ex': return 'elixir';
      case 'exs': return 'elixir';
      case 'fs': return 'fsharp';
      
      default: return 'plaintext';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Function to handle editor initialization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="container mx-auto p-4">
      <FileDialog onFileOpen={handleFileOpen} currentFile={currentFile} />
      <FileInfo currentFile={currentFile} isSaving={isSaving} />
      <div className="hidden md:block">
        <EditorToolbar 
          currentFile={currentFile}
          editorRef={editorRef}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          theme={editorTheme}
          setTheme={(theme) => {
            setEditorTheme(theme);
            setSystemTheme(theme);
          }}
          wordCount={wordCount}
          charCount={charCount}
          autoSave={autoSave}
          setAutoSave={setAutoSave}
        />
      </div>
      <EditorToolbarMobile 
        currentFile={currentFile}
        editorRef={editorRef}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        theme={editorTheme}
        setTheme={(theme) => {
          setEditorTheme(theme);
          setSystemTheme(theme);
        }}
        wordCount={wordCount}
        charCount={charCount}
        autoSave={autoSave}
        setAutoSave={setAutoSave}
      />
      <div className="grid grid-rows-1 gap-4 w-full h-[calc(100vh-16rem)]">
        <div className="w-full h-full relative">
          <MonacoEditor
            height="100%"
            className="w-full absolute inset-0"
            language={currentFile ? getLanguage(currentFile.name) : 'plaintext'}
            theme={editorTheme === 'dark' ? 'vs-dark' : 'vs-light'}
            value={fileContent}
            onChange={(value) => setFileContent(value ?? '')}
            onMount={handleEditorDidMount}
            options={{
              wordWrap: 'on',
              minimap: { enabled: true },
              fontSize: fontSize,
              fontFamily: fontFamily,
              automaticLayout: true,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              bracketPairColorization: { enabled: true },
              renderControlCharacters: false,
              renderWhitespace: 'none',
              renderLineHighlight: 'all',
              autoIndent: 'advanced',
              formatOnPaste: false,
              formatOnType: false,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoSurround: 'languageDefined',
              tabSize: 2,
              showFoldingControls: 'mouseover',
            }}
          />
        </div>
      </div>
    </div>
  );
}
