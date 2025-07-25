import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Play,
  Calendar,
  Book,
  Church,
  Heart,
  Users,
  Bookmark,
  MapPin,
} from 'lucide-react'

import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import SermonCard from '../components/SermonCard'
import EventCard from '../components/EventCard'
import BlogCard from '../components/BlogCard'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import AnnouncementModal from '../components/AnnouncementModal'
import { fetchMinistries } from '@/hooks/useMinistries'
import { useQuery } from '@tanstack/react-query'
import { fetchEvents, fetchUpcomingEvents } from '@/services/apiUser'
import { fetchFeaturedSermons } from '@/services/apiSermons'

// Reusable Animated Section Component
const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: 'easeOut',
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated Header Component
const AnimatedHeader = ({ children, className = '' }) => (
  <motion.div
    className={`inline-block relative ${className}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-50px' }}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    }}
  >
    <h2 className="text-divine mb-4 inline-block">{children}</h2>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: 'easeOut',
      }}
      className="absolute bottom-0 left-0 w-full h-1 bg-gold origin-left"
      style={{ transformOrigin: 'left' }}
    />
  </motion.div>
)

// Animated Button Component
const AnimatedButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
)

const Index = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  // Animation variants with compatible easing
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: 'easeOut',
      },
    },
  }

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  // Sample data (can be replaced by fetched data later if needed)
  // In your homepage component
  const {
    data: featuredSermons = [],
    error: sermonsError,
    isLoading: isSermonsLoading,
  } = useQuery({
    queryKey: ['featured-sermons'],
    queryFn: fetchFeaturedSermons,
  })

  const latestPosts = [
    {
      id: '1',
      title: 'Finding Your Purpose in Christ',
      excerpt:
        "Discover how to align your life with God's unique purpose for you and fulfill your divine destiny.",
      author: 'Pastor Emmanuel Johnson',
      date: 'June 10, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      featured: true,
    },
    {
      id: '2',
      title: '5 Biblical Principles for Spiritual Growth',
      excerpt:
        'Learn practical steps from scripture to deepen your relationship with God and grow spiritually.',
      author: 'Minister Rebecca Adams',
      date: 'June 3, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      featured: false,
    },
  ]

  const { data: ministries = [], error: ministriesError } = useQuery({
    queryKey: ['ministries'], // Check this key, usually 'ministries' or similar
    queryFn: fetchMinistries,
  })

  const {
    data: upcomingEvents,
    isLoading: eventsLoading,
    isError: eventsError,
    error: eventsFetchError, // Renamed 'error' to avoid conflict with 'ministriesError'
  } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: fetchUpcomingEvents,
  })

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

  const openGoogleMaps = () => {
    window.open(
      'https://maps.google.com/?q=123+Faith+Avenue,+City+Center',
      '_blank'
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <Hero />
      </motion.div>

      <AnnouncementModal />

      {/* Welcome Section */}
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center"
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <AnimatedHeader>
                Welcome to <span className="text-gold">Tetelestai</span> Global
              </AnimatedHeader>
              <p className="text-gray-700 mb-6">
                Tetelestai Global is a spirit-filled ministry dedicated to
                spreading the gospel of Jesus Christ. Our mission is to empower
                believers to fulfill their divine purpose and destiny through
                the Word of God.
              </p>
              <p className="text-gray-700 mb-6">
                "Tetelestai" — meaning "It is finished" in Greek — was Jesus'
                final declaration on the cross, signifying the completion of
                God's redemptive work. We carry this powerful message of
                salvation, healing, and deliverance to the nations.
              </p>
              <AnimatedButton
                as={Link}
                to="/about"
                className="btn-primary inline-flex items-center gap-2"
              >
                Learn More About Us
                <ChevronRight size={18} />
              </AnimatedButton>
            </motion.div>

            <motion.div
              variants={fadeIn}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
              className="relative rounded-lg overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1611955966220-a65cb70eb34b?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Tetelestai Global Ministry"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-divine/80 to-transparent flex items-end p-6">
                <blockquote className="text-white text-lg font-medium italic">
                  "For it is finished, and we are complete in Him."
                </blockquote>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Key Ministries Section */}
      <AnimatedSection className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <AnimatedHeader className="text-center">
              Our Key Ministries
            </AnimatedHeader>
            <motion.p
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              Tetelestai Global serves through various ministry arms, each
              dedicated to a specific area of spiritual growth and community
              impact.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {/* Conditional check for ministries data */}
            {ministriesError ? (
              <div className="col-span-full text-center text-red-600">
                Error loading ministries.
              </div>
            ) : ministries.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No ministries available at the moment.
              </div>
            ) : (
              ministries.map((ministry, index) => (
                <motion.div
                  key={ministry.id || index} // Use ministry.id if available, fallback to index
                  className="bg-white rounded-lg shadow-md overflow-hidden group"
                  variants={cardAnimation}
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="h-48 overflow-hidden relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <img
                      src={ministry.imageUrl}
                      alt={ministry.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4">
                        <motion.div
                          className="inline-flex items-center justify-center rounded-full bg-white p-3 mb-2 text-divine"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          {/* You need to pass the actual icon component here, e.g., <Church size={20} /> */}
                          {/* If ministry.icon is a string representing a component name, you'd need a mapping */}
                          {/* For now, a placeholder icon or remove if not dynamically handled */}
                          <Church size={20} />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white">
                          {ministry.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                  <div className="p-4">
                    <p className="text-gray-600 mb-4">{ministry.desc}</p>
                    <Link
                      to={`/ministry/${ministry.id}`}
                      className="text-divine hover:text-divine-dark font-medium text-sm inline-flex items-center group"
                    >
                      Learn More
                      <ChevronRight
                        size={16}
                        className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Featured Sermons */}
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <AnimatedHeader>Featured Sermons</AnimatedHeader>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={loaded ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                Listen to our latest spirit-filled messages
              </motion.p>
            </div>
            <AnimatedButton
              as={Link}
              to="/sermons"
              className="mt-4 md:mt-0 btn-secondary flex items-center gap-2"
            >
              <Play size={16} />
              View All Sermons
            </AnimatedButton>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {featuredSermons.map((sermon) => (
              <motion.div
                key={sermon.id}
                variants={cardAnimation}
              >
                <SermonCard {...sermon} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection className="py-20 divine-gradient text-white">
        <div className="container-custom text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us Every First Saturday Of The Month for a Divine Encounter
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Experience the power of God's presence as we worship together and
              receive life-changing messages from His Word.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                as={Link}
                to="/service-times"
                className="btn-gold flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Service Times
              </AnimatedButton>
              <AnimatedButton
                onClick={openGoogleMaps}
                className="bg-white text-divine hover:bg-gray-100 px-6 py-2.5 rounded-md flex items-center justify-center gap-2"
              >
                <MapPin size={18} />
                Get Directions
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Upcoming Events */}
      <AnimatedSection className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <AnimatedHeader>Upcoming Events</AnimatedHeader>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={loaded ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                Join us at our next gathering
              </motion.p>
            </div>
            <Link to="/events">
              <AnimatedButton
                as={Link}
                to="/events"
                className="mt-4 md:mt-0 btn-secondary flex items-center gap-2"
              >
                <Calendar size={16} />
                View All Events
              </AnimatedButton>
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {/* --- FIX IS HERE --- */}
            {eventsLoading ? (
              <div className="col-span-full text-center text-gray-500">
                Loading upcoming events...
              </div>
            ) : eventsError ? (
              <div className="col-span-full text-center text-red-600">
                Error loading events: {eventsFetchError?.message}
              </div>
            ) : !upcomingEvents || upcomingEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex flex-col items-center justify-center text-gray-500 max-w-md mx-auto">
                  <Calendar
                    className="mb-4"
                    size={40}
                    strokeWidth={1.2}
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-sm">
                    We're currently preparing our next gathering. Please check
                    back soon or explore past events.
                  </p>
                </div>
              </div>
            ) : (
              events.map((event) => (
                <motion.div
                  key={event._id}
                  variants={cardAnimation}
                >
                  <EventCard {...event} />
                </motion.div>
              ))
            )}
            {/* --- END FIX --- */}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Blog Section */}
      {/* <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <AnimatedHeader>Latest Inspirational Articles</AnimatedHeader>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={loaded ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                Spiritual insights to encourage your faith journey
              </motion.p>
            </div>
            <AnimatedButton
              as={Link}
              to="/blog"
              className="mt-4 md:mt-0 btn-secondary flex items-center gap-2"
            >
              <Bookmark size={16} />
              Read Our Blog
            </AnimatedButton>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {latestPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={cardAnimation}
              >
                <BlogCard {...post} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection> */}

      {/* Newsletter Section */}
      {/* <AnimatedSection>
        <Newsletter />
      </AnimatedSection> */}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Index
