// types.ts
export interface SermonFormData {
  id?: string
  title: string
  speaker: string
  topic: string
  description: string
  date: string
  thumbnail: File | null
  mediaFile: File | null
  youtubeUrl?: string
  duration?: string
  transcript: string
  featured: boolean
  mediaPublicId?: string
  url?: string // Existing media URL
  imageUrl?: string // Existing thumbnail URL
  imagePublicId?: string // Existing thumbnail public ID
}

export interface Comment {
  _id: string
  comment: string
  id: string
  userName: string
  userEmail: string
  content: string
  date: string
}

export interface Sermon {
  _id: string // MongoDB ObjectId as string
  id: string
  title: string
  speaker: string
  date: string
  topic: string
  duration: string
  imageUrl: string // Now always Cloudinary URL
  type: 'audio' | 'video'
  url: string // Cloudinary URL for audio, YouTube URL for video
  featured?: boolean
  transcript: string
  description: string
  isOptimistic?: boolean // Add this as optional
  isUpdating?: boolean // Add this as optional
  comments: Comment[]
  uploadThumbnail?: boolean // Optional for edit mode
  uploadAudio?: boolean // Optional for edit mode
  mediaPublicId?: string // Optional for video sermons
  imagePublicId?: string // Optional for thumbnail
}
