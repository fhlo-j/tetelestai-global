import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast"; // Your toast system
import {
  updateRegistrationStatus,
  deleteRegistration,
  Registration, // <--- Import Registration from apiAdmin.ts
} from "@/services/apiAdmin";

// Hook for updating registration status
export const useUpdateRegistrationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRegistrationStatus,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Registration status updated.",
      });
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["eventsForTabs"] }); // To update counts in event tabs
    },
    onError: (error: unknown) => {
      console.error("Error updating status:", error);
      let message = "Failed to update registration status.";
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        message = (error as { message: string }).message;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });
};

// Hook for deleting a registration
export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRegistration,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Registration deleted successfully.",
      });
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["eventsForTabs"] }); // To update counts in event tabs
    },
    onError: (error: unknown) => {
      console.error("Error deleting registration:", error);
      let message = "Failed to delete registration.";
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        message = (error as { message: string }).message;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });
};
