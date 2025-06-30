// components/AdminServiceTimes.tsx
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Calendar, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

// React Query imports
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios' // For making API requests

// --- CONSTANTS ---
// Ensure this matches your backend URL. VITE_API_URL should be "http://localhost:5001"
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const SERVICE_TIMES_API = `${API_URL}/api/servicetimes`
const UPLOAD_API = `${API_URL}/api/upload/image` // Your image upload endpoint

const serviceTypes = ['weekly', 'monthly', 'special']
const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

// --- INTERFACES ---
interface ServiceTime {
  _id: string // MongoDB will use _id
  type: string
  name: string // Changed from 'title' to 'name' to match model field
  day: string
  time: string
  description: string
  location: string
  imageUrl?: string // Optional image URL
  cloudinaryPublicId?: string // Optional Cloudinary Public ID
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

interface ServiceTimeFormInput {
  name: string
  type: string
  day: string
  time: string
  description: string
  location: string
  imageUrl?: string // Add to form input
  cloudinaryPublicId?: string // Add to form input
}

const AdminServiceTimes = () => {
  const queryClient = useQueryClient()

  const [selectedType, setSelectedType] = useState('weekly')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceTime | null>(null)
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(
    null
  )

  // Form state
  const [serviceName, setServiceName] = useState('')
  const [serviceDay, setServiceDay] = useState('Sunday')
  const [serviceTime, setServiceTime] = useState('')
  const [serviceDesc, setServiceDesc] = useState('')
  const [serviceLocation, setServiceLocation] = useState('')
  const [serviceType, setServiceType] = useState('weekly')
  // New image states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  // --- REACT QUERY HOOKS ---

  // Fetch all service times
  const {
    data: serviceTimes,
    isLoading,
    isError,
    error,
  } = useQuery<ServiceTime[], Error>({
    queryKey: ['serviceTimes'],
    queryFn: async () => {
      const response = await axios.get(SERVICE_TIMES_API)
      return response.data.data
    },
  })

  // Image Upload Mutation
  const uploadImageMutation = useMutation<
    { imageUrl: string; publicId: string }, // Response type
    Error,
    FormData // Input type
  >({
    mutationFn: async (formData) => {
      const response = await axios.post(UPLOAD_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onError: (err) => {
      toast({
        title: 'Image upload failed',
        description: err.message || 'Could not upload image to Cloudinary.',
        variant: 'destructive',
      })
    },
  })

  // Create/Add a service time
  const createServiceTimeMutation = useMutation<
    ServiceTime,
    Error,
    ServiceTimeFormInput
  >({
    mutationFn: async (newService) => {
      const response = await axios.post(SERVICE_TIMES_API, newService)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTimes'] })
      toast({
        title: 'Service added',
        description: 'New service time has been added.',
      })
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (err) => {
      toast({
        title: 'Error adding service',
        description: err.message || 'Failed to add service time.',
        variant: 'destructive',
      })
    },
  })

  // Update a service time
  const updateServiceTimeMutation = useMutation<
    ServiceTime,
    Error,
    { id: string; updates: ServiceTimeFormInput }
  >({
    mutationFn: async ({ id, updates }) => {
      const response = await axios.put(`${SERVICE_TIMES_API}/${id}`, updates)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTimes'] })
      toast({
        title: 'Service updated',
        description: 'The service time has been updated.',
      })
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (err) => {
      toast({
        title: 'Error updating service',
        description: err.message || 'Failed to update service time.',
        variant: 'destructive',
      })
    },
  })

  // Delete a service time
  const deleteServiceTimeMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      // The backend model middleware will handle Cloudinary deletion
      await axios.delete(`${SERVICE_TIMES_API}/${id}`)
      return
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTimes'] })
      toast({
        title: 'Service time deleted',
        description: 'The service time has been removed.',
      })
      setIsDeleteDialogOpen(false)
      setDeletingServiceId(null)
    },
    onError: (err) => {
      toast({
        title: 'Error deleting service',
        description: err.message || 'Failed to delete service time.',
        variant: 'destructive',
      })
    },
  })

  // --- LOCAL STATE & HANDLERS ---
  const filteredServices =
    serviceTimes?.filter((service) => service.type === selectedType) || []

  const handleAddNew = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (service: ServiceTime) => {
    setEditingService(service)
    setServiceName(service.name)
    setServiceDay(service.day)
    setServiceTime(service.time)
    setServiceDesc(service.description)
    setServiceLocation(service.location)
    setServiceType(service.type)
    setImageFile(null) // Clear file input
    setPreviewImageUrl(service.imageUrl || null) // Set existing image for preview
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingServiceId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingServiceId) {
      deleteServiceTimeMutation.mutate(deletingServiceId)
    }
  }

  const resetForm = () => {
    setEditingService(null)
    setServiceName('')
    setServiceDay('Sunday')
    setServiceTime('')
    setServiceDesc('')
    setServiceLocation('')
    setServiceType('weekly')
    setImageFile(null)
    setPreviewImageUrl(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewImageUrl(URL.createObjectURL(file)) // Create local URL for preview
    } else {
      setImageFile(null)
      setPreviewImageUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!serviceName || !serviceDay || !serviceTime || !serviceLocation) {
      toast({
        title: 'Missing fields',
        description:
          'Please fill in all required fields (Name, Day, Time, Location).',
        variant: 'destructive',
      })
      return
    }

    let uploadedImageUrl: string | undefined = editingService?.imageUrl
    let uploadedPublicId: string | undefined =
      editingService?.cloudinaryPublicId

    // If a new image file is selected, upload it
    if (imageFile) {
      const formData = new FormData()
      formData.append('image', imageFile)

      try {
        const uploadResult = await uploadImageMutation.mutateAsync(formData)
        uploadedImageUrl = uploadResult.imageUrl
        uploadedPublicId = uploadResult.publicId
      } catch (uploadError) {
        // The onError handler for uploadImageMutation already shows a toast.
        // We can stop here or let the user try to save without an image.
        // For now, we'll stop the submission.
        return
      }
    } else if (editingService && !previewImageUrl) {
      // If it's an edit and the user explicitly cleared the image (no new file, no preview),
      // then clear existing image data.
      uploadedImageUrl = ''
      uploadedPublicId = ''
    }

    const serviceData: ServiceTimeFormInput = {
      name: serviceName,
      type: serviceType,
      day: serviceDay,
      time: serviceTime,
      description: serviceDesc,
      location: serviceLocation,
      imageUrl: uploadedImageUrl,
      cloudinaryPublicId: uploadedPublicId,
    }

    if (editingService) {
      updateServiceTimeMutation.mutate({
        id: editingService._id,
        updates: serviceData,
      })
    } else {
      createServiceTimeMutation.mutate(serviceData)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Service Times</h1>
          <p className="text-gray-500">
            Manage church service schedules and activities
          </p>
        </div>

        <Button
          className="bg-divine hover:bg-divine/90"
          onClick={handleAddNew}
          disabled={createServiceTimeMutation.isPending}
        >
          <Plus
            size={16}
            className="mr-2"
          />
          Add New Service
        </Button>
      </div>

      <Tabs
        defaultValue="weekly"
        value={selectedType}
        onValueChange={setSelectedType}
      >
        <TabsList className="mb-4">
          {serviceTypes.map((type) => (
            <TabsTrigger
              key={type}
              value={type}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Services
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">
                Loading service times...
              </div>
            ) : isError ? (
              <div className="text-center py-10 text-red-600">
                Error loading service times: {error?.message}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No {selectedType} services found. Click "Add New Service" to
                create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead> {/* New TableHead */}
                    <TableHead>Service Name</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {service.name}
                        <p className="font-normal text-xs text-gray-500 mt-1">
                          {service.description}
                        </p>
                      </TableCell>
                      <TableCell>{service.day}</TableCell>
                      <TableCell>{service.time}</TableCell>
                      <TableCell>{service.location}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(service)}
                            disabled={updateServiceTimeMutation.isPending}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(service._id)}
                            className="text-destructive"
                            disabled={deleteServiceTimeMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Add/Edit Service Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={serviceType}
                onValueChange={setServiceType}
              >
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceName">Service Name*</Label>
              <Input
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., Sunday Worship Service"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceDay">Day*</Label>
                {serviceType === 'weekly' ? (
                  <Select
                    value={serviceDay}
                    onValueChange={setServiceDay}
                  >
                    <SelectTrigger id="serviceDay">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day) => (
                        <SelectItem
                          key={day}
                          value={day}
                        >
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="serviceDay"
                    value={serviceDay}
                    onChange={(e) => setServiceDay(e.target.value)}
                    placeholder={
                      serviceType === 'monthly'
                        ? 'e.g., First Sunday'
                        : 'e.g., December 25'
                    }
                    required
                  />
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="serviceTime">Time*</Label>
                <Input
                  id="serviceTime"
                  value={serviceTime}
                  onChange={(e) => setServiceTime(e.target.value)}
                  placeholder="e.g., 10:00 AM"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceLocation">Location*</Label>
              <Input
                id="serviceLocation"
                value={serviceLocation}
                onChange={(e) => setServiceLocation(e.target.value)}
                placeholder="e.g., Main Sanctuary"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceDesc">Description</Label>
              <Textarea
                id="serviceDesc"
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                placeholder="Brief description of the service"
                rows={3}
              />
            </div>

            {/* Image Upload Input */}
            <div className="grid gap-2">
              <Label htmlFor="serviceImage">Service Image</Label>
              <Input
                id="serviceImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImageUrl && (
                <div className="mt-2 relative w-32 h-32">
                  <img
                    src={previewImageUrl}
                    alt="Image Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  {/* Option to clear image */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 p-1 text-white bg-black/50 hover:bg-black/70 rounded-full"
                    onClick={() => {
                      setImageFile(null)
                      setPreviewImageUrl(null)
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
                disabled={
                  createServiceTimeMutation.isPending ||
                  updateServiceTimeMutation.isPending ||
                  uploadImageMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-divine hover:bg-divine/90"
                disabled={
                  createServiceTimeMutation.isPending ||
                  updateServiceTimeMutation.isPending ||
                  uploadImageMutation.isPending // Disable submit while image is uploading
                }
              >
                {editingService
                  ? updateServiceTimeMutation.isPending ||
                    uploadImageMutation.isPending
                    ? 'Updating...'
                    : 'Update Service'
                  : createServiceTimeMutation.isPending ||
                    uploadImageMutation.isPending
                  ? 'Adding...'
                  : 'Add Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Service Time</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this service time? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteServiceTimeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteServiceTimeMutation.isPending}
            >
              {deleteServiceTimeMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminServiceTimes
