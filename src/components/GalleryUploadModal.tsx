// src/components/GalleryUploadModal.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";
import { toast } from "@/hooks/use-toast";

interface GalleryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // onSave now expects the File object directly
  onSave: (galleryItem: {
    title: string;
    description: string;
    category: string;
    imageFile: File; // Pass the File object
  }) => void;
}

const GalleryUploadModal = ({
  open,
  onOpenChange,
  onSave,
}: GalleryUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // Store the File object
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Store local preview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetImageUploader, setResetImageUploader] = useState(false);

  // Reset form fields when the modal opens/closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setCategory("");
      setSelectedImageFile(null); // Clear selected file
      setImagePreviewUrl(null); // Clear preview
      setIsSubmitting(false);
      setResetImageUploader(true); // Trigger ImageUploader reset
    } else {
      setResetImageUploader(false); // Untrigger reset when opening
    }
  }, [open]);

  // This handler receives the selected File and its local preview URL
  const handleImageSelected = (file: File | null, preview: string | null) => {
    setSelectedImageFile(file);
    setImagePreviewUrl(preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if a file is selected
    if (!title || !description || !category || !selectedImageFile) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields and select an image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Pass the File object to onSave
    onSave({
      title,
      description,
      category: category.toLowerCase(),
      imageFile: selectedImageFile, // Pass the File object
    });

    // AdminGallery's onSuccess/onError will handle closing the modal and resetting state
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Image</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter image description"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Nature, Events, Portraits"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label>Image</Label>
            <ImageUploader
              onImageSelected={handleImageSelected}
              resetTrigger={resetImageUploader}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-divine hover:bg-divine/90"
              disabled={isSubmitting || !selectedImageFile} // Disable if no file selected
            >
              {isSubmitting ? "Uploading..." : "Upload Image"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryUploadModal;
