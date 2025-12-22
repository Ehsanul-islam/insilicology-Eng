import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Heading2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export const MarkdownEditor = ({
  value,
  onChange,
  label = 'Description',
  placeholder = 'Write your content in Markdown...',
  minHeight = '300px',
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    
    let newText = '';
    let cursorOffset = 0;

    switch (syntax) {
      case 'bold':
        newText = `${value.substring(0, start)}**${selectedText}**${value.substring(end)}`;
        cursorOffset = start + 2;
        break;
      case 'italic':
        newText = `${value.substring(0, start)}*${selectedText}*${value.substring(end)}`;
        cursorOffset = start + 1;
        break;
      case 'heading':
        newText = `${value.substring(0, start)}## ${selectedText}${value.substring(end)}`;
        cursorOffset = start + 3;
        break;
      case 'link':
        newText = `${value.substring(0, start)}[${selectedText}](url)${value.substring(end)}`;
        cursorOffset = start + selectedText.length + 3;
        break;
      case 'code':
        newText = `${value.substring(0, start)}\`${selectedText}\`${value.substring(end)}`;
        cursorOffset = start + 1;
        break;
      case 'ul':
        newText = `${value.substring(0, start)}\n- ${selectedText}${value.substring(end)}`;
        cursorOffset = start + 3;
        break;
      case 'ol':
        newText = `${value.substring(0, start)}\n1. ${selectedText}${value.substring(end)}`;
        cursorOffset = start + 4;
        break;
      default:
        return;
    }

    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorOffset, cursorOffset);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
        <div className="flex items-center justify-between border-b border-border">
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger value="write" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === 'write' && (
            <div className="flex gap-1 p-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('bold', 'bold text')}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('italic', 'italic text')}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('heading', 'heading')}
                title="Heading"
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('link', 'link text')}
                title="Link"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('code', 'code')}
                title="Code"
              >
                <Code className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('ul', 'list item')}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertMarkdown('ol', 'list item')}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="font-mono resize-none"
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div
            className="border border-border rounded-md p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto"
            style={{ minHeight }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        Supports Markdown syntax. Use the toolbar or type directly.
      </p>
    </div>
  );
};

