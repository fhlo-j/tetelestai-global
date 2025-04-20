
import { useState } from 'react';
import { Trash2, Edit, Plus, Search, UploadCloud, X, Users, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageFile: File | null;
  featured: boolean;
  speakers: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  description: string;
  featured?: boolean;
  registrations: number;
  speakers: string[];
}

const AdminEventsList = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    description: '',
    imageFile: null,
    featured: false,
    speakers: [''],
  });

  // Sample events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Annual Worship Conference 2024',
      date: 'July 15-17, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
      description: 'Join us for three days of powerful worship, teaching, and ministry as we seek God\'s presence together.',
      featured: true,
      registrations: 32,
      speakers: ['Pastor Emmanuel Johnson', 'Minister Rebecca Adams', 'Worship Leader David Thompson']
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
      registrations: 19,
      speakers: ['Youth Pastor Michael Roberts', 'Evangelist Sarah Williams']
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
      registrations: 24,
      speakers: ['Sister Mary Johnson', 'Evangelist Ruth Thompson']
    }
  ];

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const addSpeaker = () => {
    setFormData(prev => ({ ...prev, speakers: [...prev.speakers, ''] }));
  };

  const removeSpeaker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const handleSpeakerChange = (index: number, value: string) => {
    const updatedSpeakers = [...formData.speakers];
    updatedSpeakers[index] = value;
    setFormData(prev => ({ ...prev, speakers: updatedSpeakers }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate the form
    let isValid = true;
    const requiredFields = ['title', 'date', 'time', 'location', 'description'];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof EventFormData]) {
        toast.error(`Please enter the ${field.charAt(0).toUpperCase() + field.slice(1)}`);
        isValid = false;
      }
    });

    // Validate image file
    if (!formData.imageFile) {
      toast.error('Please upload an image for the event');
      isValid = false;
    }

    // Validate speakers
    if (formData.speakers.some(speaker => !speaker.trim())) {
      toast.error('Please enter all speaker names or remove empty fields');
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Event created successfully');
      setLoading(false);
      setShowForm(false);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        location: '',
        description: '',
        imageFile: null,
        featured: false,
        speakers: [''],
      });
    }, 2000);
  };

  const handleDeleteEvent = (id: string) => {
    // Simulate API call
    toast.success('Event deleted successfully');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Events Management</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          Add New Event
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date / Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrations
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                      <img className="h-10 w-10 object-cover" src={event.imageUrl} alt={event.title} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        {event.featured && <span className="bg-gold/20 text-divine-dark px-1.5 py-0.5 rounded-sm text-xs mr-2">Featured</span>}
                        {event.speakers.length} speaker{event.speakers.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-900">{event.date}</div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-900">{event.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-900">{event.registrations}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-divine hover:text-divine-dark mr-3">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Search size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No events found</p>
                    <p className="text-gray-400 mt-1">Try adjusting your search or add a new event</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Event</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date*
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Time*
                  </label>
                  <input
                    type="text"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="e.g. 6:00 PM - 9:00 PM"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter event location"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  placeholder="Enter event description"
                ></textarea>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="imageFile" className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark">
                        <span>Upload a file</span>
                        <input 
                          id="imageFile" 
                          name="imageFile" 
                          type="file" 
                          accept="image/*"
                          className="sr-only" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 2MB
                    </p>
                    {formData.imageFile && (
                      <p className="text-sm text-divine-dark font-medium">{formData.imageFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-divine focus:ring-divine border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Mark as featured event
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speakers
                </label>
                
                {formData.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={speaker}
                      onChange={(e) => handleSpeakerChange(index, e.target.value)}
                      placeholder="Speaker name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    />
                    {formData.speakers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpeaker(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addSpeaker}
                  className="mt-2 text-sm flex items-center gap-1 text-divine hover:text-divine-dark"
                >
                  <Plus size={14} />
                  Add Speaker
                </button>
              </div>
              
              <div className="mt-8 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <>Creating Event...</>
                  ) : (
                    <>
                      <Calendar size={16} />
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsList;
