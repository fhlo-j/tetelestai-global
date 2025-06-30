// src/services/apiUser.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// --- Interfaces (can be shared or duplicated if needed) ---

export interface Event {
  _id: string // MongoDB ID
  id: string
  title: string
  date: string
  time: string
  location: string
  imageUrl: string
  description: string
  featured?: boolean
  registrations: number
  speakers?: string[]
  createdAt: string
  cloudinaryPublicId?: string
}

// Data structure for sending to the register endpoint
export interface RegistrationFormData {
  eventId: string
  eventName: string // Used to store event name directly in registration record
  fullName: string
  email: string
  phone: string | null
  numberOfAttendees: number
  specialRequests: string
}

// Interface for a full Registration document (what the backend returns after creation)
export interface Registration {
  _id: string
  eventId: string
  eventName: string
  fullName: string
  email: string
  phone: string | null
  numberOfAttendees: number
  specialRequests: string
  status: 'pending' | 'confirmed' | 'cancelled'
  registrationDate: string
}

// --- API Functions for Users ---

export async function fetchEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events`)
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(
        errorData.message || `Failed to fetch events: Status ${res.status}`
      )
    }
    return res.json()
  } catch (error: unknown) {
    console.error('Error fetching events:', error)
    if (error instanceof Error) {
      throw new Error(error.message || 'Network error or server unreachable.')
    } else {
      throw new Error('Network error or server unreachable.')
    }
  }
}

export async function fetchEventById(id: string): Promise<Event> {
  try {
    const res = await fetch(`${API_URL}/api/events/${id}`)
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(
        errorData.message || `Failed to fetch event ${id}: Status ${res.status}`
      )
    }
    return res.json()
  } catch (error: unknown) {
    console.error(`Error fetching event by ID ${id}:`, error)
    if (error instanceof Error) {
      throw new Error(error.message || 'Network error or server unreachable.')
    } else {
      throw new Error('Network error or server unreachable.')
    }
  }
}

export async function registerForEvent(
  registrationData: RegistrationFormData
): Promise<Registration> {
  try {
    const res = await fetch(`${API_URL}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(
        errorData.message || `Failed to register: Status ${res.status}`
      )
    }
    const result = await res.json()
    return result.registration // Backend returns { message, registration: newRegistration }
  } catch (error: unknown) {
    console.error(`Error registering:`, error)
    if (error instanceof Error) {
      throw new Error(error.message || 'Network error or server unreachable.')
    } else {
      throw new Error('Network error or server unreachable.')
    }
  }
}

export const fetchUpcomingEvents = async () => {
  const response = await fetch(`${API_URL}/api/events/upcoming`) // Adjust URL based on your backend server
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming events')
  }
  return response.json()
}
