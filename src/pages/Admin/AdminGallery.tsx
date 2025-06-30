// src/pages/Admin/AdminGallery.tsx
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Eye,
  Search,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useGalleryImages } from "@/hooks/useGallery";

const API_URL = import.meta.env.VITE_API_URL;

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  uploadDate: string;
}

interface GalleryFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  imageFile: File | null;
  imageUrl?: string;
  cloudinaryPublicId?: string;
}

const AdminGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tab, setTab] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedImageIdToDelete, setSelectedImageIdToDelete] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<GalleryFormData>({
    title: "",
    description: "",
    category: "general",
    imageFile: null,
  });

  const queryClient = useQueryClient();

  // Mock data - replace with your actual API call
  const {
    data: galleryImages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGalleryImages();

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.post(
        `${API_URL}/api/upload/image`,
        formData
      );
      return response.data as {
        imageUrl: string;
        publicId: string;
      };
    },
    onError: (error: unknown) => {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  // Create gallery item mutation
  const createGalleryItemMutation = useMutation({
    mutationFn: async (
      galleryItem: Omit<GalleryImage, "id" | "uploadDate">
    ) => {
      const response = await axios.post(`${API_URL}/api/gallery`, galleryItem);
      return response.data as GalleryImage;
    },
    onSuccess: () => {
      toast({
        title: "Image uploaded",
        description: "The image has been successfully added to the gallery.",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setShowUploadModal(false);
      resetFormData();
    },
    onError: (error: unknown) => {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add image to gallery",
        variant: "destructive",
      });
    },
  });

  // Delete gallery item mutation
  const deleteGalleryItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/api/gallery/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Image deleted",
        description:
          "The image has been successfully removed from the gallery.",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setDeleteDialogOpen(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Deletion failed",
        description:
          error instanceof Error ? error.message : "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let finalImageUrl = formData.imageUrl;
      let finalPublicId = formData.cloudinaryPublicId;

      // Upload new image if file is selected
      if (formData.imageFile) {
        const { imageUrl, publicId } = await uploadImageMutation.mutateAsync(
          formData.imageFile
        );
        finalImageUrl = imageUrl;
        finalPublicId = publicId;
      } else if (!finalImageUrl) {
        toast({
          title: "Image required",
          description: "Please select an image to upload",
          variant: "destructive",
        });
        return;
      }

      // Create the gallery item
      await createGalleryItemMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: finalImageUrl,
        cloudinaryPublicId: finalPublicId!,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files![0],
        cloudinaryPublicId: undefined, // Clear existing public ID when new file is selected
      }));
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      category: "general",
      imageFile: null,
    });
  };

  // Handle image deletion
  const handleDeleteImage = () => {
    if (selectedImageIdToDelete) {
      deleteGalleryItemMutation.mutate(selectedImageIdToDelete);
    }
  };

  // Memoize categories for performance
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(galleryImages.map((img) => img.category))
    );
    return ["all", ...uniqueCategories];
  }, [galleryImages]);

  // Add new category
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        category: newCategory.trim().toLowerCase(),
      }));
      setNewCategory("");
    }
  };

  // Filter images by search query and selected tab/category
  const filteredImages = useMemo(() => {
    let filtered = galleryImages.filter((image) => {
      const matchesSearch =
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    if (tab === "categories" && selectedCategory !== "all") {
      filtered = filtered.filter(
        (image) => image.category === selectedCategory
      );
    } else if (tab === "all" && selectedCategory !== "all") {
      filtered = filtered.filter(
        (image) => image.category === selectedCategory
      );
    }

    return filtered;
  }, [galleryImages, searchQuery, selectedCategory, tab]);

  const renderGalleryContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10 bg-white rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading gallery images...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-10 bg-white rounded-md text-red-500">
          <AlertTriangle size={40} className="mx-auto text-red-400 mb-4" />
          <p>Error: {error?.message || "Failed to load gallery images."}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    if (filteredImages.length === 0) {
      return (
        <div className="text-center py-10 bg-white rounded-md">
          <ImageIcon size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">
            No images found for the current filter.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image: GalleryImage) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSelectedImageIdToDelete(image.id);
                      setDeleteDialogOpen(true);
                    }}
                    disabled={deleteGalleryItemMutation.isPending}
                  >
                    {deleteGalleryItemMutation.isPending &&
                    selectedImageIdToDelete === image.id ? (
                      <Loader2 size={14} className="animate-spin mr-1" />
                    ) : (
                      <Trash2 size={14} />
                    )}
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
    );
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
          onClick={() => setShowUploadModal(true)}
          disabled={
            createGalleryItemMutation.isPending || uploadImageMutation.isPending
          }
        >
          {createGalleryItemMutation.isPending ||
          uploadImageMutation.isPending ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : (
            <Upload size={16} className="mr-2" />
          )}
          Upload Images
        </Button>
      </div>

      {/* Gallery content */}
      <Tabs
        defaultValue="all"
        className="mb-6"
        value={tab}
        onValueChange={setTab}
      >
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
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {renderGalleryContent()}
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.filter((cat) => cat !== "all").length > 0 ? (
                  categories
                    .filter((cat) => cat !== "all")
                    .map((category) => {
                      const representativeImage = galleryImages.find(
                        (img) => img.category === category
                      );
                      return (
                        <Card key={category} className="overflow-hidden">
                          <div className="relative h-32">
                            <img
                              src={
                                representativeImage?.imageUrl ||
                                "https://via.placeholder.com/150"
                              }
                              alt={category}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <h3 className="text-xl font-semibold text-white capitalize">
                                {category}
                              </h3>
                            </div>
                          </div>
                          <CardContent className="p-3 text-center">
                            <Button
                              variant="link"
                              className="text-divine w-full p-0"
                              onClick={() => {
                                setSelectedCategory(category);
                                setTab("all");
                              }}
                            >
                              View Images (
                              {galleryImages.filter(
                                (img) => img.category === category
                              ).length || 0}
                              )
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })
                ) : (
                  <div className="col-span-full text-center py-10">
                    <ImageIcon
                      size={40}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-gray-500">
                      No categories found. Upload some images!
                    </p>
                  </div>
                )}
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
                  <div className="text-gray-500">
                    Click "Upload Images" button above to use the guided
                    uploader.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Upload New Image</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetFormData();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {formData.imageFile ? (
                      <p className="text-sm text-divine-dark font-medium">
                        {formData.imageFile.name}
                      </p>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="imageFile"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="imageFile"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  placeholder="Enter image title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  placeholder="Enter image description"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter category"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategory(formData.category);
                      addCategory();
                    }}
                    className="px-3 py-2 bg-divine text-white rounded-md hover:bg-divine/90"
                  >
                    Set
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setFormData({ ...formData, category })}
                        className={`px-2 py-1 text-xs rounded-full ${
                          formData.category === category
                            ? "bg-divine text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetFormData();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createGalleryItemMutation.isPending ||
                    uploadImageMutation.isPending
                  }
                  className="btn-primary flex items-center gap-2"
                >
                  {createGalleryItemMutation.isPending ||
                  uploadImageMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : (
                    <Upload size={16} className="mr-2" />
                  )}
                  Upload Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              image from the gallery and Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteImage}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteGalleryItemMutation.isPending}
            >
              {deleteGalleryItemMutation.isPending ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Trash2 size={16} className="mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminGallery;
