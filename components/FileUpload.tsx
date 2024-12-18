import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { LoadingBar } from './LoadingBar';

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const supportedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/aac', 'audio/x-m4a'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!supportedTypes.includes(file.type)) {
      setError('Unsupported file type. Please use MP3, WAV, or AAC files.');
      return false;
    }

    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 50MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      if (validateFile(file)) {
        setIsLoading(true);
        setLoadingProgress(0);

        // Start progress animation
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            const next = prev + (100 - prev) * 0.1;
            return next > 99 ? 99 : next;
          });
        }, 200);

        await onFileSelect(file);
        setLoadingProgress(100);

        // Clean up
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsLoading(false);
          setLoadingProgress(0);
        }, 500);
      }
    } catch (error) {
      console.error('Error loading file:', error);
      setError('Error loading file. Please try again.');
      setIsLoading(false);
    } finally {
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setError(null);
    if (validateFile(file)) {
      try {
        setIsLoading(true);
        await onFileSelect(file);
      } catch (error) {
        console.error('Error loading file:', error);
        setError('Error loading file. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-500 transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/mp3,audio/wav,audio/aac,audio/mpeg,audio/x-m4a"
          className="hidden"
          capture={false} // Disable direct camera/mic capture
        />
        <Upload className="mx-auto mb-2 text-zinc-400" size={24} />
        <p className="text-zinc-400">Drop file here or tap to browse</p>
        <p className="text-xs text-zinc-500 mt-1">Supports MP3, WAV, AAC (max 50MB)</p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <LoadingBar progress={loadingProgress} isIndeterminate={loadingProgress < 20} />
          <p className="text-xs text-center text-zinc-500">
            Loading audio file... {Math.round(loadingProgress)}%
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};