import { useState } from 'react'
import {
  Trash2,
  Edit,
  Plus,
  Search,
  UploadCloud,
  X,
  Users,
  MapPin,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchEvents } from '@/services/apiAdmin'
import {
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
} from '@/hooks/useEvents'

const API_URL = import.meta.env.VITE_API_URL

// --- CHANGES START HERE ---

interface EventFormData {
  id?: string
  title: string
  date: string
  time: string
  location: string
  description: string
  imageFile: File | null
  imageUrl?: string
  cloudinaryPublicId?: string // Add cloudinaryPublicId to formData
  featured: boolean
  speakers: string[]
}

// Use the Event type from the API to ensure compatibility
import type { Event as ApiEvent } from '@/services/apiAdmin'
import { formatDate } from '@/utils/dateFormatter'
type Event = ApiEvent

const AdminEventsList = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    description: '',
    imageFile: null,
    featured: false,
    speakers: [''],
    cloudinaryPublicId: undefined, // Initialize here
  })

  const queryClient = useQueryClient()

  const {
    data: events,
    isLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

  const filteredEvents = (events ?? []).filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const createMutation = useCreateEvent()
  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()

  const uploadImageMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Image upload failed')
      }

      return response.json() as Promise<{
        imageUrl: string
        publicId: string
      }>
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const requiredFields = ['title', 'date', 'time', 'location', 'description']
    let isValid = true

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please enter the ${field}`)
        isValid = false
      }
    })

    if (!editingEvent && !formData.imageFile) {
      toast.error('Please upload an image for the event')
      isValid = false
    }

    if (formData.speakers.some((speaker) => !speaker.trim())) {
      toast.error('Please enter all speaker names or remove empty fields')
      isValid = false
    }

    if (!isValid) return

    try {
      let finalImageUrl = formData.imageUrl
      let finalPublicId = formData.cloudinaryPublicId // Start with existing publicId if editing

      if (formData.imageFile) {
        // Only upload if a new file is selected
        const { imageUrl, publicId } = await uploadImageMutation.mutateAsync(
          // Destructure publicId
          formData.imageFile
        )
        finalImageUrl = imageUrl
        finalPublicId = publicId // Update publicId with the new one
      } else if (!finalImageUrl && !editingEvent) {
        toast.error('Please upload an image for the event')
        return
      }

      const eventDataPayload = {
        id: editingEvent ? editingEvent.id : undefined,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        description: formData.description,
        imageUrl: finalImageUrl!,
        cloudinaryPublicId: finalPublicId!, // Send publicId to backend for deletion logic
        featured: formData.featured,
        speakers: formData.speakers.filter((speaker) => speaker.trim() !== ''),
      }

      if (editingEvent) {
        updateMutation.mutate(eventDataPayload as Event, {
          onSuccess: () => {
            toast.success('Event updated successfully')
            setShowForm(false)
            setEditingEvent(null)
            resetFormData()
          },
          onError: (err: unknown) => {
            const errorMessage =
              err && typeof err === 'object' && 'message' in err
                ? (err as { message?: string }).message
                : 'Failed to update event'
            toast.error(errorMessage)
          },
        })
      } else {
        createMutation.mutate(eventDataPayload, {
          onSuccess: () => {
            toast.success('Event created successfully')
            setShowForm(false)
            resetFormData()
          },
          onError: (err: unknown) => {
            const errorMessage =
              err && typeof err === 'object' && 'message' in err
                ? (err as { message?: string }).message
                : 'Failed to create event'
            toast.error(errorMessage)
          },
        })
      }
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message?: string }).message
          : 'Image operation failed'
      toast.error(errorMessage)
    }
  }

  const resetFormData = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      description: '',
      imageFile: null,
      featured: false,
      speakers: [''],
      cloudinaryPublicId: undefined, // Reset publicId
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, imageFile: e.target.files![0] }))
      // When a new file is selected, clear any existing publicId from formData
      // because the new upload will provide a new one.
      setFormData((prev) => ({ ...prev, cloudinaryPublicId: undefined }))
    }
  }

  const addSpeaker = () => {
    setFormData((prev) => ({ ...prev, speakers: [...prev.speakers, ''] }))
  }

  const removeSpeaker = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }))
  }

  const handleSpeakerChange = (index: number, value: string) => {
    const updatedSpeakers = [...formData.speakers]
    updatedSpeakers[index] = value
    setFormData((prev) => ({ ...prev, speakers: updatedSpeakers }))
  }

  const handleEditClick = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      imageFile: null,
      imageUrl: event.imageUrl,
      cloudinaryPublicId: event.cloudinaryPublicId, // Populate publicId from the existing event
      featured: event.featured,
      speakers: event.speakers.length > 0 ? event.speakers : [''],
    })
    setShowForm(true)
  }

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id)
    }
  }

  // --- CHANGES END HERE ---

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Events Management</h1>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setEditingEvent(null)
            resetFormData()
            setShowForm(true)
          }}
        >
          <Plus size={16} />
          Add New Event
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Event
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date / Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Registrations
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Loading events...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-red-500"
                >
                  Error loading events: {error.message}
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    <Search
                      size={48}
                      className="text-gray-300 mb-4"
                    />
                    <p className="text-gray-500 text-lg font-medium">
                      No events found
                    </p>
                    <p className="text-gray-400 mt-1">
                      Try adjusting your search or add a new event
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                        <img
                          className="h-10 w-10 object-cover"
                          src={event.imageUrl}
                          alt={event.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          {event.featured && (
                            <span className="bg-gold/20 text-divine-dark px-1.5 py-0.5 rounded-sm text-xs mr-2">
                              Featured
                            </span>
                          )}
                          {event.speakers.length} speaker
                          {event.speakers.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <Calendar
                        size={14}
                        className="text-gray-500 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDate(event.date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="text-gray-500 mt-0.5 flex-shrink-0"
                      />
                      <div className="text-sm text-gray-900">
                        {event.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users
                        size={14}
                        className="text-gray-500"
                      />
                      <span className="text-sm text-gray-900">
                        {event.registrations}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-divine hover:text-divine-dark mr-3"
                      onClick={() => handleEditClick(event)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables === event.id ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingEvent(null)
                  resetFormData()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event Date*
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event Time*
                  </label>
                  <input
                    type="text"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="e.g. 6:00 PM - 9:00 PM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location*
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter event location"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description*
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  placeholder="Enter event description"
                ></textarea>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {/* Display current image if editing and no new file selected */}
                    {formData.imageUrl && !formData.imageFile && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">Current Image:</p>
                        <img
                          src={formData.imageUrl}
                          alt="Current Event"
                          className="h-20 w-auto object-contain mx-auto"
                        />
                      </div>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="imageFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark"
                      >
                        <span>
                          {formData.imageUrl && !formData.imageFile
                            ? 'Change file'
                            : 'Upload a file'}
                        </span>
                        <input
                          id="imageFile"
                          name="imageFile"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 2MB
                    </p>
                    {formData.imageFile && (
                      <p className="text-sm text-divine-dark font-medium">
                        {formData.imageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-divine focus:ring-divine border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Mark as featured event
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speakers
                </label>

                {formData.speakers.map((speaker, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 mb-2"
                  >
                    <input
                      type="text"
                      value={speaker}
                      onChange={(e) =>
                        handleSpeakerChange(index, e.target.value)
                      }
                      placeholder="Speaker name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                    {formData.speakers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpeaker(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSpeaker}
                  className="mt-2 text-sm flex items-center gap-1 text-divine hover:text-divine-dark"
                >
                  <Plus size={14} />
                  Add Speaker
                </button>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingEvent(null)
                    resetFormData()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    uploadImageMutation.isPending
                  }
                  className="btn-primary flex items-center gap-2"
                >
                  {createMutation.isPending ||
                  updateMutation.isPending ||
                  uploadImageMutation.isPending ? (
                    <>
                      {editingEvent ? 'Updating Event...' : 'Creating Event...'}
                    </>
                  ) : (
                    <>
                      <Calendar size={16} />
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEventsList
