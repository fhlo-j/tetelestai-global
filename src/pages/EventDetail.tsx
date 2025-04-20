
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfAttendees: 1,
    specialRequests: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Registration successful! Check your email for confirmation.");
      // In a real app, you would submit this data to your backend
      console.log("Registration data:", formData);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        numberOfAttendees: 1,
        specialRequests: ''
      });
    }, 1500);
  };

  // Sample event data - in a real app, this would be fetched from an API
  const events = [
    {
      id: '1',
      title: 'Annual Worship Conference 2024',
      date: 'July 15-17, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Sanctuary, 123 Faith Street',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
      description: 'Join us for three days of powerful worship, teaching, and ministry as we seek God\'s presence together. This conference brings together anointed worship leaders and speakers from around the world to minister to your spirit and equip you for greater depths in God.',
      featured: true,
      speakers: ['Pastor Emmanuel Johnson', 'Minister Rebecca Adams', 'Worship Leader David Thompson']
    },
    {
      id: '2',
      title: 'Youth Revival Weekend',
      date: 'June 24-25, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Youth Center, 456 Hope Avenue',
      imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      description: 'A weekend dedicated to igniting passion for God in the next generation through worship, games, and ministry. This event is specifically designed for teenagers and young adults seeking authentic encounters with God.',
      featured: false,
      speakers: ['Youth Pastor Michael Roberts', 'Evangelist Sarah Williams']
    },
    // Additional events would be here...
  ];

  const event = events.find(event => event.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-20">
          <h2 className="text-2xl font-semibold mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/events')}
            className="btn-primary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Events
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 divine-gradient">
        <div className="container-custom">
          <button 
            onClick={() => navigate('/events')}
            className="text-white flex items-center gap-1 mb-6 hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Events
          </button>
          
          <h1 className="text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Details */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img 
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-80 object-cover rounded-lg mb-6"
              />
              
              <div className="prose max-w-none">
                <h2 className="text-divine mb-4">Event Details</h2>
                <p className="text-gray-700">{event.description}</p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Featured Speakers</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {event.speakers.map((speaker, index) => (
                      <li key={index} className="text-gray-700">{speaker}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Registration Form */}
            <div id="register" className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Register for this Event</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="numberOfAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Attendees*
                    </label>
                    <select
                      id="numberOfAttendees"
                      name="numberOfAttendees"
                      value={formData.numberOfAttendees}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                      <option value="more">More than 10</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Registering...' : 'Complete Registration'}
                    {!isSubmitting && <MessageSquare size={18} />}
                  </button>
                  
                  <p className="text-sm text-gray-500 text-center mt-2">
                    You'll receive a confirmation email after registration
                  </p>
                </div>
              </form>
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

export default EventDetail;
