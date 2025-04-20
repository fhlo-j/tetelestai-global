
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ServiceTimes = () => {
  // Sample data for service times and activities
  const weeklyServices = [
    {
      id: 1,
      name: 'Sunday Morning Worship',
      day: 'Sunday',
      time: '9:00 AM - 11:30 AM',
      description: 'Our main worship service with powerful praise, worship and the Word.',
      location: '123 Faith Avenue, City Center',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e'
    },
    {
      id: 2,
      name: 'Wednesday Bible Study',
      day: 'Wednesday',
      time: '6:30 PM - 8:00 PM',
      description: 'In-depth biblical teaching and group discussions.',
      location: '123 Faith Avenue, City Center',
      imageUrl: 'https://images.unsplash.com/photo-1551038247-3d9af20df552'
    },
    {
      id: 3,
      name: 'Friday Prayer Meeting',
      day: 'Friday',
      time: '7:00 PM - 8:30 PM',
      description: 'Dedicated time for corporate prayer and intercession.',
      location: '123 Faith Avenue, City Center',
      imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8'
    }
  ];

  const monthlyActivities = [
    {
      id: 4,
      name: 'First Sunday Communion',
      date: 'First Sunday of every month',
      time: 'During Morning Service',
      description: 'Holy communion service remembering the sacrifice of Christ.',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    },
    {
      id: 5,
      name: 'Youth Night',
      date: 'Last Saturday of every month',
      time: '5:00 PM - 9:00 PM',
      description: 'Fellowship, games, worship and teaching for young adults.',
      location: 'Youth Center',
      imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22'
    },
    {
      id: 6,
      name: 'Community Outreach',
      date: 'Second Saturday of every month',
      time: '10:00 AM - 2:00 PM',
      description: 'Serving our local community through various outreach programs.',
      location: 'Varies (check announcements)',
      imageUrl: 'https://images.unsplash.com/photo-1524230572899-a752b3835840'
    }
  ];

  const upcomingSpecialEvents = [
    {
      id: 7,
      name: 'Summer Bible Conference',
      date: 'July 15-17, 2024',
      time: '9:00 AM - 5:00 PM daily',
      description: 'Annual Bible conference with guest speakers and powerful worship.',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'
    },
    {
      id: 8,
      name: 'Worship Night',
      date: 'August 5, 2024',
      time: '6:00 PM - 9:00 PM',
      description: 'A night dedicated to praise and worship.',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098'
    }
  ];

  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=123+Faith+Avenue,+City+Center', '_blank');
  };

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
            Join us for worship, teaching, fellowship and outreach activities throughout the week.
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
          
          <Tabs defaultValue="weekly" className="space-y-8">
            <TabsList className="flex justify-center">
              <TabsTrigger value="weekly">Weekly Services</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Activities</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Special Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="space-y-6">
              {weeklyServices.map(service => (
                <motion.div 
                  key={service.id}
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
                      <h3 className="text-xl font-semibold text-divine mb-2">{service.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar size={16} />
                        <span>{service.day}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Clock size={16} />
                        <span>{service.time}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{service.description}</p>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-divine" />
                        <span>{service.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-6">
              {monthlyActivities.map(activity => (
                <motion.div 
                  key={activity.id}
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
                      <h3 className="text-xl font-semibold text-divine mb-2">{activity.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar size={16} />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Clock size={16} />
                        <span>{activity.time}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{activity.description}</p>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-divine" />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-6">
              {upcomingSpecialEvents.map(event => (
                <motion.div 
                  key={event.id}
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
                      <h3 className="text-xl font-semibold text-divine mb-2">{event.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Clock size={16} />
                        <span>{event.time}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-divine" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceTimes;
