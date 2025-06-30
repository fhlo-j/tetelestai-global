// pages/Admin/AdminMinistryDetails.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "@/hooks/use-toast";

// Import AlertDialog components for the delete modal
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

import {
  Ministry,
  ArrayItem, // Ensure ArrayItem is imported from useMinistries
  useMinistries,
  useCreateMinistry,
  useUpdateMinistry,
  useDeleteMinistry,
  useUploadImage,
  useDeleteCloudinaryImage,
} from "@/hooks/useMinistries";

const AdminMinistryDetails = () => {
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ministryToDelete, setMinistryToDelete] = useState<{
    id: string;
    imagePublicId?: string;
    bannerPublicId?: string;
  } | null>(null);

  // React Query hooks
  const {
    data: ministries,
    isLoading,
    isError,
    error,
    refetch,
  } = useMinistries();
  const createMinistryMutation = useCreateMinistry();
  const updateMinistryMutation = useUpdateMinistry();
  const deleteMinistryMutation = useDeleteMinistry();
  const uploadImageMutation = useUploadImage();
  const deleteCloudinaryImageMutation = useDeleteCloudinaryImage();

  const handleImageUpload = async (
    file: File,
    type: "imageUrl" | "bannerUrl"
  ) => {
    const result = await uploadImageMutation.mutateAsync({ file });

    setEditingMinistry((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [type]: result.imageUrl,
        [type === "imageUrl" ? "imagePublicId" : "bannerPublicId"]:
          result.publicId,
      };
    });
    return result;
  };

  const handleRemoveImage = async (
    publicId: string,
    type: "imageUrl" | "bannerUrl"
  ) => {
    if (!publicId) return;

    await deleteCloudinaryImageMutation.mutateAsync(publicId);

    setEditingMinistry((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [type]: "",
        [type === "imageUrl" ? "imagePublicId" : "bannerPublicId"]: undefined,
      };
    });
  };

  const handleSubmit = async () => {
    if (!editingMinistry?.title || !editingMinistry?.desc) {
      toast({
        title: "Validation Error",
        description: "Title and short description are required",
        variant: "destructive",
      });
      return;
    }

    // Prepare data to send to backend
    // Convert ArrayItem[] back to string[] for backend
    const ministryDataForBackend = {
      ...editingMinistry,
      goals: editingMinistry.goals.map((item) => item.value),
      activities: editingMinistry.activities.map((item) => item.value),
      imagePublicId: editingMinistry.imagePublicId || undefined,
      bannerPublicId: editingMinistry.bannerPublicId || undefined,
    };

    try {
      if (isCreating) {
        // For creation, omit the ID entirely
        const { id, ...newMinistryWithoutId } = ministryDataForBackend;
        await createMinistryMutation.mutateAsync(newMinistryWithoutId);
      } else if (editingMinistry) {
        // For update, ensure ID is present and valid
        // Check if ID is empty string, which would cause /undefined issues
        if (!editingMinistry.id) {
          toast({
            title: "Error",
            description: "Cannot update a ministry without a valid ID.",
            variant: "destructive",
          });
          return;
        }
        await updateMinistryMutation.mutateAsync(ministryDataForBackend);
      }
      setIsCreating(false);
      setEditingMinistry(null);
    } catch (submitError) {
      // Error handling is already done in the mutation hooks
      console.error("Submission error:", submitError);
    }
  };

  // --- DELETE MODAL LOGIC ---
  const confirmDelete = (
    id: string,
    imagePublicId?: string,
    bannerPublicId?: string
  ) => {
    setMinistryToDelete({ id, imagePublicId, bannerPublicId });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!ministryToDelete) return;

    const { id, imagePublicId, bannerPublicId } = ministryToDelete;

    try {
      await deleteMinistryMutation.mutateAsync(id);

      if (imagePublicId) {
        await deleteCloudinaryImageMutation.mutateAsync(imagePublicId);
      }
      if (bannerPublicId) {
        await deleteCloudinaryImageMutation.mutateAsync(bannerPublicId);
      }
      toast({
        title: "Ministry Deleted",
        description:
          "The ministry and its associated images have been removed.",
        variant: "default",
      });
    } catch (deleteError) {
      // Error handling is done by mutation hooks, but good to log here too.
      console.error("Failed to delete ministry:", deleteError);
      toast({
        title: "Deletion Failed",
        description:
          "There was an error deleting the ministry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteModal(false);
      setMinistryToDelete(null);
    }
  };
  // --- END DELETE MODAL LOGIC ---

  const startCreating = () => {
    setIsCreating(true);
    setEditingMinistry({
      _id: "", // Add _id for type compatibility
      id: "", // Will be assigned by the backend upon creation
      title: "",
      desc: "",
      fullDescription: "",
      goals: [], // Initialize as empty ArrayItem[]
      activities: [], // Initialize as empty ArrayItem[]
      getInvolved: "",
      imageUrl: "",
      bannerUrl: "",
      imagePublicId: undefined,
      bannerPublicId: undefined,
    });
  };

  const handleArrayChange = (
    field: "goals" | "activities",
    id: string, // Use ID for updating
    value: string
  ) => {
    setEditingMinistry((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: prev[field].map((item) =>
          item.id === id ? { ...item, value: value } : item
        ),
      };
    });
  };

  const addArrayItem = (field: "goals" | "activities") => {
    setEditingMinistry((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: [...prev[field], { id: crypto.randomUUID(), value: "" }], // Generate unique ID
      };
    });
  };

  const removeArrayItem = (field: "goals" | "activities", id: string) => {
    setEditingMinistry((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: prev[field].filter((item) => item.id !== id),
      };
    });
  };

  const handleEditClick = (ministry: Ministry) => {
    // Ensure the ministry object passed to setEditingMinistry has an 'id'
    // If your backend consistently returns 'id', this might not be strictly needed for `ministry.id`
    // but it's good practice to ensure `_id` is transformed if it exists.
    setEditingMinistry({
      ...ministry,
      id: ministry._id, // Use id from Ministry type
      goals: ministry.goals.map((value) => ({
        id: crypto.randomUUID(), // Assign unique IDs for frontend list management
        value: typeof value === "string" ? value : value.value,
      })),
      activities: ministry.activities.map((value) => ({
        id: crypto.randomUUID(), // Assign unique IDs for frontend list management
        value: typeof value === "string" ? value : value.value,
      })),
    });
    setIsCreating(false);
  };

  const isSaving =
    createMinistryMutation.isPending || updateMinistryMutation.isPending;
  const isDeleting = deleteMinistryMutation.isPending;
  const isImageUploading = uploadImageMutation.isPending;
  const isImageDeleting = deleteCloudinaryImageMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-divine" />
        <p className="ml-4 text-gray-600">Loading ministries...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 bg-white rounded-md text-red-500">
        <AlertTriangle size={40} className="mx-auto text-red-400 mb-4" />
        <p>Error: {error?.message || "Failed to load ministries."}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ADD/EDIT FORM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ministry Management</h1>
          <p className="text-gray-500">Manage your church ministries</p>
        </div>
        <Button onClick={startCreating} disabled={isSaving}>
          <Plus size={16} className="mr-2" />
          Add Ministry
        </Button>
      </div>

      {(isCreating || editingMinistry) && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isCreating
                  ? "Create New Ministry"
                  : `Editing ${editingMinistry?.title}`}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsCreating(false);
                  setEditingMinistry(null);
                }}
                disabled={isSaving || isImageUploading || isImageDeleting}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title*
                  </label>
                  <Input
                    value={editingMinistry?.title || ""}
                    onChange={(e) =>
                      setEditingMinistry((prev) => ({
                        ...prev!,
                        title: e.target.value,
                      }))
                    }
                    disabled={isSaving || isImageUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Description*
                  </label>
                  <Textarea
                    value={editingMinistry?.desc || ""}
                    onChange={(e) =>
                      setEditingMinistry((prev) => ({
                        ...prev!,
                        desc: e.target.value,
                      }))
                    }
                    className="h-24"
                    disabled={isSaving || isImageUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Description
                  </label>
                  <Textarea
                    value={editingMinistry?.fullDescription || ""}
                    onChange={(e) =>
                      setEditingMinistry((prev) => ({
                        ...prev!,
                        fullDescription: e.target.value,
                      }))
                    }
                    className="h-32"
                    disabled={isSaving || isImageUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How to Get Involved
                  </label>
                  <Textarea
                    value={editingMinistry?.getInvolved || ""}
                    onChange={(e) =>
                      setEditingMinistry((prev) => ({
                        ...prev!,
                        getInvolved: e.target.value,
                      }))
                    }
                    className="h-24"
                    disabled={isSaving || isImageUploading}
                  />
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Goals
                  </label>
                  {editingMinistry?.goals.map((goal) => (
                    <div key={goal.id} className="flex gap-2 mb-2">
                      <Input
                        value={goal.value}
                        onChange={(e) =>
                          handleArrayChange("goals", goal.id, e.target.value)
                        }
                        disabled={isSaving || isImageUploading}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeArrayItem("goals", goal.id)}
                        disabled={isSaving || isImageUploading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("goals")}
                    disabled={isSaving || isImageUploading}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Goal
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Activities
                  </label>
                  {editingMinistry?.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-2 mb-2">
                      <Input
                        value={activity.value}
                        onChange={(e) =>
                          handleArrayChange(
                            "activities",
                            activity.id,
                            e.target.value
                          )
                        }
                        disabled={isSaving || isImageUploading}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          removeArrayItem("activities", activity.id)
                        }
                        disabled={isSaving || isImageUploading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("activities")}
                    disabled={isSaving || isImageUploading}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Activity
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Uploaders */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ministry Image
                </label>
                <ImageUploader
                  onImageSelected={(file) =>
                    handleImageUpload(file, "imageUrl")
                  }
                  onRemoveImage={(publicId) =>
                    handleRemoveImage(publicId, "imageUrl")
                  }
                  initialImageUrl={editingMinistry?.imageUrl}
                  initialPublicId={editingMinistry?.imagePublicId}
                  isUploading={uploadImageMutation.isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Banner Image
                </label>
                <ImageUploader
                  onImageSelected={(file) =>
                    handleImageUpload(file, "bannerUrl")
                  }
                  onRemoveImage={(publicId) =>
                    handleRemoveImage(publicId, "bannerUrl")
                  }
                  initialImageUrl={editingMinistry?.bannerUrl}
                  initialPublicId={editingMinistry?.bannerPublicId}
                  isUploading={uploadImageMutation.isPending}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setEditingMinistry(null);
                }}
                disabled={isSaving || isImageUploading || isImageDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSaving || isImageUploading || isImageDeleting}
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {isCreating ? "Create Ministry" : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ministries List */}
      <div className="space-y-4">
        {ministries && ministries.length > 0 ? (
          ministries.map((ministry) => (
            <Card key={ministry.id} className="shadow-sm">
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {ministry.imageUrl || ministry.bannerUrl ? (
                    <img
                      src={ministry.imageUrl || ministry.bannerUrl}
                      alt={ministry.title}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{ministry.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {ministry.desc}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 self-end md:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // When editing, convert string arrays to ArrayItem arrays for the form
                      setEditingMinistry({
                        ...ministry,
                        goals: ministry.goals.map((value) => ({
                          id: crypto.randomUUID(), // Assign unique IDs
                          value:
                            typeof value === "string" ? value : value.value,
                        })),
                        activities: ministry.activities.map((value) => ({
                          id: crypto.randomUUID(), // Assign unique IDs
                          value:
                            typeof value === "string" ? value : value.value,
                        })),
                      });
                      setIsCreating(false);
                    }}
                    disabled={isSaving || isImageUploading || isDeleting}
                  >
                    <Pencil size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      confirmDelete(
                        ministry.id,
                        ministry.imagePublicId,
                        ministry.bannerPublicId
                      )
                    }
                    disabled={
                      isDeleting &&
                      deleteMinistryMutation.variables === ministry.id
                    }
                  >
                    {isDeleting &&
                    deleteMinistryMutation.variables === ministry.id ? (
                      <Loader2 size={14} className="animate-spin mr-1" />
                    ) : (
                      <Trash2 size={14} className="mr-1" />
                    )}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-md">
            <ImageIcon size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No ministries found. Add one above!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong>
                "{ministries?.find((m) => m.id === ministryToDelete?.id)?.title}
                "
              </strong>{" "}
              ministry and remove its associated images from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
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

export default AdminMinistryDetails;
