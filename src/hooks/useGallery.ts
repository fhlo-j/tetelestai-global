// src/hooks/useGallery.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Import only the types that are directly relevant for the hook's return
import {
  fetchGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  GalleryImage,
} from "../services/apiGallery";

// Hook for fetching gallery images
export function useGalleryImages() {
  return useQuery<GalleryImage[], Error>({
    queryKey: ["gallery"],
    queryFn: fetchGalleryImages,
  });
}

// Hook for uploading a gallery image
export function useUploadGalleryImage() {
  const queryClient = useQueryClient();

  // The mutationFn now expects FormData as its variable type
  return useMutation<GalleryImage, Error, FormData>({
    mutationFn: uploadGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
    },
    onError: (error) => {
      console.error("Error during gallery image upload:", error);
      // You can add more sophisticated error handling here, e.g., using toast
    },
  });
}

// Hook for deleting a gallery image
export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    // `string` for the ID
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
    },
    onError: (error) => {
      console.error("Error during gallery image deletion:", error);
      // You can add more sophisticated error handling here
    },
  });
}
