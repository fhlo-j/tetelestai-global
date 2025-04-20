
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bold, Italic, List, Text } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface BlogPostEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (post: {
    title: string;
    content: string;
    imageUrl: string;
  }) => void;
}

const BlogPostEditor = ({ open, onOpenChange, onSave }: BlogPostEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleFormat = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = content;
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'list':
        newText = content.substring(0, start) + `\n- ${selectedText}` + content.substring(end);
        newCursorPos = end + 3;
        break;
    }

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = () => {
    onSave({
      title,
      content,
      imageUrl
    });
    setTitle('');
    setContent('');
    setImageUrl('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image</label>
            <ImageUploader
              onImageSelected={(file, previewUrl) => setImageUrl(previewUrl)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Content</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFormat('bold')}
                >
                  <Bold size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFormat('italic')}
                >
                  <Italic size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFormat('list')}
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Write your blog post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-divine hover:bg-divine/90">
              Publish Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditor;
