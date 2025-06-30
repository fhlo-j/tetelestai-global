import { Sermon, SermonFormData } from '../data/types'

const API_URL = import.meta.env.VITE_API_URL
const SERMON_API_URL = `${API_URL}/api/sermons`
const UPLOAD_API_URL = `${API_URL}/api/upload`

// Helper to extract Cloudinary publicId
function getCloudinaryPublicIdFromUrl(url: string): string | null {
  if (!url) return null

  // Extract public ID from URL
  const urlParts = url.split('/')
  const publicIdWithExtension = urlParts.slice(-2).join('/') // Gets 'events/image-1750625103324'

  // Remove file extension if present
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '')

  return publicId
}

export const fetchSermonsApi = async (
  type: 'audio' | 'video'
): Promise<Sermon[]> => {
  const response = await fetch(`${SERMON_API_URL}?type=${type}`)
  if (!response.ok) throw new Error('Failed to fetch sermons')
  return await response.json()
}

export const fetchAllSermons = async (): Promise<Sermon[]> => {
  const response = await fetch(`${SERMON_API_URL}/all`) // Create this endpoint
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch sermons')
  }

  return result.data || []
}

export const fetchFeaturedSermons = async (): Promise<Sermon[]> => {
  const response = await fetch(`${SERMON_API_URL}/featured`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch featured sermons')
  }

  // Return the data array directly
  return result.data || []
}

export const deleteSermonApi = async (sermon: Sermon) => {
  // Delete associated media files first
  const deletePromises = []

  if (sermon.imageUrl) {
    const imagePublicId = getCloudinaryPublicIdFromUrl(sermon.imageUrl)
    if (imagePublicId) {
      deletePromises.push(
        fetch(`${UPLOAD_API_URL}/delete-media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId: imagePublicId,
            resourceType: 'image',
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete image: ${response.statusText}`)
          }
          return response.json()
        })
      )
    }
  }

  if (sermon.type === 'audio' && sermon.url) {
    const audioPublicId = getCloudinaryPublicIdFromUrl(sermon.url)
    if (audioPublicId) {
      deletePromises.push(
        fetch(`${UPLOAD_API_URL}/delete-media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId: audioPublicId,
            resourceType: 'video', // Cloudinary treats audio as video
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete audio: ${response.statusText}`)
          }
          return response.json()
        })
      )
    }
  }

  try {
    // Wait for all media deletions to complete
    await Promise.all(deletePromises)

    // Then delete the sermon record
    const response = await fetch(`${SERMON_API_URL}/${sermon.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete sermon record')
    }

    return await response.json()
  } catch (error) {
    console.error('Deletion error:', error)
    throw error
  }
}
export const saveSermonApi = async (
  formData: SermonFormData,
  type: 'audio' | 'video',
  editMode: boolean,
  existingSermon?: Sermon,
  keepOriginalThumbnail?: boolean,
  keepOriginalAudio?: boolean
) => {
  // Handle file uploads in parallel when possible
  const [thumbnailResult, mediaResult] = await Promise.all([
    handleThumbnailUpload(
      formData,
      editMode,
      existingSermon,
      keepOriginalThumbnail
    ),
    handleMediaUpload(
      formData,
      type,
      editMode,
      existingSermon,
      keepOriginalAudio
    ),
  ])
  const sermonData = {
    title: formData.title,
    speaker: formData.speaker,
    topic: formData.topic,
    description: formData.description,
    date: formData.date,
    imageUrl: thumbnailResult.url,
    imagePublicId: thumbnailResult.publicId,
    type,
    url: mediaResult.url,
    mediaPublicId: mediaResult.publicId || '',
    featured: formData.featured,
    transcript: formData.transcript,
    duration: formData.duration,
  }

  console.log('Final sermonData to be sent', sermonData)

  const url =
    editMode && formData.id
      ? `${SERMON_API_URL}/${formData.id}`
      : SERMON_API_URL

  const method = editMode ? 'PUT' : 'POST'

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sermonData),
  })

  if (!response.ok) {
    // Clean up uploaded files if sermon save failed
    if (thumbnailResult.isNew) {
      const publicId = getCloudinaryPublicIdFromUrl(thumbnailResult.url)
      if (publicId) {
        await fetch(`${UPLOAD_API_URL}/upload/delete-media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId,
            resourceType: 'image',
          }),
        })
      }
    }
    if (mediaResult.isNew) {
      const publicId = getCloudinaryPublicIdFromUrl(mediaResult.url)
      if (publicId) {
        await fetch(`${UPLOAD_API_URL}/delete-media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId,
            resourceType: type === 'audio' ? 'video' : 'image',
          }),
        })
      }
    }

    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to save sermon')
  }

  return response.json()
}
// Helper functions
async function handleThumbnailUpload(
  formData: SermonFormData,
  editMode: boolean,
  existingSermon?: Sermon,
  keepOriginal?: boolean
): Promise<{ url: string; publicId: string; isNew: boolean }> {
  console.log('[Thumbnail Upload] Starting process', {
    editMode,
    keepOriginal,
    hasThumbnail: !!formData.thumbnail,
    hasExistingSermon: !!existingSermon,
    existingImageUrl: existingSermon?.imageUrl,
    formDataImageUrl: formData.imageUrl,
  })

  // Keep original thumbnail if requested
  if (editMode && keepOriginal && existingSermon) {
    console.log('[Thumbnail Upload] Keeping original thumbnail')
    return {
      url: existingSermon.imageUrl,
      publicId: existingSermon.imagePublicId || '',
      isNew: false,
    }
  }

  // Handle new thumbnail upload
  if (formData.thumbnail) {
    console.log('[Thumbnail Upload] Uploading new thumbnail')
    const uploadForm = new FormData()
    uploadForm.append('image', formData.thumbnail)

    const response = await fetch(`${UPLOAD_API_URL}/image`, {
      method: 'POST',
      body: uploadForm,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Thumbnail upload failed')
    }

    const result = await response.json()
    console.log('[Thumbnail Upload] Upload successful', result)

    // Delete old thumbnail if needed
    if (editMode && existingSermon?.imagePublicId && !keepOriginal) {
      console.log('[Thumbnail Upload] Deleting old thumbnail')
      await fetch(`${UPLOAD_API_URL}/delete-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId: existingSermon.imagePublicId,
          resourceType: 'image',
        }),
      })
    }

    return {
      url: result.imageUrl,
      publicId: result.publicId,
      isNew: true,
    }
  }

  // Use existing thumbnail in edit mode
  if (editMode && existingSermon) {
    console.log('[Thumbnail Upload] Using existing thumbnail')
    return {
      url: existingSermon.imageUrl,
      publicId: existingSermon.imagePublicId || '',
      isNew: false,
    }
  }

  console.error('[Thumbnail Upload] Thumbnail required error', {
    formData,
    existingSermon,
    editMode,
    keepOriginal,
  })

  // Temporarily return empty values for debugging
  return {
    url: '',
    publicId: '',
    isNew: false,
  }

  // Throw error after debugging
  // throw new Error('Thumbnail is required')
}

