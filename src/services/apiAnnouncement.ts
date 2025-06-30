/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/apiAnnouncements.ts
// Removed axios import

const API_URL = `${import.meta.env.VITE_API_URL}/api/announcements`;

// Define the Announcement interface for frontend consistency
export interface Announcement {
  id: string; // This will now come from the backend's _id transformation
  title: string;
  content: string;
  date: string; // Storing as string or Date object depending on how you want to parse
  imageUrl?: string; // Optional
  isImportant: boolean;
  cloudinaryPublicId?: string; // Optional, for image management
}

// Data shape for creating/updating (ID is not needed for creation)
export interface AnnouncementPayload {
  title: string;
  content: string;
  imageUrl?: string;
  isImportant?: boolean;
  cloudinaryPublicId?: string; // Optional, for image management
}

/**
 * Helper function to handle fetch responses.
 * Checks for response.ok (2xx status) and parses JSON.
 * Throws an Error for non-2xx responses.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Check if the response was successful (status code 200-299)
  if (!response.ok) {
    let errorData: any = {};
    try {
      // Try to parse error message from response body if available
      errorData = await response.json();
    } catch (e) {
      // If parsing fails, use the status text
      errorData = { message: response.statusText || "Something went wrong!" };
    }
    // Throw a new Error with a descriptive message
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`
    );
  }
  // If response is OK, parse and return the JSON body
  return response.json();
}

// Fetch all announcements, with optional search query
export const fetchAnnouncements = async (
  searchQuery?: string
): Promise<Announcement[]> => {
  const url = searchQuery
    ? `${API_URL}?search=${encodeURIComponent(searchQuery)}`
    : API_URL;
  const response = await fetch(url);

  // Always ensure we return an array, even if data is missing
  const result = await handleResponse<{
    success: boolean;
    data?: Announcement[]; // Make data optional
  }>(response);

  // Return empty array if data is undefined
  return result.data || [];
};

// Create a new announcement
export const createAnnouncement = async (
  announcementData: AnnouncementPayload
): Promise<Announcement> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Crucial for sending JSON data
    },
    body: JSON.stringify(announcementData), // Convert JS object to JSON string
  });
  // We expect a data property from the backend in the format { success: boolean; data: Announcement }
  const result = await handleResponse<{ success: boolean; data: Announcement }>(
    response
  );
  return result.data;
};

// Update an existing announcement
export const updateAnnouncement = async (
  id: string,
  announcementData: Partial<AnnouncementPayload>
): Promise<Announcement> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Crucial for sending JSON data
    },
    body: JSON.stringify(announcementData), // Convert JS object to JSON string
  });
  // We expect a data property from the backend in the format { success: boolean; data: Announcement }
  const result = await handleResponse<{ success: boolean; data: Announcement }>(
    response
  );
  return result.data;
};

// Delete an announcement
export const deleteAnnouncement = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  // For a delete operation, we typically don't expect a JSON body on success.
  // We only care if the operation was successful (response.ok).
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json(); // Try to parse error details if available
    } catch (e) {
      errorData = { message: response.statusText || "Failed to delete!" };
    }
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`
    );
  }
  // If response is OK, we don't need to return anything
};
