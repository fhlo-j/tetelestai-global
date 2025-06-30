import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Calendar, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import EventCard from '../components/EventCard'
import { useQuery } from '@tanstack/react-query' // Import useQuery
import { fetchEvents, Event } from '@/services/apiAdmin' // Import fetchEvents and Event interface
import { formatDate } from '@/utils/dateFormatter'

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [monthFilter, setMonthFilter] = useState('')

  // Use useQuery to fetch events from the backend
  const {
    data: fetchedEvents,
    isLoading,
    isError,
    error,
  } = useQuery<Event[]>({
    queryKey: ['publicEvents'], // Unique key for this query
    queryFn: fetchEvents, // Your API function to fetch events
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    // You might want to sort these events here, or in your backend
    select: (data) =>
      data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
  })

  // Derived state for filtering
  const filteredEvents = useMemo(() => {
    if (!fetchedEvents) return []

    let results = fetchedEvents

    // Filter by search term (title or location)
    if (searchTerm) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by month
    if (monthFilter) {
      results = results.filter((event) => {
        // Extract month name from event date string
        try {
          const eventDate = new Date(event.date)
          const eventMonthName = eventDate.toLocaleString('default', {
            month: 'long',
          })
          return eventMonthName.toLowerCase() === monthFilter.toLowerCase()
        } catch (e) {
          console.warn(
            `Could not parse date for event ${event.id}: ${event.date}`,
            e
          )
          return false // Exclude events with unparseable dates
        }
      })
    }

    return results
  }, [searchTerm, monthFilter, fetchedEvents])

  // Dynamically get unique months from fetched events for the filter dropdown
  const months = useMemo(() => {
    if (!fetchedEvents) return []
    const uniqueMonths = new Set<string>()
    fetchedEvents.forEach((event) => {
      try {
        const eventDate = new Date(event.date)
        uniqueMonths.add(eventDate.toLocaleString('default', { month: 'long' }))
      } catch (e) {
        // Handle invalid date format if necessary
        console.warn(`Invalid date format for event: ${event.date}`, e)
      }
    })
    return Array.from(uniqueMonths).sort((a, b) => {
      // Basic sorting for months (can be improved for chronological order)
      const monthOrder = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      return monthOrder.indexOf(a) - monthOrder.indexOf(b)
    })
  }, [fetchedEvents])

  const resetFilters = () => {
    setSearchTerm('')
    setMonthFilter('')
  }

  // Find the featured event from the fetched data
  const featuredEvent = useMemo(() => {
    return fetchedEvents?.find((event) => event.featured)
  }, [fetchedEvents])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-24 pb-12 relative">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6"
            alt="Events header background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h1 className="text-white mb-4">Events</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Join us for our upcoming events and be part of our community
          </p>
        </div>
      </div>

      {isLoading && (
        <section className="py-12 bg-divine-light text-center">
          <p className="text-gray-700">Loading events...</p>
        </section>
      )}

      {isError && (
        <section className="py-12 bg-red-100 text-center text-red-700">
          <p>
            Error loading events: {error?.message || 'Something went wrong.'}
          </p>
        </section>
      )}

      {!isLoading && !isError && featuredEvent && (
        <section className="py-12 bg-divine-light">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-divine mb-2">Featured Event</h2>
              <p className="text-gray-700">
                Don't miss our upcoming special event
              </p>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2">
                <div className="relative h-full">
                  <img
                    src={featuredEvent.imageUrl}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-black text-sm px-3 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col">
                  <h3 className="text-2xl font-semibold mb-2">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {featuredEvent.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar
                        size={18}
                        className="text-divine"
                      />
                      <div>
                        {/* Assuming date is formatted for display directly from backend, otherwise format here */}
                        <p className="font-medium">
                          {formatDate(featuredEvent.date)}
                        </p>
                        <p>{featuredEvent.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin
                        size={18}
                        className="text-divine"
                      />
                      <span>{featuredEvent.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex">
                    <a
                      href={`/events/${featuredEvent.id}#register`}
                      className="btn-primary flex items-center gap-2"
                    >
                      Register Now
                      <ChevronRight size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isLoading && !isError && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
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

                <div className="md:w-64">
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                  >
                    <option value="">All Months</option>
                    {months.map((month, index) => (
                      <option
                        key={index}
                        value={month}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-divine">
                  Upcoming Events
                </h2>
                <p className="text-gray-600">
                  {filteredEvents.length} events found
                </p>
              </div>

              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      _id={event.id}
                      {...event}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Filter
                    size={48}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <h3 className="text-xl font-medium mb-2">No Events Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={resetFilters}
                    className="btn-primary"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* <section className="py-16 divine-light-gradient">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-divine mb-4">Host Your Event With Us</h2>
                <p className="text-gray-700 mb-4">
                  Our facility is available for Christian conferences, weddings,
                  seminars, and other community events.
                </p>
                <p className="text-gray-700 mb-6">
                  With modern amenities, ample parking, and a central location,
                  Tetelestai Global Ministry Center is the perfect venue for
                  your next gathering.
                </p>
                <a
                  href="/contact#facility-booking"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Inquire About Booking
                  <ChevronRight size={18} />
                </a>
              </div>

              <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1473177104440-ffee2f376098"
                  alt="Ministry center facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <Newsletter />
      <Footer />
    </div>
  )
}

export default Events
