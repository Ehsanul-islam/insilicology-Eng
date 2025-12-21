import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value?: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  folder?: string;
}

export const ImageUploader = ({
  value,
  onChange,
  multiple = false,
  label = 'Image',
  folder,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadMultipleImages, validateImage, validateImages, uploadProgress } = useImageUpload();

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (multiple) {
      const validation = validateImages(files);
      if (!validation.valid) {
        validation.errors.forEach((error) => toast.error(error));
        return;
      }

      const urls = await uploadMultipleImages(files, 'portfolio-images', folder);
      if (urls.length > 0) {
        onChange([...images, ...urls]);
        toast.success(`Uploaded ${urls.length} image(s)`);
      }
    } else {
      const file = files[0];
      const validation = validateImage(file);
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file');
        return;
      }

      const url = await uploadImage(file, 'portfolio-images', folder);
      if (url) {
        onChange(url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput); // Validate URL
      if (multiple) {
        onChange([...images, urlInput]);
      } else {
        onChange(urlInput);
      }
      setUrlInput('');
      toast.success('Image URL added');
    } catch {
      toast.error('Invalid URL');
    }
  };

  const removeImage = (indexOrUrl: number | string) => {
    if (multiple) {
      const index = typeof indexOrUrl === 'number' ? indexOrUrl : images.indexOf(indexOrUrl);
      onChange(images.filter((_, i) => i !== index));
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url">
            <LinkIcon className="w-4 h-4 mr-2" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            } ${uploadProgress.status === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
              disabled={uploadProgress.status === 'uploading'}
            />
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="text-sm text-foreground">
                  Drag & drop {multiple ? 'images' : 'an image'} here, or
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress.status === 'uploading'}
                >
                  Browse files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports: JPEG, PNG, GIF, WebP (Max 5MB)
              </p>
            </div>
          </div>

          {uploadProgress.status === 'uploading' && (
            <div className="text-sm text-center text-muted-foreground">
              Uploading... {uploadProgress.progress}%
            </div>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
            />
            <Button type="button" onClick={handleUrlAdd}>
              Add
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

