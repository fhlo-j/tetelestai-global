// src/services/apiAdmin.ts

const API_URL = import.meta.env.VITE_API_URL;

// --- CENTRALIZED INTERFACE DEFINITIONS ---
// These interfaces are defined ONCE here and exported for reuse.

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  cloudinaryPublicId: string; // Added this property as it's common for image management
  description: string;
  featured: boolean;
  speakers: string[];
  registrations?: number; // registrations might not be sent on update
}

export interface Registration {
  fullName: string;
  numberOfAttendees: number;
  specialRequests: string | null;
  id: string; // Ensure this is consistent with your backend (e.g., MongoDB's _id often mapped to 'id' on frontend)
  _id: string;
  event: string; // The ID of the event
  eventName: string; // Populated event name
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface EventDataForTabs {
  id: string; // Changed from _id to 'id' for consistency with the 'Event' interface
  title: string; // Event title
  registrations: number; // The count from the Event model
}

// --- API Functions for Events ---

export async function fetchEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch events");
    }

    const data = await res.json();
    return data; // Assuming /api/events directly returns an array of events
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
}

export async function fetchEventById(id: string): Promise<Event> {
  try {
    const res = await fetch(`${API_URL}/api/events/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Event not found.");
      }
      const errorData = await res.json();
      throw new Error(
        errorData.message ||
          `Failed to fetch event with ID ${id}: Status ${res.status}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchEventById for ID ${id}:`, error);
    throw new Error(
      (error as Error).message || "Network error or server unreachable."
    );
  }
}

// Added more specific typing for eventData based on common Event creation needs
export const createEvent = async (
  eventData: Omit<Event, "id" | "registrations">
): Promise<Event> => {
  const response = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create event");
  }

  return response.json();
};

export const updateEvent = async (eventData: Event): Promise<Event> => {
  const { id, ...dataToUpdate } = eventData;

  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToUpdate),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update event");
  }

  return response.json();
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete event");
  }
  // Backend might return a message or nothing; we expect void
  return;
};

// --- API Functions for Registrations ---

export const fetchRegistrations = async (
  params?: Record<string, string>
): Promise<Registration[]> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/registrations${
      queryParams ? `?${queryParams}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch registrations");
    }
    const data = await response.json();
    // Assuming your API returns { count, data: [...] } for registrations.
    // If it returns an array directly, change this to `return data;`
    return data.data;
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    throw error;
  }
};

export const fetchEventsForRegistrationTabs = async (): Promise<
  EventDataForTabs[]
> => {
  try {
    const response = await fetch(`${API_URL}/api/events`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch events for tabs");
    }
    const data = await response.json();
    // Adjusted: Assuming your /api/events endpoint returns an array of events directly
    // If it returns an object like `{ count: 5, data: [...] }`, change this back to `return data.data;`.
    return data;
  } catch (error) {
    console.error("Failed to fetch events for registration tabs:", error);
    throw error;
  }
};

export const updateRegistrationStatus = async ({
  id,
  status,
}: {
  id: string;
  status: Registration["status"];
}): Promise<Registration> => {
  const response = await fetch(`${API_URL}/api/registrations/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to update registration status"
    );
  }
  return response.json();
};

export const deleteRegistration = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/registrations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete registration");
  }
  return;
};
