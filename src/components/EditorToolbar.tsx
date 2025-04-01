"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Replace,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Save,
  FileDown,
  Sun,
  Moon,
  Type,
  Hash,
  Settings,
} from "lucide-react";
import { FileData } from "@/lib/fileSystem";

interface EditorToolbarProps {
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

export function EditorToolbar({
  currentFile,
  editorRef,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  theme,
  setTheme,
  wordCount,
  charCount,
  autoSave,
  setAutoSave,
}: Readonly<EditorToolbarProps>) {
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [encoding, setEncoding] = useState('utf-8');
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [tabSize, setTabSize] = useState(2);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30); // seconds
  const [showInvisibles, setShowInvisibles] = useState(false);
  const [highlightActiveLine, setHighlightActiveLine] = useState(true);
  const [bracketPairColorization, setBracketPairColorization] = useState(true);
  const [autoIndent, setAutoIndent] = useState(true);
  const [smoothScrolling, setSmoothScrolling] = useState(true);
  const [cursorStyle, setCursorStyle] = useState('line');
  const [cursorBlinking, setCursorBlinking] = useState('blink');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [renderWhitespace, setRenderWhitespace] = useState('none');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showFoldingControls, setShowFoldingControls] = useState('mouseover');
  const [autoClosingBrackets, setAutoClosingBrackets] = useState(true);
  const [autoClosingQuotes, setAutoClosingQuotes] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [autoSurround, setAutoSurround] = useState(true);
  const [formatOnPaste, setFormatOnPaste] = useState(false);
  const [formatOnType, setFormatOnType] = useState(false);

  // Handle undo/redo
  const handleUndo = () => {
    editorRef.current?.trigger('keyboard', 'undo', null);
  };

  const handleRedo = () => {
    editorRef.current?.trigger('keyboard', 'redo', null);
  };

  // Handle search and replace
  const handleSearch = () => {
    if (editorRef.current && searchText) {
      const editor = editorRef.current;
      editor.getAction('actions.find').run();
      // Set the search value in the find widget
      setTimeout(() => {
        const findInput = document.querySelector('.monaco-editor .find-widget .input') as HTMLInputElement;
        if (findInput) {
          findInput.value = searchText;
          findInput.dispatchEvent(new Event('input'));
        }
      }, 100);
    }
  };

  const handleReplace = () => {
    if (editorRef.current && searchText) {
      const editor = editorRef.current;
      editor.getAction('actions.findWithSelection').run();
      // Open replace widget
      setTimeout(() => {
        const findInput = document.querySelector('.monaco-editor .find-widget .input') as HTMLInputElement;
        const replaceInput = document.querySelector('.monaco-editor .find-widget .replace-input') as HTMLInputElement;
        if (findInput && replaceInput) {
          findInput.value = searchText;
          findInput.dispatchEvent(new Event('input'));
          replaceInput.value = replaceText;
          replaceInput.dispatchEvent(new Event('input'));
        }
      }, 100);
    }
  };

  // Handle line numbers toggle
  const toggleLineNumbers = () => {
    if (editorRef.current) {
      const newValue = !showLineNumbers;
      setShowLineNumbers(newValue);
      editorRef.current.updateOptions({ lineNumbers: newValue ? 'on' : 'off' });
    }
  };

  // Handle word wrap toggle
  const toggleWordWrap = () => {
    if (editorRef.current) {
      const newValue = !wordWrap;
      setWordWrap(newValue);
      editorRef.current.updateOptions({ wordWrap: newValue ? 'on' : 'off' });
    }
  };

  // Handle minimap toggle
  const toggleMinimap = () => {
    if (editorRef.current) {
      const newValue = !minimap;
      setMinimap(newValue);
      editorRef.current.updateOptions({ minimap: { enabled: newValue } });
    }
  };

  // Update editor options
  const updateEditorOptions = useCallback((options: unknown) => {
    if (editorRef.current) {
      editorRef.current.updateOptions(options);
    }
  }, [editorRef]);

  // Apply editor settings
  useEffect(() => {
    if (editorRef.current) {
      updateEditorOptions({
        renderWhitespace,
        showFoldingControls,
        autoClosingBrackets,
        autoClosingQuotes,
        autoSurround,
        formatOnPaste,
        formatOnType,
        tabSize,
        indentSize: tabSize,
        cursorStyle,
        cursorBlinking,
        smoothScrolling,
        bracketPairColorization: { enabled: bracketPairColorization },
        renderControlCharacters: showInvisibles,
        renderLineHighlight: highlightActiveLine ? 'all' : 'none',
        autoIndent: autoIndent ? 'advanced' : 'none',
      });
    }
  }, [renderWhitespace, showFoldingControls, autoClosingBrackets, autoClosingQuotes, autoSurround, formatOnPaste, formatOnType, tabSize, cursorStyle, cursorBlinking, smoothScrolling, bracketPairColorization, showInvisibles, highlightActiveLine, autoIndent, editorRef, updateEditorOptions]);

  // Handle zoom in/out
  const zoomIn = () => {
    if (fontSize < 32) {
      setFontSize(fontSize + 1);
    }
  };

  const zoomOut = () => {
    if (fontSize > 8) {
      setFontSize(fontSize - 1);
    }
  };

  // Handle save as different formats
  const handleSaveAs = (format: string) => {
    if (!currentFile) return;

    let content = currentFile.content;
    const fileName = currentFile.name;
    const fileExtension = fileName.split('.').pop() || '';
    const newFileName = fileName.replace(`.${fileExtension}`, `.${format}`);

    // Convert content based on format
    if (format === 'json' && fileExtension !== 'json') {
      try {
        // Simple text to JSON conversion
        content = JSON.stringify({ content: content }, null, 2);
      } catch (error) {
        console.error('Error converting to JSON:', error);
        alert('Could not convert to JSON format');
        return;
      }
    } else if (format === 'csv' && fileExtension !== 'csv') {
      // Simple text to CSV conversion (just adds quotes)
      content = content.split('\n').map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
    } else if (format === 'pdf') {
      alert('PDF export is not supported in this version');
      return;
    }

    // Create a blob and download
    const blob = new Blob([content], { type: `text/${format === 'pdf' ? 'pdf' : 'plain'}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-row flex-wrap items-center gap-2 mb-4 p-2 bg-muted rounded-md">
      {/* Search and Replace */}
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="md:flex md:items-center">
                  <Search className="mr-1" size={16} />
                  <span>Search</span>
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Search and Replace</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium leading-none">Search & Replace</h4>
                <Badge variant="outline" className="ml-2">
                  {wordCount} words, {charCount} chars
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Find and replace text in your document.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="search" className="text-right">
                  Find
                </Label>
                <Input
                  id="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="col-span-3"
                  placeholder="Text to find..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="replace" className="text-right">
                  Replace
                </Label>
                <Input
                  id="replace"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="col-span-3"
                  placeholder="Replace with..."
                />
              </div>
              <div className="flex justify-between mt-2">
                <Button size="sm" onClick={handleSearch}>
                  <Search className="mr-1" size={14} /> Find
                </Button>
                <Button size="sm" onClick={handleReplace}>
                  <Replace className="mr-1" size={14} /> Replace
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Line Numbers Toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <Label htmlFor="line-numbers" className="text-sm cursor-pointer items-center">
                <Hash className="inline-block mr-1" size={16} /> <span>Line Numbers</span>
              </Label>
              <Switch
                id="line-numbers"
                checked={showLineNumbers}
                onCheckedChange={toggleLineNumbers}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Toggle Line Numbers</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Word and Character Count */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-sm text-muted-foreground bg-muted-foreground/10 px-2 py-1 rounded-md">
              <Badge variant="outline" className="mr-1">{wordCount}</Badge> words
              <Badge variant="outline" className="mx-1">{charCount}</Badge> chars
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Document Statistics</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleUndo}>
                <Undo2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleRedo}>
                <Redo2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Zoom Controls */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut size={16} />
              </Button>
              <span className="text-sm font-mono bg-muted-foreground/10 px-2 py-1 rounded-md">{fontSize}px</span>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn size={16} />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Adjust Text Size</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Font Family */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <Type className="mr-1" size={14} />
                  <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monospace">Monospace</SelectItem>
                  <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                  <SelectItem value="'Consolas', monospace">Consolas</SelectItem>
                  <SelectItem value="'Roboto Mono', monospace">Roboto Mono</SelectItem>
                  <SelectItem value="'Fira Code', monospace">Fira Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Change Font Family</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="md:hidden">
              <Button variant="outline" size="sm">
                <Type size={16} />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Font Options (Use desktop view)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}

      {/* Encoding */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select value={encoding} onValueChange={setEncoding}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Encoding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utf-8">UTF-8</SelectItem>
                  <SelectItem value="ascii">ASCII</SelectItem>
                  <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Change Text Encoding</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="mr-1" size={16} />
            Light
          </>
        ) : (
          <>
            <Moon className="mr-1" size={16} />
            Dark
          </>
        )}
      </Button>

      {/* Auto Save Toggle */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="auto-save" className="text-sm cursor-pointer">
          <Save className="inline-block mr-1" size={16} /> Auto Save
        </Label>
        <Switch
          id="auto-save"
          checked={autoSave}
          onCheckedChange={setAutoSave}
        />
      </div>

      {/* Save As Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <FileDown className="mr-1" size={16} />
            Save As
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSaveAs('txt')}>
            Text (.txt)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveAs('json')}>
            JSON (.json)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveAs('csv')}>
            CSV (.csv)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveAs('pdf')}>
            PDF (.pdf)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveAs('html')}>
            HTML (.html)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveAs('md')}>
            Markdown (.md)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Editor Settings */}
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-1" size={16} />
                  <span >Settings</span>
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Editor Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-96">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Editor Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Customize your editor experience.
                </p>
              </div>
              
              <Separator />
              
              <Collapsible className="w-full" defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="text-sm font-medium">Display</h4>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="word-wrap" className="text-sm cursor-pointer">
                        Word Wrap
                      </Label>
                      <Switch
                        id="word-wrap"
                        checked={wordWrap}
                        onCheckedChange={toggleWordWrap}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="minimap" className="text-sm cursor-pointer">
                        Minimap
                      </Label>
                      <Switch
                        id="minimap"
                        checked={minimap}
                        onCheckedChange={toggleMinimap}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-invisibles" className="text-sm cursor-pointer">
                        Show Invisible Characters
                      </Label>
                      <Switch
                        id="show-invisibles"
                        checked={showInvisibles}
                        onCheckedChange={(value) => {
                          setShowInvisibles(value);
                          updateEditorOptions({ renderControlCharacters: value });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="highlight-line" className="text-sm cursor-pointer">
                        Highlight Active Line
                      </Label>
                      <Switch
                        id="highlight-line"
                        checked={highlightActiveLine}
                        onCheckedChange={(value) => {
                          setHighlightActiveLine(value);
                          updateEditorOptions({ renderLineHighlight: value ? 'all' : 'none' });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bracket-colorization" className="text-sm cursor-pointer">
                        Bracket Pair Colorization
                      </Label>
                      <Switch
                        id="bracket-colorization"
                        checked={bracketPairColorization}
                        onCheckedChange={(value) => {
                          setBracketPairColorization(value);
                          updateEditorOptions({ bracketPairColorization: { enabled: value } });
                        }}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Separator />
              
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="text-sm font-medium">Editing</h4>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-indent" className="text-sm cursor-pointer">
                        Auto Indent
                      </Label>
                      <Switch
                        id="auto-indent"
                        checked={autoIndent}
                        onCheckedChange={(value) => {
                          setAutoIndent(value);
                          updateEditorOptions({ autoIndent: value ? 'advanced' : 'none' });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-brackets" className="text-sm cursor-pointer">
                        Auto Close Brackets
                      </Label>
                      <Switch
                        id="auto-brackets"
                        checked={autoClosingBrackets}
                        onCheckedChange={(value) => {
                          setAutoClosingBrackets(value);
                          updateEditorOptions({ autoClosingBrackets: value ? 'always' : 'never' });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-quotes" className="text-sm cursor-pointer">
                        Auto Close Quotes
                      </Label>
                      <Switch
                        id="auto-quotes"
                        checked={autoClosingQuotes}
                        onCheckedChange={(value) => {
                          setAutoClosingQuotes(value);
                          updateEditorOptions({ autoClosingQuotes: value ? 'always' : 'never' });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="format-paste" className="text-sm cursor-pointer">
                        Format On Paste
                      </Label>
                      <Switch
                        id="format-paste"
                        checked={formatOnPaste}
                        onCheckedChange={(value) => {
                          setFormatOnPaste(value);
                          updateEditorOptions({ formatOnPaste: value });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="format-type" className="text-sm cursor-pointer">
                        Format On Type
                      </Label>
                      <Switch
                        id="format-type"
                        checked={formatOnType}
                        onCheckedChange={(value) => {
                          setFormatOnType(value);
                          updateEditorOptions({ formatOnType: value });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2 mt-2">
                      <Label htmlFor="tab-size" className="text-sm">
                        Tab Size
                      </Label>
                      <Select value={tabSize.toString()} onValueChange={(value) => {
                        const size = parseInt(value);
                        setTabSize(size);
                        updateEditorOptions({ tabSize: size });
                      }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Tab Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 spaces</SelectItem>
                          <SelectItem value="4">4 spaces</SelectItem>
                          <SelectItem value="8">8 spaces</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Separator />
              
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="text-sm font-medium">Cursor</h4>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="cursor-style" className="text-sm">
                        Cursor Style
                      </Label>
                      <Select value={cursorStyle} onValueChange={(value) => {
                        setCursorStyle(value);
                        updateEditorOptions({ cursorStyle: value });
                      }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Cursor Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Line</SelectItem>
                          <SelectItem value="block">Block</SelectItem>
                          <SelectItem value="underline">Underline</SelectItem>
                          <SelectItem value="line-thin">Thin Line</SelectItem>
                          <SelectItem value="block-outline">Block Outline</SelectItem>
                          <SelectItem value="underline-thin">Thin Underline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2 mt-2">
                      <Label htmlFor="cursor-blinking" className="text-sm">
                        Cursor Blinking
                      </Label>
                      <Select value={cursorBlinking} onValueChange={(value) => {
                        setCursorBlinking(value);
                        updateEditorOptions({ cursorBlinking: value });
                      }}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Cursor Blinking" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blink">Blink</SelectItem>
                          <SelectItem value="smooth">Smooth</SelectItem>
                          <SelectItem value="phase">Phase</SelectItem>
                          <SelectItem value="expand">Expand</SelectItem>
                          <SelectItem value="solid">Solid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Label htmlFor="smooth-scrolling" className="text-sm cursor-pointer">
                        Smooth Scrolling
                      </Label>
                      <Switch
                        id="smooth-scrolling"
                        checked={smoothScrolling}
                        onCheckedChange={(value) => {
                          setSmoothScrolling(value);
                          updateEditorOptions({ smoothScrolling: value });
                        }}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Separator />
              
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="text-sm font-medium">Auto Save</h4>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-save-toggle" className="text-sm cursor-pointer">
                        Enable Auto Save
                      </Label>
                      <Switch
                        id="auto-save-toggle"
                        checked={autoSave}
                        onCheckedChange={setAutoSave}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2 mt-2">
                      <Label htmlFor="auto-save-interval" className="text-sm">
                        Interval (seconds)
                      </Label>
                      <div className="col-span-3 flex items-center gap-2">
                        <Slider
                          id="auto-save-interval"
                          disabled={!autoSave}
                          value={[autoSaveInterval]}
                          min={5}
                          max={60}
                          step={5}
                          onValueChange={(value) => setAutoSaveInterval(value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-center">{autoSaveInterval}s</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
