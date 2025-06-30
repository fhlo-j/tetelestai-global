// src/pages/Admin/AdminAnnouncements.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Pencil,
  Trash2,
  Plus,
  Calendar,
  Bell,
  Search,
  X,
  Check,
  Loader2,
  UploadCloud, // Added UploadCloud icon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query"; // Import useMutation for image upload

// --- IMPORTANT: Import your new API and hook files ---
// Assuming Announcement and AnnouncementPayload types are updated to include cloudinaryPublicId
import { Announcement, AnnouncementPayload } from "@/services/apiAnnouncement";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "@/hooks/useAnnouncements";

// Define your API URL (assuming it's similar to your events component)
const API_URL = import.meta.env.VITE_API_URL;

const AdminAnnouncements = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<Announcement | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // New state for file upload
  const [imageUrl, setImageUrl] = useState(""); // Still needed to display existing image previews
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<
    string | undefined
  >(undefined); // New state for public ID
  const [isImportant, setIsImportant] = useState(false);

  // --- React Query Hooks ---
  const {
    data: announcements,
    isLoading,
    isError,
    error,
    refetch,
  } = useAnnouncements(searchQuery);

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  // Mutation for image upload to Cloudinary (reused logic from AdminEventsList)
  const uploadImageMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("image", fileToUpload);

      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Image upload failed");
      }

      return response.json() as Promise<{
        imageUrl: string;
        publicId: string;
      }>;
    },
    onError: (err) => {
      toast({
        title: "Image Upload Error",
        description: err.message || "Failed to upload image.",
        variant: "destructive",
      });
    },
  });

  // Reset form fields when dialog opens/closes or currentAnnouncement changes
  useEffect(() => {
    if (!isDialogOpen) {
      setCurrentAnnouncement(null);
      setTitle("");
      setContent("");
      setImageFile(null); // Reset image file
      setImageUrl(""); // Reset image URL preview
      setCloudinaryPublicId(undefined); // Reset public ID
      setIsImportant(false);
    } else if (currentAnnouncement) {
      setTitle(currentAnnouncement.title);
      setContent(currentAnnouncement.content);
      setImageUrl(currentAnnouncement.imageUrl || "");
      setCloudinaryPublicId(currentAnnouncement.cloudinaryPublicId); // Set public ID from existing
      setIsImportant(currentAnnouncement.isImportant);
      setImageFile(null); // Ensure no file is pre-selected in the input when editing
    }
  }, [isDialogOpen, currentAnnouncement]);

  // Open dialog for creating a new announcement
  const handleAddNew = () => {
    setCurrentAnnouncement(null); // Ensure no old announcement is loaded
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing announcement
  const handleEdit = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
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

    deleteMutation.mutate(currentAnnouncement.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        // toast is handled by the hook
      },
      // onError is handled by the hook
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      // Clear current imageUrl and publicId when a new file is selected
      setImageUrl("");
      setCloudinaryPublicId(undefined);
    } else {
      setImageFile(null);
    }
  };

  // Save an announcement (create new or update existing)
  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields (Title and Content).",
        variant: "destructive",
      });
      return;
    }

    let finalImageUrl = imageUrl;
    let finalPublicId = cloudinaryPublicId;

    // Only upload if a new file is selected OR if it's a new announcement and no image URL is present
    if (imageFile) {
      try {
        const { imageUrl: uploadedImageUrl, publicId: uploadedPublicId } =
          await uploadImageMutation.mutateAsync(imageFile);
        finalImageUrl = uploadedImageUrl;
        finalPublicId = uploadedPublicId;
      } catch (err) {
        // Error toast is handled by the uploadImageMutation's onError
        return; // Stop the save process if image upload fails
      }
    } else if (!currentAnnouncement && !finalImageUrl) {
      // If creating a new announcement and no image file is provided and no existing imageUrl
      toast({
        title: "Validation error",
        description: "Please upload an image for the announcement.",
        variant: "destructive",
      });
      return;
    }

    const payload: AnnouncementPayload = {
      title,
      content,
      imageUrl: finalImageUrl || undefined, // Send undefined if empty string
      cloudinaryPublicId: finalPublicId || undefined, // Send undefined if empty
      isImportant,
    };

    if (currentAnnouncement) {
      // Update existing announcement
      updateMutation.mutate(
        { id: currentAnnouncement.id, payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            // toast is handled by the hook
          },
          // onError is handled by the hook
        }
      );
    } else {
      // Create new announcement
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false);
          // toast is handled by the hook
        },
        // onError is handled by the hook
      });
    }
  };

  // --- Render Functions ---

  const renderAnnouncementsList = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading announcements...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-10 text-red-500">
          <p>
            Error:{" "}
            {error?.message ||
              "Failed to load announcements. Please try again."}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    const displayedAnnouncements = announcements || []; // Ensure it's an array

    if (displayedAnnouncements.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-md border">
          <Bell size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No announcements found</p>
          {searchQuery && (
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="text-divine mt-1"
            >
              Clear search
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {displayedAnnouncements.map((announcement) => (
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
              <CardContent
                className={`p-5 ${
                  announcement.imageUrl ? "md:w-3/4" : "w-full"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {announcement.title}
                      </h3>
                      {announcement.isImportant && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                          Important
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <Calendar size={14} />
                      {/* Format the date from the backend */}
                      <span>
                        {new Date(announcement.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">
                      {announcement.content}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(announcement)}
                      className="flex items-center gap-1"
                      disabled={
                        updateMutation.isPending || deleteMutation.isPending
                      }
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConfirm(announcement)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={
                        deleteMutation.isPending &&
                        deleteMutation.variables === announcement.id
                      }
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables === announcement.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Announcements</h1>
          <p className="text-gray-500">Manage your church announcements</p>
        </div>

        <Button
          onClick={handleAddNew}
          className="bg-divine hover:bg-divine/90"
          disabled={
            isLoading ||
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending
          }
        >
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
              disabled={
                isLoading ||
                createMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending
              }
            />
          </div>
        </CardContent>
      </Card>

      {renderAnnouncementsList()}

      {/* Create/Edit Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentAnnouncement
                ? "Edit Announcement"
                : "Create New Announcement"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  uploadImageMutation.isPending // Disable while uploading
                }
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
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  uploadImageMutation.isPending
                }
              />
            </div>

            {/* File Upload Input */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Announcement Image</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {/* Display existing image or selected new image preview */}
                  {(imageUrl && !imageFile) ||
                  (imageFile && URL.createObjectURL(imageFile)) ? (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Current Image:</p>
                      <img
                        src={
                          imageFile ? URL.createObjectURL(imageFile) : imageUrl
                        }
                        alt="Announcement Preview"
                        className="h-20 w-auto object-contain mx-auto"
                      />
                    </div>
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="imageFile"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark"
                    >
                      <span>
                        {imageUrl && !imageFile
                          ? "Change image"
                          : "Upload an image"}
                      </span>
                      <Input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={
                          createMutation.isPending ||
                          updateMutation.isPending ||
                          uploadImageMutation.isPending
                        }
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {imageFile && (
                    <p className="text-sm text-divine-dark font-medium">
                      {imageFile.name}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Leave blank if no image is desired for new announcements, or to
                remove image from existing.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="important"
                checked={isImportant}
                onCheckedChange={setIsImportant}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  uploadImageMutation.isPending
                }
              />
              <Label htmlFor="important">Mark as important</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                uploadImageMutation.isPending
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-divine hover:bg-divine/90"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                uploadImageMutation.isPending
              }
            >
              {createMutation.isPending ||
              updateMutation.isPending ||
              uploadImageMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {uploadImageMutation.isPending
                    ? "Uploading Image..."
                    : currentAnnouncement
                    ? "Saving Changes..."
                    : "Creating Announcement..."}
                </>
              ) : currentAnnouncement ? (
                "Save Changes"
              ) : (
                "Create Announcement"
              )}
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
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnnouncements;
