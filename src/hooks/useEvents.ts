// src/hooks/useCreateEvent.ts
import { createEvent, deleteEvent, updateEvent } from "@/services/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  description: string;
  featured: boolean;
  speakers: string[];
  registrations?: number; // registrations might not be sent on update
}

//Get all events
//____________________________________________________________
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Refresh events list
    },
  });
};

// Add an event with success callback
//____________________________________________________________
export const useAddEvent = (onSuccessCallback?: (event: Event) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,

    onSuccess: (data: Event) => {
      toast("Event created successfully!");

      queryClient.invalidateQueries({ queryKey: ["events"] });

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },

    onError: (error: Error) => {
      toast(`Error: ${error.message}`);
    },
  });
};

export const useUpdateEvent = (onSuccessCallback?: (event: Event) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvent, // Use the new updateEvent function

    onSuccess: (data: Event) => {
      toast("Event updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["events"] });
      // You might also want to invalidate a specific event query if you have one
      queryClient.invalidateQueries({ queryKey: ["event", data.id] });

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },

    onError: (error: Error) => {
      toast(`Error: ${error.message}`);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent, // Use the new deleteEvent API function

    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Invalidate to refetch the list
    },

    onError: (error: Error) => {
      toast.error(`Error deleting event: ${error.message}`);
    },
  });
};