async function handleMediaUpload(
  formData: SermonFormData,
  type: 'audio' | 'video',
  editMode: boolean,
  existingSermon?: Sermon,
  keepOriginal?: boolean
): Promise<{ url: string; publicId: string; isNew: boolean }> {
  // Handle keepOriginal case first
  if (editMode && keepOriginal && existingSermon) {
    return {
      url: existingSermon.url,
      publicId: existingSermon.mediaPublicId || '',
      isNew: false,
    }
  }

  // Handle audio upload
  if (type === 'audio') {
    // For new sermons OR when replacing audio in edit mode
    if (formData.mediaFile) {
      const uploadForm = new FormData()
      uploadForm.append('audio', formData.mediaFile)

      const response = await fetch(`${UPLOAD_API_URL}/audio`, {
        method: 'POST',
        body: uploadForm,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Audio upload failed')
      }

      const result = await response.json()

      // Delete old file if in edit mode and not keeping original
      if (editMode && existingSermon?.mediaPublicId && !keepOriginal) {
        await fetch(`${UPLOAD_API_URL}/delete-media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId: existingSermon.mediaPublicId,
            resourceType: 'video', // Cloudinary treats audio as video
          }),
        })
      }

      return {
        url: result.url,
        publicId: result.publicId,
        isNew: true,
      }
    }

    // For edit mode with existing audio
    if (editMode && existingSermon) {
      return {
        url: existingSermon.url,
        publicId: existingSermon.mediaPublicId || '',
        isNew: false,
      }
    }
  }

  // Handle video (YouTube URL)
  if (type === 'video') {
    if (!formData.youtubeUrl && (!editMode || !existingSermon?.url)) {
      throw new Error('YouTube URL is required')
    }
    return {
      url: formData.youtubeUrl || existingSermon?.url || '',
      publicId: existingSermon?.mediaPublicId || '',
      isNew: false,
    }
  }

  // Handle new audio sermon without file
  if (!editMode) {
    throw new Error('Audio file is required for new sermons')
  }

  // Fallback to existing media in edit mode
  if (editMode && existingSermon) {
    return {
      url: existingSermon.url,
      publicId: existingSermon.mediaPublicId || '',
      isNew: false,
    }
  }

  throw new Error(
    type === 'audio' ? 'Audio file is required' : 'YouTube URL is required'
  )
}

// services/apiSermons.ts
export const postComment = async ({
  sermonId,
  userName,
  userEmail,
  comment,
}: {
  sermonId: string
  userName: string
  userEmail: string
  comment: string
}) => {
  console.log('Posting comment:', { sermonId, userName, userEmail, comment })
  const response = await fetch(`${API_URL}/api/sermons/${sermonId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName, userEmail, comment }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to post comment')
  }

  return response.json()
}

export const deleteCommentApi = async (sermonId: string, commentId: string) => {
  const response = await fetch(
    `${SERMON_API_URL}/${sermonId}/comments/${commentId}`,
    { method: 'DELETE' }
  )
  if (!response.ok) throw new Error('Failed to delete comment')
}
