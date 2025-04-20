import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pencil, Trash2, Eye, Search, Upload, 
  Image as ImageIcon, AlertTriangle 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import GalleryUploadModal from "@/components/GalleryUploadModal";
import ImageUploader from "@/components/ImageUploader";

// Sample gallery data
const initialGalleryImages = [
  {
    id: '1',
    title: 'Annual Conference 2024',
    description: 'Highlights from our annual conference with believers from around the world.',
    imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
    category: 'events',
    uploadDate: 'June 10, 2024'
  },
  {
    id: '2',
    title: 'Youth Retreat',
    description: 'Our young adults connecting with God and each other in nature.',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    category: 'youth',
    uploadDate: 'June 3, 2024'
  },
  {
    id: '3',
    title: 'Community Outreach',
    description: 'Serving our local community through various outreach programs.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    category: 'outreach',
    uploadDate: 'May 28, 2024'
  },
  {
    id: '4',
    title: 'Worship Experience',
    description: 'Powerful moments of praise and worship during our Sunday service.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    category: 'worship',
    uploadDate: 'May 22, 2024'
  },
  {
    id: '5',
    title: "Children\"s Ministry",
    description: 'Our dedicated team nurturing the next generation in faith.',
    imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
    category: 'children',
    uploadDate: 'May 15, 2024'
  },
  {
    id: '6',
    title: 'Prayer Conference',
    description: 'Gathering together in prayer and intercession for the nations.',
    imageUrl: 'https://images.unsplash.com/photo-1551038247-3d9af20df552',
    category: 'prayer',
    uploadDate: 'May 10, 2024'
  }
];

const AdminGallery = () => {
  const [galleryImages, setGalleryImages] = useState(initialGalleryImages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tab, setTab] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(galleryImages.map(img => img.category)))];
  
  // Filter images by search query and category
  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = 
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSaveImage = (galleryItem: {
    title: string;
    description: string;
    category: string;
    imageUrl: string;
  }) => {
    // Generate a unique ID
    const newId = String(Date.now());
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Add new gallery item
    setGalleryImages([
      ...galleryImages,
      {
        id: newId,
        title: galleryItem.title,
        description: galleryItem.description,
        imageUrl: galleryItem.imageUrl,
        category: galleryItem.category,
        uploadDate: formattedDate
      }
    ]);
    
    toast({
      title: "Image uploaded",
      description: "The image has been successfully uploaded.",
    });
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      setGalleryImages(galleryImages.filter(image => image.id !== selectedImage));
      setDeleteDialogOpen(false);
      setSelectedImage(null);
      
      toast({
        title: "Image deleted",
        description: "The image has been successfully deleted.",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedImage(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Media Gallery</h1>
          <p className="text-gray-500">Manage your media assets</p>
        </div>
        
        <Button 
          className="bg-divine hover:bg-divine/90"
          onClick={() => setUploadModalOpen(true)}
        >
          <Upload size={16} className="mr-2" />
          Upload Images
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-6" value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map(image => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="flex items-center gap-1">
                          <Eye size={14} />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex items-center gap-1"
                          onClick={() => confirmDelete(image.id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{image.title}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-divine capitalize">{image.category}</span>
                      <span className="text-gray-500">{image.uploadDate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-md">
              <ImageIcon size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No images found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.filter(cat => cat !== 'all').map((category, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-32">
                      <img
                        src={galleryImages.find(img => img.category === category)?.imageUrl || ''}
                        alt={category}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <h3 className="text-xl font-semibold text-white capitalize">{category}</h3>
                      </div>
                    </div>
                    <CardContent className="p-3 text-center">
                      <Button variant="link" className="text-divine w-full p-0" onClick={() => {
                        setSelectedCategory(category);
                        setTab('all');
                      }}>
                        View Images
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-3">Upload New Media</h2>
                  <ImageUploader 
                    onImageSelected={(file, previewUrl) => {
                      console.log("File selected:", file.name);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Gallery Upload Modal */}
      <GalleryUploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
        categories={categories.filter(cat => cat !== 'all')}
        onSave={handleSaveImage}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteImage}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminGallery;
