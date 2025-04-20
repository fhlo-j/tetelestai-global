
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Pencil, 
  Trash2, 
  Plus, 
  Calendar, 
  Upload,
  Bell,
  Search,
  X,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { announcements as initialAnnouncements, Announcement } from '../../components/AnnouncementModal';

const AdminAnnouncements = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  
  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Open dialog for creating a new announcement
  const handleAddNew = () => {
    setCurrentAnnouncement(null);
    setTitle('');
    setContent('');
    setImageUrl('');
    setIsImportant(false);
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing an existing announcement
  const handleEdit = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setImageUrl(announcement.imageUrl || '');
    setIsImportant(announcement.isImportant);
    setIsDialogOpen(true);
  };
  
  // Open dialog for confirming deletion
  const handleDeleteConfirm = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };
  
  // Delete an announcement
  const handleDelete = () => {
    if (!currentAnnouncement) return;
    
    setAnnouncements(announcements.filter(a => a.id !== currentAnnouncement.id));
    toast({
      title: "Announcement deleted",
      description: "The announcement has been successfully deleted.",
    });
    
    setIsDeleteDialogOpen(false);
  };
  
  // Save an announcement (create new or update existing)
  const handleSave = () => {
    if (!title || !content) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (currentAnnouncement) {
      // Update existing announcement
      setAnnouncements(announcements.map(a => 
        a.id === currentAnnouncement.id 
          ? { ...a, title, content, imageUrl: imageUrl || a.imageUrl, isImportant } 
          : a
      ));
      toast({
        title: "Announcement updated",
        description: "Your changes have been saved successfully.",
      });
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title,
        content,
        date: today,
        imageUrl: imageUrl || undefined,
        isImportant
      };
      
      setAnnouncements([newAnnouncement, ...announcements]);
      toast({
        title: "Announcement created",
        description: "The new announcement has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Announcements</h1>
          <p className="text-gray-500">Manage your church announcements</p>
        </div>
        
        <Button onClick={handleAddNew} className="bg-divine hover:bg-divine/90">
          <Plus size={16} className="mr-2" />
          New Announcement
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map(announcement => (
            <Card key={announcement.id} className="overflow-hidden">
              <div className="md:flex">
                {announcement.imageUrl && (
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardContent className={`p-5 ${announcement.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        {announcement.isImportant && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                            Important
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Calendar size={14} />
                        <span>{announcement.date}</span>
                      </div>
                      <p className="text-gray-700 line-clamp-2">{announcement.content}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(announcement)}
                        className="flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteConfirm(announcement)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-md border">
            <Bell size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No announcements found</p>
            {searchQuery && (
              <Button 
                variant="link" 
                onClick={() => setSearchQuery('')}
                className="text-divine mt-1"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Create/Edit Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Announcement content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">Leave blank for no image</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="important"
                checked={isImportant}
                onCheckedChange={setIsImportant}
              />
              <Label htmlFor="important">Mark as important</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-divine hover:bg-divine/90">
              {currentAnnouncement ? 'Save Changes' : 'Create Announcement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete this announcement?</p>
            <p className="font-medium mt-2">"{currentAnnouncement?.title}"</p>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnnouncements;
