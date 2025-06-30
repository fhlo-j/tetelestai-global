import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query' // Import useQuery
import axios from 'axios' // Import axios for fetching data
import { formatDate } from '@/utils/dateFormatter'

// --- Interfaces for fetched data ---
interface ServiceTime {
  _id: string // Add _id since it's from MongoDB
  name: string
  type: 'weekly' | 'monthly' | 'special' // Assuming you'll add a 'type' field
  day?: string // Optional, for weekly services (e.g., "Sunday", "Wednesday")
  date?: string // Optional, for monthly/special events (e.g., "First Sunday", "July 15-17, 2024")
  time: string
  description: string
  location: string
  imageUrl: string
  cloudinaryPublicId?: string // Optional, for Cloudinary management
}

const API_URL = import.meta.env.VITE_API_URL

const ServiceTimes = () => {
  // --- Data Fetching with useQuery ---
  const {
    data: fetchedServices,
    isLoading,
    isError,
    error,
  } = useQuery<ServiceTime[], Error>({
    queryKey: ['serviceTimes'], // Unique key for this query
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/servicetimes`)
      return response.data.data // Assuming your API returns { success: true, data: [...] }
    },
  })

  // --- Filter and categorize services ---
  // You might need to adjust this logic based on how you categorize
  // "monthly activities" and "upcoming special events" in your backend.
  // For now, I'm using a 'type' field which you'll need to add to your backend
  // ServiceTime model and ensure is set when creating/updating services.

  const weeklyServices =
    fetchedServices?.filter((service) => service.type === 'weekly') || []
  const monthlyActivities =
    fetchedServices?.filter((service) => service.type === 'monthly') || []
  const upcomingSpecialEvents =
    fetchedServices?.filter((service) => service.type === 'special') || []

  const openGoogleMaps = () => {
    window.open(
      'https://maps.google.com/?q=123+Faith+Avenue,+City+Center',
      '_blank'
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading service times...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading services: {error?.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1492321936769-b49830bc1d1e"
            alt="Service Times Header"
            className="w-full h-[40vh] object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>

        <Navbar />

        <div className="relative z-10 container-custom pt-32 pb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mb-4"
          >
            Service Times & Activities
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-white/90 max-w-2xl mx-auto"
          >
            Join us for worship, teaching, fellowship and outreach activities
            throughout the week.
          </motion.p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 py-16">
        <div className="container-custom">
          <div className="flex justify-center mb-8">
            <button
              onClick={openGoogleMaps}
              className="flex items-center gap-2 px-6 py-3 bg-divine text-white rounded-md hover:bg-divine-dark transition-colors"
            >
              <MapPin size={18} />
              Get Directions
            </button>
          </div>

          <Tabs
            defaultValue="weekly"
            className="space-y-8"
          >
            <TabsList className="flex justify-center">
              <TabsTrigger value="weekly">Weekly Services</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Activities</TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming Special Events
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="weekly"
              className="space-y-6"
            >
              {weeklyServices.length > 0 ? (
                weeklyServices.map((service) => (
                  <motion.div
                    key={service._id} // Use _id from MongoDB
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-xl font-semibold text-divine mb-2">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar size={16} />
                          <span>{service.day}</span> {/* Use service.day */}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <Clock size={16} />
                          <span>{service.time}</span>
                        </div>
                        <p className="text-gray-700 mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin
                            size={16}
                            className="text-divine"
                          />
                          <span>{service.location}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No weekly services found.
                </p>
              )}
            </TabsContent>

            <TabsContent
              value="monthly"
              className="space-y-6"
            >
              {monthlyActivities.length > 0 ? (
                monthlyActivities.map((activity) => (
                  <motion.div
                    key={activity._id} // Use _id from MongoDB
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={activity.imageUrl}
                          alt={activity.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-xl font-semibold text-divine mb-2">
                          {activity.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar size={16} />
                          <span>{formatDate(activity.date)}</span>{' '}
                          {/* Use activity.date */}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <Clock size={16} />
                          <span>{activity.time}</span>
                        </div>
                        <p className="text-gray-700 mb-4">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin
                            size={16}
                            className="text-divine"
                          />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No monthly activities found.
                </p>
              )}
            </TabsContent>

            <TabsContent
              value="upcoming"
              className="space-y-6"
            >
              {upcomingSpecialEvents.length > 0 ? (
                upcomingSpecialEvents.map((event) => (
                  <motion.div
                    key={event._id} // Use _id from MongoDB
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-xl font-semibold text-divine mb-2">
                          {event.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar size={16} />
                          <span>{event.date}</span> {/* Use event.date */}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <Clock size={16} />
                          <span>{event.time}</span>
                        </div>
                        <p className="text-gray-700 mb-4">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin
                            size={16}
                            className="text-divine"
                          />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No upcoming special events found.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ServiceTimes
