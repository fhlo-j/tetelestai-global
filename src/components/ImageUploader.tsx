// src/components/ImageUploader.tsx
import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelected: (
    file: File
  ) => Promise<{ imageUrl: string; publicId: string }>;
  onRemoveImage?: (publicId: string) => Promise<void>; // Marked as async
  initialImageUrl?: string;
  initialPublicId?: string;
  className?: string;
  isUploading?: boolean;
}

const ImageUploader = ({
  onImageSelected,
  onRemoveImage,
  initialImageUrl,
  initialPublicId,
  className = "",
  isUploading = false,
}: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl || null
  );
  const [currentPublicId, setCurrentPublicId] = useState<string | undefined>(
    initialPublicId
  );
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle initial image changes
  useEffect(() => {
    setPreviewUrl(initialImageUrl || null);
    setCurrentPublicId(initialPublicId);
  }, [initialImageUrl, initialPublicId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const result = await onImageSelected(file);
      setCurrentPublicId(result.publicId);
    } catch (error) {
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Error handling should be done in parent component
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const result = await onImageSelected(file);
      setCurrentPublicId(result.publicId);
    } catch (error) {
      setPreviewUrl(null);
      // Error handling should be done in parent component
    }
  };

  const clearImage = async () => {
    if (onRemoveImage && currentPublicId) {
      await onRemoveImage(currentPublicId);
    }
    setPreviewUrl(null);
    setCurrentPublicId(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={className}>
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging ? "bg-divine/5 border-divine" : "bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <Loader2 size={40} className="animate-spin text-gray-300 mb-4" />
            ) : (
              <Upload size={40} className="text-gray-300 mb-4" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">JPG, PNG or GIF (Max. 5MB)</p>
            <Button
              className="mt-4 bg-divine hover:bg-divine/90"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Upload size={16} className="mr-2" />
              )}
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
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
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <X size={16} />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
