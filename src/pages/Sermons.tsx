
import { useState, useEffect } from 'react';
import { Search, Filter, Play, Calendar, Video, Music, Bookmark } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import SermonCard from '../components/SermonCard';

const Sermons = () => {
  // State for sermons and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredSermons, setFilteredSermons] = useState<any[]>([]);

  // Sample sermon data
  const sermons = [
    {
      id: '1',
      title: 'The Power of Divine Purpose',
      speaker: 'Pastor Emmanuel Johnson',
      date: 'June 12, 2024',
      topic: 'Purpose',
      duration: '45 min',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      featured: true,
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Embracing God\'s Grace in Challenging Times',
      speaker: 'Pastor Sarah Williams',
      date: 'June 5, 2024',
      topic: 'Grace',
      duration: '38 min',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      featured: false,
      type: 'audio',
      url: 'https://soundbible.com/mp3/church-chime-daniel_simon.mp3'
    },
    {
      id: '3',
      title: 'Finding Rest in God\'s Presence',
      speaker: 'Elder David Thompson',
      date: 'May 29, 2024',
      topic: 'Rest',
      duration: '42 min',
      imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
      featured: false,
      type: 'audio',
      url: 'https://soundbible.com/mp3/church-chime-daniel_simon.mp3'
    },
    {
      id: '4',
      title: 'The Finished Work of Christ',
      speaker: 'Pastor Emmanuel Johnson',
      date: 'May 22, 2024',
      topic: 'Salvation',
      duration: '47 min',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
      featured: false,
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '5',
      title: 'Walking in the Spirit',
      speaker: 'Pastor Sarah Williams',
      date: 'May 15, 2024',
      topic: 'Holy Spirit',
      duration: '41 min',
      imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      featured: false,
      type: 'audio',
      url: 'https://soundbible.com/mp3/church-chime-daniel_simon.mp3'
    },
    {
      id: '6',
      title: 'Overcoming Through Faith',
      speaker: 'Elder David Thompson',
      date: 'May 8, 2024',
      topic: 'Faith',
      duration: '39 min',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      featured: false,
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  // Get unique speakers, topics, and dates for filters
  const speakers = [...new Set(sermons.map(sermon => sermon.speaker))];
  const topics = [...new Set(sermons.map(sermon => sermon.topic))];
  const dates = [...new Set(sermons.map(sermon => sermon.date))];

  // Filter sermons based on search, filter criteria, and active tab
  useEffect(() => {
    let results = sermons;
    
    if (searchTerm) {
      results = results.filter(sermon => 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpeaker) {
      results = results.filter(sermon => sermon.speaker === selectedSpeaker);
    }
    
    if (selectedTopic) {
      results = results.filter(sermon => sermon.topic === selectedTopic);
    }
    
    if (selectedDate) {
      results = results.filter(sermon => sermon.date === selectedDate);
    }
    
    if (activeTab !== 'all') {
      results = results.filter(sermon => sermon.type === activeTab);
    }
    
    setFilteredSermons(results);
  }, [searchTerm, selectedSpeaker, selectedTopic, selectedDate, activeTab]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSpeaker("");
    setSelectedTopic("");
    setSelectedDate("");
  };

  // Featured sermon (first one marked as featured)
  const featuredSermon = sermons.find(sermon => sermon.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Page Header with Background Image */}
      <div className="pt-24 pb-12 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1473177104440-ffee2f376098" 
            alt="Sermons header background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h1 className="text-white mb-4">Sermons</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Listen to spirit-filled messages that will inspire and transform your life
          </p>
        </div>
      </div>
      
      {/* Featured Sermon */}
      {featuredSermon && (
        <section className="py-12 bg-divine-light">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-divine mb-2">Sermon of the Week</h2>
              <p className="text-gray-700">Our most recent featured message</p>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
              <div className="relative">
                <img 
                  src={featuredSermon.imageUrl} 
                  alt="Featured sermon" 
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div className="w-full text-white">
                    <div className="flex items-center justify-between">
                      <span className="bg-gold text-black text-sm px-3 py-1 rounded-full font-medium">
                        Featured
                      </span>
                      <div className="flex items-center gap-2">
                        <Play size={14} />
                        <span className="text-sm">{featuredSermon.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <a href={`/sermons/${featuredSermon.id}`} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-divine/80 hover:bg-divine text-white rounded-full p-6 transition-colors">
                  <Play size={32} className="ml-1" />
                </a>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{featuredSermon.title}</h3>
                <p className="text-gray-700 mb-4">
                  Discover how to align your life with God's purpose and fulfill your divine destiny in this powerful message.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{featuredSermon.speaker}</p>
                    <p className="text-sm text-gray-500">{featuredSermon.date}</p>
                  </div>
                  <a href={`/sermons/${featuredSermon.id}`} className="btn-primary">
                    Watch Full Sermon
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Sermon Collection */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Search and Filters */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sermons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                />
              </div>
              
              <button 
                onClick={resetFilters}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2"
              >
                Clear Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                <select
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                >
                  <option value="">All Speakers</option>
                  {speakers.map((speaker, index) => (
                    <option key={index} value={speaker}>{speaker}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                >
                  <option value="">All Topics</option>
                  {topics.map((topic, index) => (
                    <option key={index} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                >
                  <option value="">All Dates</option>
                  {dates.map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Tabs for Audio/Video */}
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-divine">All Sermons</h2>
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-1">
                  <Bookmark size={16} />
                  All
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-1">
                  <Video size={16} />
                  Video
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-1">
                  <Music size={16} />
                  Audio
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {filteredSermons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSermons.map((sermon) => (
                    <SermonCard key={sermon.id} {...sermon} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Filter size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Sermons Found</h3>
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
            </TabsContent>
            
            <TabsContent value="video" className="mt-0">
              {filteredSermons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSermons.map((sermon) => (
                    <SermonCard key={sermon.id} {...sermon} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Video size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Video Sermons Found</h3>
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
            </TabsContent>
            
            <TabsContent value="audio" className="mt-0">
              {filteredSermons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSermons.map((sermon) => (
                    <SermonCard key={sermon.id} {...sermon} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Music size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Audio Sermons Found</h3>
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
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 divine-gradient text-white">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us This Sunday for a Divine Encounter</h2>
            <p className="text-white/90 text-lg mb-8">
              Experience the power of God's presence as we worship together and receive life-changing messages from His Word.
            </p>
            <button className="btn-gold flex items-center justify-center gap-2 mx-auto">
              <Calendar size={18} />
              View Service Times
            </button>
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

export default Sermons;
