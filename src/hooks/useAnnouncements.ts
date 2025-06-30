// src/hooks/useAnnouncements.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast"; // Your custom toast hook
import {
  fetchAnnouncements,
  Announcement,
  createAnnouncement,
  AnnouncementPayload,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/apiAnnouncement";

// Query hook for fetching all announcements
export const useAnnouncements = (searchQuery: string) => {
  return useQuery<Announcement[], Error>({
    queryKey: ["announcements", searchQuery], // Query key includes search query
    queryFn: () => fetchAnnouncements(searchQuery),
    placeholderData: [], // Optional: show empty array while loading for first time
    staleTime: 1000 * 60 * 2, // Data is considered fresh for 2 minutes
  });
};

// Mutation hook for creating an announcement
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, AnnouncementPayload>({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] }); // Invalidate all announcements queries to refetch
      toast({
        title: "Announcement created",
        description: "The new announcement has been successfully created.",
      });
    },
    onError: (error) => {
      console.error("Error creating announcement:", error);
      toast({
        title: "Failed to create announcement",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for updating an announcement
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Announcement,
    Error,
    { id: string; payload: Partial<AnnouncementPayload> }
  >({
    mutationFn: ({ id, payload }) => updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Announcement updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating announcement:", error);
      toast({
        title: "Failed to update announcement",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};

// Mutation hook for deleting an announcement
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    // `void` because delete doesn't return data
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Announcement deleted",
        description: "The announcement has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error("Error deleting announcement:", error);
      toast({
        title: "Failed to delete announcement",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};
