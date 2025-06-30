// src/pages/EventDetail.tsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import { useQuery } from '@tanstack/react-query'

// CORRECTED IMPORT: These should now come from apiUser.ts for public-facing functionality
import {
  fetchEventById,
  registerForEvent,
  Event,
  RegistrationFormData,
} from '@/services/apiUser'
import { formatDate } from '@/utils/dateFormatter'

const EventDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Event ID is missing')
      }
      return fetchEventById(id)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfAttendees: '1', // Keep as string for input, parse on submit
    specialRequests: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Ensure event data is available before attempting to register
    if (!id || !event) {
      toast.error('Error: Event details are not available for registration.')
      setIsSubmitting(false)
      return
    }

    try {
      const registrationData: RegistrationFormData = {
        eventId: id, // Pass the event ID from useParams
        eventName: event.title, // Pass the event name from the fetched event data
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || null, // Ensure phone is null if empty string
        numberOfAttendees: parseInt(formData.numberOfAttendees), // Parse to number
        specialRequests: formData.specialRequests,
      }

      // *** ACTUAL API CALL HERE ***
      await registerForEvent(registrationData)

      toast.success(
        `Registration successful for ${event.title}! We've sent a confirmation to ${formData.email}.`
      )

      // Reset form on successful submission
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        numberOfAttendees: '1',
        specialRequests: '',
      })
    } catch (error: unknown) {
      console.error('Registration error:', error)
      // Display a user-friendly error message
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to register. Please try again.')
      } else {
        toast.error('Failed to register. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Loading, Error, Not Found States ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-divine mb-4" />
        <p className="text-lg text-gray-700">Loading event details...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-4">
        <h2 className="text-xl font-semibold mb-3">Error Loading Event</h2>
        <p className="text-lg mb-4">
          Failed to fetch event:{' '}
          {error?.message || 'An unknown error occurred.'}
        </p>
        <button
          onClick={() => navigate('/events')}
          className="btn-primary flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>
      </div>
    )
  }

  // If `event` is null/undefined but not loading and no error, it means event was not found (e.g., 404 from API)
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
        <h2 className="text-2xl font-semibold mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-6">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="btn-primary flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>
      </div>
    )
  }

  // --- Render Event Details (when `event` data is available) ---
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div
        className="pt-24 pb-12 relative"
        style={{
          backgroundImage: `url(${event.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-divine-gradient opacity-90"></div>{' '}
        <div className="container-custom relative z-10">
          <button
            onClick={() => navigate('/events')}
            className="text-white flex items-center gap-1 mb-6 hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Events
          </button>

          <h1 className="text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {formatDate(event.date)} • {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <section className="py-12 bg-white flex-1">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-80 object-cover rounded-lg mb-6 shadow-md"
              />

              <div className="prose max-w-none">
                <h2 className="text-divine mb-4">Event Details</h2>
                <p className="text-gray-700">{event.description}</p>

                {event.speakers && event.speakers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-3">
                      Featured Speakers
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {event.speakers.map((speaker, index) => (
                        <li
                          key={index}
                          className="text-gray-700"
                        >
                          {speaker}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Form */}
            <div
              id="register"
              className="bg-gray-50 p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 text-divine">
                Register for this Event
              </h2>
              <p className="text-gray-700 mb-4">
                Secure your spot for the upcoming {event.title} by filling out
                the form below.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="numberOfAttendees"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Number of Attendees*
                    </label>
                    <select
                      id="numberOfAttendees"
                      name="numberOfAttendees"
                      value={formData.numberOfAttendees}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option
                          key={num}
                          value={num}
                        >
                          {num}
                        </option>
                      ))}
                      <option value="more">More than 10</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="specialRequests"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />{' '}
                        Registering...
                      </>
                    ) : (
                      <>
                        Complete Registration <MessageSquare size={18} />
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center mt-2">
                    You'll receive a confirmation email after registration
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  )
}

export default EventDetail
