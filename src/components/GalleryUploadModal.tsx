
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import { toast } from "@/hooks/use-toast";

interface GalleryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onSave: (galleryItem: {
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    file?: File;
  }) => void;
}

const GalleryUploadModal = ({ open, onOpenChange, categories, onSave }: GalleryUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelected = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !imagePreview) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields and upload an image",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, you'd upload the image to a server and get a URL back
    // For this demo, we'll use the preview URL
    onSave({
      title,
      description,
      category,
      imageUrl: imagePreview,
      file: imageFile || undefined
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory(categories[0] || "");
    setImageFile(null);
    setImagePreview("");
    setIsSubmitting(false);
    onOpenChange(false);
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
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.filter(cat => cat !== 'all').map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Image</Label>
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-divine hover:bg-divine/90"
              disabled={isSubmitting}
            >
              Upload Image
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryUploadModal;
