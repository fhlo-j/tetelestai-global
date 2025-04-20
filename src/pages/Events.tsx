
import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronRight, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import EventCard from '../components/EventCard';

const Events = () => {
  // State for events and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  // Sample event data
  const events = [
    {
      id: '1',
      title: 'Annual Worship Conference 2024',
      date: 'July 15-17, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
      description: 'Join us for three days of powerful worship, teaching, and ministry as we seek God\'s presence together.',
      featured: true,
      month: 'July'
    },
    {
      id: '2',
      title: 'Youth Revival Weekend',
      date: 'June 24-25, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Youth Center',
      imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      description: 'A weekend dedicated to igniting passion for God in the next generation through worship, games, and ministry.',
      featured: false,
      month: 'June'
    },
    {
      id: '3',
      title: 'Women\'s Prayer Breakfast',
      date: 'June 18, 2024',
      time: '8:00 AM - 11:00 AM',
      location: 'Fellowship Hall',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      description: 'A time of fellowship, prayer, and encouragement for women of all ages.',
      featured: false,
      month: 'June'
    },
    {
      id: '4',
      title: 'Men\'s Retreat: Warriors of Faith',
      date: 'August 5-7, 2024',
      time: 'All Day',
      location: 'Mountain Retreat Center',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      description: 'A transformative weekend for men to grow in their faith, build brotherhood, and encounter God.',
      featured: false,
      month: 'August'
    },
    {
      id: '5',
      title: 'Healing and Deliverance Service',
      date: 'June 30, 2024',
      time: '6:00 PM - 8:30 PM',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
      description: 'A special service dedicated to ministering healing and deliverance through prayer and the power of God.',
      featured: false,
      month: 'June'
    },
    {
      id: '6',
      title: 'Back to School Prayer Service',
      date: 'August 28, 2024',
      time: '7:00 PM - 8:30 PM',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      description: 'Join us as we pray for students, teachers, and staff for the upcoming school year.',
      featured: false,
      month: 'August'
    }
  ];

  // Get unique months for filtering
  const months = [...new Set(events.map(event => event.month))];

  // Filter events based on search and month filter
  useEffect(() => {
    let results = events;
    
    if (searchTerm) {
      results = results.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (monthFilter) {
      results = results.filter(event => event.month === monthFilter);
    }
    
    setFilteredEvents(results);
  }, [searchTerm, monthFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setMonthFilter("");
  };

  // Featured event (first one marked as featured)
  const featuredEvent = events.find(event => event.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 divine-gradient">
        <div className="container-custom text-center">
          <h1 className="text-white mb-4">Events</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Join us for upcoming services, conferences, and gatherings
          </p>
        </div>
      </div>
      
      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-12 bg-divine-light">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-divine mb-2">Featured Event</h2>
              <p className="text-gray-700">Don't miss our upcoming special event</p>
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
                  <h3 className="text-2xl font-semibold mb-2">{featuredEvent.title}</h3>
                  <p className="text-gray-700 mb-4">{featuredEvent.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={18} className="text-divine" />
                      <div>
                        <p className="font-medium">{featuredEvent.date}</p>
                        <p>{featuredEvent.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={18} className="text-divine" />
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
      
      {/* Events Collection */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Search and Filters */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    <option key={index} value={month}>{month}</option>
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
          
          {/* Events Grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-divine">Upcoming Events</h2>
              <p className="text-gray-600">{filteredEvents.length} events found</p>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Filter size={48} className="mx-auto text-gray-400 mb-4" />
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
      
      {/* Host Your Event */}
      <section className="py-16 divine-light-gradient">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-divine mb-4">Host Your Event With Us</h2>
                <p className="text-gray-700 mb-4">
                  Our facility is available for Christian conferences, weddings, seminars, and other community events.
                </p>
                <p className="text-gray-700 mb-6">
                  With modern amenities, ample parking, and a central location, Tetelestai Global
                  Ministry Center is the perfect venue for your next gathering.
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
      </section>
      
      {/* Newsletter Section */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Events;
