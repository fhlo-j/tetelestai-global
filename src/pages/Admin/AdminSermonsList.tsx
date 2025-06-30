import { useState } from 'react'
import {
  Trash2,
  Edit,
  Plus,
  Search,
  UploadCloud,
  X,
  Video,
  Music,
  Download,
  MessageSquare,
  Eye,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { Sermon, SermonFormData } from '../../data/types'
import { useSermons } from '../../hooks/useSermons'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { formatDate } from '@/utils/dateFormatter'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

interface AdminSermonsListProps {
  type: 'audio' | 'video'
}

const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio')
    audio.preload = 'metadata'

    audio.onloadedmetadata = () => {
      resolve(audio.duration)
    }

    audio.onerror = (e) => reject('Failed to load audio file')

    audio.src = URL.createObjectURL(file)
  })
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const AdminSermonsList = ({ type }: AdminSermonsListProps) => {
  const {
    sermons,
    isLoading,
    isError,
    error,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    isUploadingThumbnail,
    isUploadingMedia,
    createSermon,
    updateSermon,
    deleteSermon,
    deleteComment,
    refetchSermons,
    uploadThumbnail,
    uploadAudio,
  } = useSermons(type)

  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSermonId, setSelectedSermonId] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  // const [isUploading, setIsUploading] = useState(false);
  const [mediaType] = useState<'audio' | 'video'>(type)

  const initialFormState: SermonFormData = {
    title: '',
    speaker: '',
    topic: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    thumbnail: null,
    mediaFile: null,
    youtubeUrl: '',
    transcript: '',
    featured: false,
  }

  const [formData, setFormData] = useState<SermonFormData>(initialFormState)

  // Update your handleFileChange function
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'thumbnail' | 'mediaFile'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (fieldName === 'thumbnail' && !file.type.startsWith('image/')) {
        toast.error('Please upload an image file for thumbnail')
        return
      }

      if (fieldName === 'mediaFile') {
        if (type === 'audio' && !file.type.startsWith('audio/')) {
          toast.error('Please upload an audio file')
          return
        }
        if (type === 'video' && !file.type.startsWith('video/')) {
          toast.error('Please upload a video file')
          return
        }
      }

      // Set file and preview
      if (fieldName === 'thumbnail') {
        setThumbnailFile(file)
        setThumbnailPreview(URL.createObjectURL(file))
        setFormData((prev) => ({ ...prev, thumbnail: file })) // Update formData
      } else {
        setMediaFile(file)
        setFormData((prev) => ({ ...prev, mediaFile: file })) // Update formData
      }
    }
  }

  const filteredSermons =
    sermons?.filter(
      (sermon) =>
        sermon.type === type &&
        (sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sermon.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || []

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleEdit = (id: string) => {
    const sermonToEdit = sermons?.find((sermon) => sermon.id === id)
    if (sermonToEdit) {
      setFormData({
        id: sermonToEdit.id,
        title: sermonToEdit.title,
        speaker: sermonToEdit.speaker,
        topic: sermonToEdit.topic,
        description: sermonToEdit.description,
        date: new Date(sermonToEdit.date).toISOString().split('T')[0],
        thumbnail: null,
        mediaFile: null,
        youtubeUrl: sermonToEdit.type === 'video' ? sermonToEdit.url : '',
        transcript: sermonToEdit.transcript,
        featured: sermonToEdit.featured || false,
        url: sermonToEdit.url, // Preserve existing URL
        mediaPublicId: sermonToEdit.mediaPublicId,
        imagePublicId: sermonToEdit.imagePublicId,
        imageUrl: sermonToEdit.imageUrl, // Add existing image URL
      })
      setThumbnailPreview(sermonToEdit.imageUrl || null)
      setEditMode(true)
      setShowForm(true)
    }
  }

  const handleDeleteClick = (id: string) => {
    setSelectedSermonId(id)
    setShowDeleteConfirm(true)
  }

  const handleShowComments = (id: string) => {
    setSelectedSermonId(id)
    setShowComments(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!selectedSermonId) return
    const sermonToDelete = sermons?.find(
      (sermon) => sermon.id === selectedSermonId
    )
    if (sermonToDelete) {
      await deleteSermon(sermonToDelete)
    }
    setShowDeleteConfirm(false)
    setSelectedSermonId(null)
  }

  const handleDeleteCommentClick = async (
    sermonId: string,
    commentId: string
  ) => {
    await deleteComment({ sermonId, commentId })
  }

  const validateForm = (): boolean => {
    const errors = []

    // Common required fields
    if (!formData.title.trim()) errors.push('Title is required')
    if (!formData.speaker.trim()) errors.push('Speaker is required')
    if (!formData.topic.trim()) errors.push('Topic is required')
    if (!formData.date) errors.push('Date is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (!formData.transcript.trim()) errors.push('Transcript is required')

    // Thumbnail validation
    if (!editMode && !formData.thumbnail) {
      errors.push('Thumbnail image is required')
    }
    // For edits, allow existing thumbnail
    if (editMode && !thumbnailPreview && !formData.imageUrl) {
      errors.push('Thumbnail image is required')
    }

    // Media validation based on type
    if (type === 'audio') {
      // For new sermons, audio file is required
      if (!editMode && !formData.mediaFile) {
        errors.push('Audio file is required')
      }
      // For edits, either keep existing audio or upload new one
      if (editMode && !formData.url && !formData.mediaFile) {
        errors.push('Either keep existing audio or upload a new one')
      }
      // Validate audio file type if uploading new one
      if (formData.mediaFile && !formData.mediaFile.type.startsWith('audio/')) {
        errors.push('Please upload a valid audio file (MP3, WAV, etc.)')
      }
      // Validate audio file size (max 20MB)
      if (formData.mediaFile && formData.mediaFile.size > 20 * 1024 * 1024) {
        errors.push('Audio file must be smaller than 20MB')
      }
    } else {
      // Video validation
      if (!formData.youtubeUrl.trim()) {
        errors.push('YouTube URL is required')
      } else if (
        !formData.youtubeUrl.includes('youtube.com') &&
        !formData.youtubeUrl.includes('youtu.be')
      ) {
        errors.push('Please enter a valid YouTube URL')
      }
    }

    // Date validation
    if (formData.date) {
      const sermonDate = new Date(formData.date)
      const currentDate = new Date()
      if (sermonDate > currentDate) {
        errors.push('Sermon date cannot be in the future')
      }
    }

    // Description length validation
    if (formData.description.trim().length < 20) {
      errors.push('Description should be at least 20 characters')
    }

    // Transcript length validation
    if (formData.transcript.trim().length < 50) {
      errors.push('Transcript should be at least 50 characters')
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error))
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const sermonData: SermonFormData & {
        id?: string
        duration?: string
        removeExistingAudio?: boolean
        removeExistingThumbnail?: boolean
        existingThumbnailPublicId?: string
        existingAudioPublicId?: string
      } = {
        id: formData.id,
        title: formData.title,
        speaker: formData.speaker,
        topic: formData.topic,
        description: formData.description,
        date: formData.date,
        featured: formData.featured,
        transcript: formData.transcript,
        thumbnail: formData.thumbnail ?? null,
        mediaFile: formData.mediaFile ?? null,
        youtubeUrl: formData.youtubeUrl,
        imageUrl: formData.imageUrl, // Preserve existing image URL
        url: formData.url, // Preserve existing URL
        mediaPublicId: formData.mediaPublicId, // Preserve existing public ID
      }

      // Handle audio duration for new uploads
      if (type === 'audio' && formData.mediaFile) {
        const duration = await getAudioDuration(formData.mediaFile)
        sermonData.duration = formatDuration(duration)
      }

      // Handle thumbnail changes in edit mode
      if (editMode) {
        if (!thumbnailPreview && !formData.imageUrl) {
          sermonData.removeExistingThumbnail = true
        }
        // If keeping existing thumbnail
        else if (formData.imageUrl && !formData.thumbnail) {
          sermonData.existingThumbnailPublicId = formData.imagePublicId
        }

        // If audio was removed
        if (type === 'audio' && !formData.url && !formData.mediaFile) {
          sermonData.removeExistingAudio = true
        }
        // If keeping existing audio
        else if (type === 'audio' && formData.url && !formData.mediaFile) {
          sermonData.existingAudioPublicId = formData.mediaPublicId
        }
      }

      if (editMode && formData.id) {
        const existingSermon = sermons.find((s) => s.id === formData.id)
        if (existingSermon) {
          await updateSermon({
            formData: sermonData,
            existingSermon,
            keepOriginalThumbnail: !formData.thumbnail && !!thumbnailPreview,
            keepOriginalAudio:
              type === 'audio' && !formData.mediaFile && !!formData.url,
          })
        }
      } else {
        await createSermon(sermonData)
      }

      setShowForm(false)
      setFormData(initialFormState)
      setThumbnailPreview(null)
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to save sermon'
      )
    }
  }

  const isSubmitting =
    isCreating || isUpdating || isUploadingThumbnail || isUploadingMedia

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-divine" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        <p>Error loading sermons: {error.message}</p>
        <button
          onClick={() => refetchSermons()}
          className="mt-2 px-4 py-2 bg-divine text-white rounded hover:bg-divine-dark"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {type === 'video' ? 'Video' : 'Audio'} Sermons
          {isFetching && (
            <span className="ml-2 text-sm text-gray-500">
              <Loader2 className="inline animate-spin h-4 w-4" /> Updating...
            </span>
          )}
        </h1>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setEditMode(false)
            setFormData(initialFormState) // Reset form data
            setThumbnailPreview(null) // Clear thumbnail preview
            setThumbnailFile(null) // Clear thumbnail file
            setMediaFile(null) // Clear media file
            setShowForm(true)
          }}
          disabled={isFetching}
        >
          <Plus size={16} />
          Add {type === 'video' ? 'Video' : 'Audio'} Sermon
        </button>
      </div>

      {/* Search and table code remains the same as your original */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={`Search ${
              type === 'video' ? 'video' : 'audio'
            } sermons...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sermon
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Speaker / Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Topic
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Duration
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
            {filteredSermons.map((sermon) => (
              <tr
                key={sermon.title}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                      <img
                        className="h-10 w-10 object-cover"
                        src={sermon.imageUrl}
                        alt={sermon.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {sermon.title}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        {sermon.type === 'video' ? (
                          <Video
                            size={12}
                            className="mr-1"
                          />
                        ) : (
                          <Music
                            size={12}
                            className="mr-1"
                          />
                        )}
                        {sermon.type === 'video' ? 'Video' : 'Audio'} Sermon
                        {sermon.featured && (
                          <span className="ml-2 bg-gold/20 text-divine-dark px-1.5 py-0.5 rounded-sm text-xs">
                            Featured
                          </span>
                        )}
                        <button
                          onClick={() => handleShowComments(sermon.id)}
                          className="ml-2 flex items-center gap-1 text-divine hover:text-divine-dark"
                          title="View comments"
                        >
                          <MessageSquare size={12} />
                          {sermon.comments.length}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sermon.speaker}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(sermon.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {sermon.topic}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sermon.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/sermons/${sermon.id}`}
                    target="_blank"
                    className="text-divine hover:text-divine-dark mr-3"
                    title="View sermon"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    className="text-divine hover:text-divine-dark mr-3"
                    onClick={() => handleEdit(sermon.id)}
                    title="Edit sermon"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(sermon.id)}
                    title="Delete sermon"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSermons.length === 0 && (
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
                      No sermons found
                    </p>
                    <p className="text-gray-400 mt-1">
                      Try adjusting your search or add a new sermon
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form modal with loading state */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editMode
                  ? `Edit ${type === 'video' ? 'Video' : 'Audio'} Sermon`
                  : `Add New ${type === 'video' ? 'Video' : 'Audio'} Sermon`}
              </h2>
              <button
                onClick={() => !isSubmitting && setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              {/* Form fields remain the same as your original */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sermon Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter sermon title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="speaker"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Speaker*
                  </label>
                  <input
                    type="text"
                    name="speaker"
                    id="speaker"
                    value={formData.speaker}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter speaker name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Topic*
                  </label>
                  <input
                    type="text"
                    name="topic"
                    id="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter sermon topic"
                  />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sermon Date*
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
                  placeholder="Enter sermon description"
                ></textarea>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="transcript"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Transcript*
                </label>
                <textarea
                  name="transcript"
                  id="transcript"
                  value={formData.transcript}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  placeholder="Enter sermon transcript"
                ></textarea>
              </div>

              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-divine border-gray-300 rounded focus:ring-divine"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Feature this sermon
                </label>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image{editMode ? '' : '*'}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="thumbnail"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark"
                        >
                          <span>Upload a file</span>
                          <input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleFileChange(e, 'thumbnail')}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 2MB
                      </p>
                      // In the form thumbnail section:
                      {thumbnailPreview ? (
                        <div className="mt-2 relative">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="h-32 w-full object-contain rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnailFile(null)
                              setThumbnailPreview(null)
                              setFormData((prev) => ({
                                ...prev,
                                thumbnail: null,
                                imageUrl: editMode ? prev.imageUrl : '', // Preserve existing URL in edit mode
                              }))
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : editMode && formData.imageUrl ? (
                        <div className="mt-2 relative">
                          <img
                            src={formData.imageUrl}
                            alt="Existing thumbnail"
                            className="h-32 w-full object-contain rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                imageUrl: '', // Clear imageUrl to indicate removal
                              }))
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {type === 'audio' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Audio File{editMode ? '' : '*'}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center w-full">
                        {/* Show existing audio if in edit mode */}
                        {editMode && formData.url && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Current Audio:
                            </p>
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <audio
                                controls
                                className="w-full max-w-xs"
                              >
                                <source
                                  src={formData.url}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                              </audio>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    url: '',
                                    mediaPublicId: '',
                                  }))
                                }}
                                className="ml-4 text-red-500 hover:text-red-700"
                                title="Remove current audio"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Remove the current audio to upload a new one
                            </p>
                          </div>
                        )}

                        {/* Upload new audio section */}
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="mediaFile"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="mediaFile"
                              name="mediaFile"
                              type="file"
                              accept="audio/*"
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, 'mediaFile')}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          MP3, WAV up to 20MB
                        </p>
                        {formData.mediaFile && (
                          <p className="text-sm text-divine-dark font-medium">
                            {formData.mediaFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="youtubeUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      YouTube Video URL{editMode ? '' : '*'}
                    </label>
                    <input
                      type="text"
                      name="youtubeUrl"
                      id="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                      placeholder="Enter YouTube video URL"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Example: https://www.youtube.com/watch?v=XXXXXX
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      {editMode ? 'Updating...' : 'Uploading...'}
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      {editMode ? 'Update' : 'Upload'} Sermon
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal with loading state */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Sermon</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this sermon? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments modal */}
      {showComments && selectedSermonId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Comments for "
                  {sermons.find((s) => s.id === selectedSermonId)?.title}"
                </h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {sermons.find((s) => s.id === selectedSermonId)?.comments
                .length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sermons
                    .find((s) => s.id === selectedSermonId)
                    ?.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{comment.userName}</p>
                            <p className="text-sm text-gray-500">
                              {comment.userEmail}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(comment.date)}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteCommentClick(
                                selectedSermonId,
                                comment._id
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                            title="Delete comment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowComments(false)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSermonsList
