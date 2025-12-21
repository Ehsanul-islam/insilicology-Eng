import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
  });

  /**
   * Upload a file to Supabase storage
   */
  const uploadImage = async (
    file: File,
    bucket: string = 'portfolio-images',
    folder?: string
  ): Promise<string | null> => {
    setUploadProgress({ progress: 0, status: 'uploading' });

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setUploadProgress({ progress: 100, status: 'success' });
      return publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setUploadProgress({ progress: 0, status: 'error', error: errorMessage });
      console.error('Error uploading image:', err);
      return null;
    }
  };

  /**
   * Upload multiple files
   */
  const uploadMultipleImages = async (
    files: File[],
    bucket: string = 'portfolio-images',
    folder?: string
  ): Promise<string[]> => {
    setUploadProgress({ progress: 0, status: 'uploading' });

    try {
      const uploadPromises = files.map((file) => uploadImage(file, bucket, folder));
      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results.filter((url): url is string => url !== null);
      
      if (successfulUploads.length === files.length) {
        setUploadProgress({ progress: 100, status: 'success' });
      } else {
        setUploadProgress({
          progress: 100,
          status: 'error',
          error: `Uploaded ${successfulUploads.length} of ${files.length} files`,
        });
      }
      
      return successfulUploads;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      setUploadProgress({ progress: 0, status: 'error', error: errorMessage });
      console.error('Error uploading multiple images:', err);
      return [];
    }
  };

  /**
   * Delete an image from storage
   */
  const deleteImage = async (
    filePath: string,
    bucket: string = 'portfolio-images'
  ): Promise<boolean> => {
    try {
      // Extract the path from URL if a full URL is provided
      let path = filePath;
      if (filePath.includes('supabase')) {
        const url = new URL(filePath);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf(bucket);
        if (bucketIndex !== -1) {
          path = pathParts.slice(bucketIndex + 1).join('/');
        }
      }

      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      return false;
    }
  };

  /**
   * Delete multiple images
   */
  const deleteMultipleImages = async (
    filePaths: string[],
    bucket: string = 'portfolio-images'
  ): Promise<boolean> => {
    try {
      const deletePromises = filePaths.map((path) => deleteImage(path, bucket));
      const results = await Promise.all(deletePromises);
      return results.every((result) => result === true);
    } catch (err) {
      console.error('Error deleting multiple images:', err);
      return false;
    }
  };

  /**
   * Validate image file
   */
  const validateImage = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.',
      };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 5MB limit.',
      };
    }

    return { valid: true };
  };

  /**
   * Validate multiple images
   */
  const validateImages = (files: File[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    files.forEach((file, index) => {
      const validation = validateImage(file);
      if (!validation.valid && validation.error) {
        errors.push(`File ${index + 1}: ${validation.error}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  /**
   * Reset upload progress
   */
  const resetProgress = () => {
    setUploadProgress({ progress: 0, status: 'idle' });
  };

  return {
    uploadProgress,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    deleteMultipleImages,
    validateImage,
    validateImages,
    resetProgress,
  };
};

