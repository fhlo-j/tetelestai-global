
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  className?: string;
}

const ImageUploader = ({ onImageSelected, className = '' }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageSelected(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageSelected(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${isDragging ? 'bg-divine/5 border-divine' : 'bg-gray-50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload size={40} className="text-gray-300 mb-4" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG or GIF (Max. 5MB)
            </p>
            <Button 
              className="mt-4 bg-divine hover:bg-divine/90"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} className="mr-2" />
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <Button 
            size="icon" 
            variant="destructive" 
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
