/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useMinistries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL;

export interface ArrayItem {
  id: string;
  value: string;
}

export interface Ministry {
  id: string; // This will be mapped from _id
  _id: string; // Keep this for MongoDB compatibility, but not used in frontend
  title: string;
  desc: string;
  fullDescription: string;
  goals: ArrayItem[];
  activities: ArrayItem[];
  getInvolved: string;
  imageUrl: string;
  bannerUrl: string;
  imagePublicId?: string;
  bannerPublicId?: string;
}

interface MinistryPayload {
  id?: string;
  title: string;
  desc: string;
  fullDescription: string;
  goals: string[];
  activities: string[];
  getInvolved: string;
  imageUrl: string;
  bannerUrl: string;
  imagePublicId?: string;
  bannerPublicId?: string;
}

interface UploadImageResponse {
  imageUrl: string;
  publicId: string;
}

// Helper function to transform MongoDB document to frontend format
const transformMinistry = (ministry: any): Ministry => {
  return {
    _id: ministry._id, // Keep _id for MongoDB compatibility
    id: ministry._id, // Map _id to id
    title: ministry.title,
    desc: ministry.desc,
    fullDescription: ministry.fullDescription,
    goals: (ministry.goals || []).map((value: any) => ({
      id: crypto.randomUUID(),
      value: typeof value === "string" ? value : value.value,
    })),
    activities: (ministry.activities || []).map((value: any) => ({
      id: crypto.randomUUID(),
      value: typeof value === "string" ? value : value.value,
    })),
    getInvolved: ministry.getInvolved,
    imageUrl: ministry.imageUrl,
    bannerUrl: ministry.bannerUrl,
    imagePublicId: ministry.imagePublicId,
    bannerPublicId: ministry.bannerPublicId,
  };
};

// --- API FUNCTIONS ---
export const fetchMinistries = async (): Promise<Ministry[]> => {
  const { data } = await axios.get<any[]>(`${API_URL}/api/ministries`);
  return data.map(transformMinistry);
};

const createMinistry = async (
  newMinistry: Omit<MinistryPayload, "id">
): Promise<Ministry> => {
  const { data } = await axios.post<any>(
    `${API_URL}/api/ministries`,
    newMinistry
  );
  return transformMinistry(data);
};

const updateMinistry = async (
  updatedMinistry: MinistryPayload
): Promise<Ministry> => {
  const { data } = await axios.put<any>(
    `${API_URL}/api/ministries/${updatedMinistry.id}`,
    updatedMinistry
  );
  return transformMinistry(data);
};

const deleteMinistry = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_URL}/api/ministries/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success !== true) {
      throw new Error(response.data.message || "Failed to delete ministry");
    }
  } catch (error) {
    console.error("Delete ministry error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete ministry"
    );
  }
};

const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axios.post<UploadImageResponse>(
    `${API_URL}/api/upload/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

const deleteCloudinaryImage = async (publicId: string): Promise<void> => {
  await axios.post(`${API_URL}/api/upload/delete-cloudinary-image`, {
    publicId,
  });
};

// --- REACT QUERY HOOKS ---
export const useMinistries = () => {
  return useQuery<Ministry[], Error>({
    queryKey: ["ministries"],
    queryFn: fetchMinistries,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation<Ministry, Error, Omit<MinistryPayload, "id">>({
    mutationFn: createMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      toast({
        title: "Ministry Created",
        description: "The new ministry has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Ministry",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation<Ministry, Error, MinistryPayload>({
    mutationFn: updateMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      toast({
        title: "Ministry Updated",
        description: "The ministry has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Ministry",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMinistry,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      toast({
        title: "Success",
        description: "Ministry deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUploadImage = () => {
  return useMutation<UploadImageResponse, Error, { file: File }>({
    mutationFn: ({ file }) => uploadImage(file),
    onSuccess: (data) => {
      toast({
        title: "Image Uploaded",
        description: `Image uploaded successfully. Public ID: ${data.publicId}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Image Upload Failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCloudinaryImage = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteCloudinaryImage,
    onSuccess: () => {
      toast({
        title: "Image Deleted",
        description: "Image successfully removed from Cloudinary.",
      });
    },
    onError: (error) => {
      toast({
        title: "Image Deletion Failed",
        description: error.message || "Failed to delete image from Cloudinary.",
        variant: "destructive",
      });
    },
  });
};
