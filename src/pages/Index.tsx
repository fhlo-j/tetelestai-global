import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
} from "lucide-react";

import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import SermonCard from "../components/SermonCard";
import EventCard from "../components/EventCard";
import BlogCard from "../components/BlogCard";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import AnnouncementModal from "../components/AnnouncementModal";

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Sample data
  const featuredSermons = [
    {
      id: "1",
      title: "The Power of Divine Purpose",
      speaker: "Pastor Emmanuel Johnson",
      date: "June 12, 2024",
      duration: "45 min",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      featured: true,
      type: "video" as const,
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: "2",
      title: "Embracing God's Grace in Challenging Times",
      speaker: "Pastor Sarah Williams",
      date: "June 5, 2024",
      duration: "38 min",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      featured: false,
      type: "audio" as const,
      url: "https://soundbible.com/mp3/church-chime-daniel_simon.mp3",
    },
    {
      id: "3",
      title: "Finding Rest in God's Presence",
      speaker: "Elder David Thompson",
      date: "May 29, 2024",
      duration: "42 min",
      imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
      featured: false,
      type: "audio" as const,
      url: "https://soundbible.com/mp3/church-chime-daniel_simon.mp3",
    },
  ];

  const upcomingEvents = [
    {
      id: "1",
      title: "Annual Worship Conference 2024",
      date: "July 15-17, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Main Sanctuary",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
      featured: true,
    },
    {
      id: "2",
      title: "Youth Revival Weekend",
      date: "June 24-25, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Youth Center",
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      featured: false,
    },
  ];

  const latestPosts = [
    {
      id: "1",
      title: "Finding Your Purpose in Christ",
      excerpt:
        "Discover how to align your life with God's unique purpose for you and fulfill your divine destiny.",
      author: "Pastor Emmanuel Johnson",
      date: "June 10, 2024",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      featured: true,
    },
    {
      id: "2",
      title: "5 Biblical Principles for Spiritual Growth",
      excerpt:
        "Learn practical steps from scripture to deepen your relationship with God and grow spiritually.",
      author: "Minister Rebecca Adams",
      date: "June 3, 2024",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      featured: false,
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Ministry data
  const ministries = [
    {
      icon: Church,
      title: "Worship",
      desc: "Engaging the presence of God through anointed praise and worship.",
      image: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
      id: "worship",
    },
    {
      icon: Book,
      title: "Teaching",
      desc: "In-depth biblical teaching that transforms lives and renews minds.",
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552",
      id: "teaching",
    },
    {
      icon: Users,
      title: "Community",
      desc: "Building strong relationships and fostering spiritual growth.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      id: "community",
    },
    {
      icon: Heart,
      title: "Outreach",
      desc: "Extending God's love through humanitarian efforts and evangelism.",
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840",
      id: "outreach",
    },
  ];

  // Open Google Maps location
  const openGoogleMaps = () => {
    window.open(
      "https://maps.google.com/?q=123+Faith+Avenue,+City+Center",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Announcement Modal */}
      <AnnouncementModal />

      {/* Welcome Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center"
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-divine mb-4">
                Welcome to <span className="text-gold">Tetelestai</span> Global
              </h2>
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
              <Link
                to="/about"
                className="btn-primary inline-flex items-center gap-2"
              >
                Learn More About Us
                <ChevronRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="relative rounded-lg overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1473177104440-ffee2f376098"
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
      </section>

      {/* Key Ministries Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-divine mb-4">Our Key Ministries</h2>
            <p className="text-gray-700">
              Tetelestai Global serves through various ministry arms, each
              dedicated to a specific area of spiritual growth and community
              impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ministries.map((ministry, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all group overflow-hidden"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={ministry.image}
                    alt={ministry.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4">
                      <div className="inline-flex items-center justify-center rounded-full bg-white p-3 mb-2 text-divine">
                        <ministry.icon size={20} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {ministry.title}
                      </h3>
                    </div>
                  </div>
                </div>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sermons */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-divine mb-2">Featured Sermons</h2>
              <p className="text-gray-600">
                Listen to our latest spirit-filled messages
              </p>
            </div>
            <Link
              to="/sermons"
              className="mt-4 md:mt-0 btn-secondary flex items-center gap-2"
            >
              <Play size={16} />
              View All Sermons
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSermons.map((sermon) => (
              <SermonCard key={sermon.id} {...sermon} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 divine-gradient text-white">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us This Sunday for a Divine Encounter
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Experience the power of God's presence as we worship together and
              receive life-changing messages from His Word.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/service-times"
                className="btn-gold flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Service Times
              </Link>
              <button
                onClick={openGoogleMaps}
                className="bg-white text-divine hover:bg-gray-100 px-6 py-2.5 rounded-md transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <MapPin size={18} />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-divine mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Join us at our next gathering</p>
            </div>
            <Link
              to="/events"
              className="mt-4 md:mt-0 btn-secondary flex items-center gap-2"
            >
              <Calendar size={16} />
              View All Events
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-divine mb-2">
                Latest Inspirational Articles
              </h2>
              <p className="text-gray-600">
                Spiritual insights to encourage your faith journey
              </p>
            </div>
            <Link
              to="/blog"
              className="mt-4 md:mt-0 btn-secondary flex items-center gap-2"
            >
              <Bookmark size={16} />
              Read Our Blog
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
