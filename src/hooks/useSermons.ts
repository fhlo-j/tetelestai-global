import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchSermonsApi,
  deleteSermonApi,
  saveSermonApi,
  deleteCommentApi,
  postComment,
} from '../services/apiSermons'
import { Sermon, SermonFormData } from '../data/types'

export const useSermons = (type: 'audio' | 'video') => {
  const queryClient = useQueryClient()

  const API_URL = import.meta.env.VITE_API_URL
  const UPLOAD_API_URL = `${API_URL}/api/upload`

  // Fetch sermons with automatic retries and caching
  const {
    data: sermons = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery<Sermon[], Error>({
    queryKey: ['sermons', type],
    queryFn: () => fetchSermonsApi(type),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  })

  const uploadThumbnailMutation = useMutation<
    { url: string; publicId: string },
    Error,
    FormData
  >({
    mutationFn: async (formData) => {
      const response = await fetch(`${UPLOAD_API_URL}/image`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Thumbnail upload failed')
      }
      return response.json()
    },
  })

  const uploadAudioMutation = useMutation<
    {
      success: boolean
      url: string
      publicId: string
      message: string
    },
    Error,
    FormData
  >({
    mutationFn: async (formData) => {
      const response = await fetch(`${UPLOAD_API_URL}/audio`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Audio upload failed')
      }

      return data
    },
  })

  // Create sermon mutation with optimistic updates
  const createSermonMutation = useMutation<Sermon, Error, SermonFormData>({
    mutationFn: (formData) => saveSermonApi(formData, type, false),
    onMutate: async (newSermon) => {
      await queryClient.cancelQueries({ queryKey: ['sermons', type] })

      const previousSermons = queryClient.getQueryData<Sermon[]>([
        'sermons',
        type,
      ])

      const optimisticSermon: Sermon = {
        ...newSermon,
        _id: Date.now().toString(), // Add _id for optimistic update
        id: Date.now().toString(),
        type,
        imageUrl: '',
        url: '',
        comments: [],
        date: newSermon.date || new Date().toISOString().split('T')[0],
        duration: newSermon.duration || '',
        isOptimistic: true,
      }

      queryClient.setQueryData<Sermon[]>(['sermons', type], (old = []) => [
        ...old,
        optimisticSermon,
      ])

      return { previousSermons }
    },
    onSuccess: (savedSermon, _, context) => {
      queryClient.setQueryData<Sermon[]>(['sermons', type], (old = []) =>
        old.map((sermon) => (sermon.isOptimistic ? savedSermon : sermon))
      )
      toast.success(`${type === 'video' ? 'Video' : 'Audio'} sermon created`)
    },
    onError: (err, _, context: { previousSermons?: Sermon[] } | undefined) => {
      toast.error(`Failed to create sermon: ${err.message}`)
      if (context?.previousSermons) {
        queryClient.setQueryData(['sermons', type], context.previousSermons)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons', type] })
    },
  })

  // Update sermon mutation with optimistic updates
  const updateSermonMutation = useMutation<
    Sermon,
    Error,
    {
      formData: SermonFormData
      existingSermon: Sermon
      keepOriginalThumbnail: boolean
      keepOriginalAudio: boolean
    }
  >({
    mutationFn: ({
      formData,
      existingSermon,
      keepOriginalThumbnail,
      keepOriginalAudio,
    }) =>
      saveSermonApi(
        formData,
        type,
        true,
        existingSermon,
        keepOriginalThumbnail,
        keepOriginalAudio
      ),
    onMutate: async ({ formData, existingSermon }) => {
      await queryClient.cancelQueries({ queryKey: ['sermons', type] })

      const previousSermons = queryClient.getQueryData<Sermon[]>([
        'sermons',
        type,
      ])

      queryClient.setQueryData<Sermon[]>(['sermons', type], (old = []) =>
        old.map((sermon) =>
          sermon.id === existingSermon.id
            ? { ...sermon, ...formData, isUpdating: true }
            : sermon
        )
      )

      return { previousSermons }
    },
    onSuccess: (updatedSermon, { existingSermon }) => {
      queryClient.setQueryData<Sermon[]>(['sermons', type], (old = []) =>
        old.map((sermon) =>
          sermon.id === existingSermon.id ? updatedSermon : sermon
        )
      )
      toast.success(`${type === 'video' ? 'Video' : 'Audio'} sermon updated`)
    },
    onError: (
      err,
      { existingSermon },
      context: { previousSermons?: Sermon[] } | undefined
    ) => {
      toast.error(`Failed to update sermon: ${err.message}`)
      if (context?.previousSermons) {
        queryClient.setQueryData(['sermons', type], context.previousSermons)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons', type] })
    },
  })

  // Delete sermon mutation with optimistic updates
  const deleteSermonMutation = useMutation<void, Error, Sermon>({
    mutationFn: deleteSermonApi,
    onMutate: async (sermonToDelete) => {
      await queryClient.cancelQueries({ queryKey: ['sermons', type] })
      const previousSermons = queryClient.getQueryData<Sermon[]>([
        'sermons',
        type,
      ])

      queryClient.setQueryData<Sermon[]>(['sermons', type], (old = []) =>
        old.filter((sermon) => sermon.id !== sermonToDelete.id)
      )

      return { previousSermons }
    },
    onError: (
      err,
      sermonToDelete,
      context: { previousSermons?: Sermon[] } | undefined
    ) => {
      toast.error(`Failed to delete sermon: ${err.message}`)
      if (context?.previousSermons) {
        queryClient.setQueryData(['sermons', type], context.previousSermons)
      }
    },
    onSuccess: () => {
      toast.success(`${type === 'video' ? 'Video' : 'Audio'} sermon deleted`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons', type] })
    },
  })

  // Delete comment mutation
  const deleteCommentMutation = useMutation<
    void,
    Error,
    { sermonId: string; commentId: string }
  >({
    mutationFn: ({ sermonId, commentId }) =>
      deleteCommentApi(sermonId, commentId),
    onSuccess: (_, { sermonId }) => {
      queryClient.invalidateQueries({ queryKey: ['sermons', type] })
      queryClient.invalidateQueries({ queryKey: ['sermon', sermonId] })
      toast.success('Comment deleted successfully')
    },
    onError: (err) => {
      toast.error(`Failed to delete comment: ${err.message}`)
    },
  })

  // In your useSermons hook's return statement
  return {
    sermons,
    isLoading,
    isError,
    error,
    isFetching,

    isCreating: createSermonMutation.isPending,
    isUpdating: updateSermonMutation.isPending,
    isDeleting: deleteSermonMutation.isPending,
    isUploadingThumbnail: uploadThumbnailMutation.isPending, // Add this
    isUploadingMedia: uploadAudioMutation.isPending, // Add this
    createSermon: createSermonMutation.mutateAsync,
    updateSermon: updateSermonMutation.mutateAsync,
    deleteSermon: deleteSermonMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    uploadThumbnail: uploadThumbnailMutation.mutateAsync,
    uploadAudio: uploadAudioMutation.mutateAsync,
    refetchSermons: refetch,
  }
}

export const usePostComment = (sermonId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentData: {
      userName: string
      userEmail: string
      comment: string
    }) => postComment({ sermonId, ...commentData }),

    // Optional optimistic update
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['all-sermons'] })

      const previousSermons = queryClient.getQueryData(['all-sermons'])

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['all-sermons'], (old: any = []) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        old.map((sermon: any) =>
          sermon.id === sermonId
            ? {
                ...sermon,
                comments: [
                  ...(sermon.comments || []),
                  {
                    ...newComment,
                    _id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : sermon
        )
      )

      return { previousSermons }
    },

    onError: (err, newComment, context) => {
      queryClient.setQueryData(['all-sermons'], context?.previousSermons)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sermons'] })
    },
  })
}
