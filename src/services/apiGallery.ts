// src/services/apiGallery.ts

import axios from "axios";

export interface GalleryImage {
  id: string; // MongoDB _id will be mapped to id
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId: string; // To manage deletion from Cloudinary
  category: string;
  uploadDate: string; // Or Date, depending on how you store it and format it in frontend
}

// *** IMPORTANT: This type will NOT be directly used for the upload payload anymore ***
// The payload will be FormData. The backend will return a GalleryImage.
// export interface CreateGalleryImagePayload {
//   title: string;
//   description: string;
//   imageUrl: string;
//   cloudinaryPublicId: string;
//   category: string;
// }

// Use VITE_API_URL matching your .env file
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/gallery`; // Base for fetching/deleting
const UPLOAD_URL = `${import.meta.env.VITE_API_URL}/api/upload/image`; // Your backend's dedicated upload route

/**
 * Fetches all gallery images from the backend.
 * @returns A promise that resolves to an array of GalleryImage objects.
 */
export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  const { data } = await axios.get<GalleryImage[]>(API_BASE_URL);
  return data;
};

/**
 * Uploads a new gallery image to the backend.
 * @param formData - FormData containing image file and other image details.
 * @returns A promise that resolves to the newly created GalleryImage object.
 */
export const uploadGalleryImage = async (
  formData: FormData // Accept FormData directly
): Promise<GalleryImage> => {
  // Axios will automatically set the 'Content-Type' to 'multipart/form-data'
  // when it detects FormData.
  const { data } = await axios.post<GalleryImage>(UPLOAD_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Explicitly set for clarity, though Axios often handles it
    },
  });
  return data;
};

/**
 * Deletes a gallery image from the backend.
 * @param id - The ID of the image to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteGalleryImage = async (id: string): Promise<void> => {
  // Assuming your backend's DELETE route at API_BASE_URL/:id handles Cloudinary deletion
  await axios.delete(`${API_BASE_URL}/${id}`);
};
