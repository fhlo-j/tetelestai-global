
import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, UploadCloud, X, Video, Music, Download, MessageSquare, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

interface SermonFormData {
  id?: string;
  title: string;
  speaker: string;
  topic: string;
  description: string;
  date: string;
  thumbnail: File | null;
  mediaFile: File | null;
  youtubeUrl?: string;
  duration?: string;
  transcript: string;
  featured: boolean;
}

export interface Comment {
  id: string;
  userName: string;
  userEmail: string;
  content: string;
  date: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  topic: string;
  duration: string;
  imageUrl: string;
  type: 'audio' | 'video';
  url: string;
  featured?: boolean;
  transcript: string;
  description: string;
  comments: Comment[];
}

interface AdminSermonsListProps {
  type: 'audio' | 'video';
}

const AdminSermonsList = ({ type }: AdminSermonsListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSermonId, setSelectedSermonId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: '1',
      title: 'The Power of Divine Purpose',
      speaker: 'Pastor Emmanuel Johnson',
      date: 'June 12, 2024',
      topic: 'Purpose',
      duration: '45 min',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      type: 'video' as const,
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: true,
      transcript: 'This is a sample transcript of the powerful sermon on divine purpose. The sermon talks about finding your purpose in Christ and following God\'s plan for your life.',
      description: 'Discover how to align your life with God\'s purpose and fulfill your divine destiny in this powerful message.',
      comments: [
        {
          id: '1',
          userName: 'John Smith',
          userEmail: 'john@example.com',
          content: 'This sermon was life-changing for me. Thank you, Pastor Emmanuel!',
          date: 'June 14, 2024'
        },
        {
          id: '2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah@example.com',
          content: 'I\'ve been struggling with finding my purpose. This message gave me hope.',
          date: 'June 15, 2024'
        }
      ]
    },
    {
      id: '2',
      title: 'Embracing God\'s Grace in Challenging Times',
      speaker: 'Pastor Sarah Williams',
      date: 'June 5, 2024',
      topic: 'Grace',
      duration: '38 min',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      type: 'audio' as const,
      url: 'https://soundbible.com/mp3/church-chime-daniel_simon.mp3',
      transcript: 'This sermon explores how God\'s grace sustains us during difficult seasons. We learn how to receive grace and extend it to others.',
      description: 'Learn how God\'s grace sustains us during difficult seasons and empowers us to overcome every challenge.',
      comments: [
        {
          id: '1',
          userName: 'Michael Roberts',
          userEmail: 'michael@example.com',
          content: 'Pastor Sarah always has such encouraging messages. This one came at just the right time.',
          date: 'June 7, 2024'
        }
      ]
    },
    {
      id: '3',
      title: 'Finding Rest in God\'s Presence',
      speaker: 'Elder David Thompson',
      date: 'May 29, 2024',
      topic: 'Rest',
      duration: '42 min',
      imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
      type: 'audio' as const,
      url: 'https://soundbible.com/mp3/church-chime-daniel_simon.mp3',
      transcript: 'This sermon focuses on how we can find true rest in God\'s presence. Elder David shares practical ways to cultivate a restful spirit.',
      description: 'Discover the peace that comes from resting in God\'s presence during hectic times.',
      comments: []
    },
    {
      id: '4',
      title: 'The Finished Work of Christ',
      speaker: 'Pastor Emmanuel Johnson',
      date: 'May 22, 2024',
      topic: 'Salvation',
      duration: '47 min',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
      type: 'video' as const,
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      transcript: 'In this powerful message, Pastor Emmanuel explains the significance of Christ\'s finished work on the cross and what it means for believers today.',
      description: 'Explore the profound implications of Christ\'s sacrifice and what it means for your salvation.',
      comments: [
        {
          id: '1',
          userName: 'Rebecca Thompson',
          userEmail: 'rebecca@example.com',
          content: 'This sermon helped me understand salvation in a new way. Thank you!',
          date: 'May 24, 2024'
        },
        {
          id: '2',
          userName: 'Daniel Mitchell',
          userEmail: 'daniel@example.com',
          content: 'Powerful message about what Christ has done for us.',
          date: 'May 25, 2024'
        },
        {
          id: '3',
          userName: 'Lisa Garcia',
          userEmail: 'lisa@example.com',
          content: 'I\'ve listened to this sermon three times already. So much depth.',
          date: 'May 26, 2024'
        }
      ]
    },
  ]);

  const [formData, setFormData] = useState<SermonFormData>({
    title: '',
    speaker: '',
    topic: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    thumbnail: null,
    mediaFile: null,
    youtubeUrl: '',
    transcript: '',
    featured: false
  });

  const typeFilteredSermons = sermons.filter(sermon => sermon.type === type);
  
  const filteredSermons = typeFilteredSermons.filter(sermon => 
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'thumbnail' | 'mediaFile') => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleEdit = (id: string) => {
    const sermonToEdit = sermons.find(sermon => sermon.id === id);
    if (sermonToEdit) {
      setFormData({
        id: sermonToEdit.id,
        title: sermonToEdit.title,
        speaker: sermonToEdit.speaker,
        topic: sermonToEdit.topic,
        description: sermonToEdit.description,
        date: new Date(sermonToEdit.date).toISOString().split('T')[0],
        thumbnail: null,
        mediaFile: null,
        youtubeUrl: sermonToEdit.type === 'video' ? sermonToEdit.url : '',
        transcript: sermonToEdit.transcript,
        featured: sermonToEdit.featured || false
      });
      setEditMode(true);
      setShowForm(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedSermonId(id);
    setShowDeleteConfirm(true);
  };

  const handleShowComments = (id: string) => {
    setSelectedSermonId(id);
    setShowComments(true);
  };
  
  const handleDeleteComment = (sermonId: string, commentId: string) => {
    setSermons(prevSermons => 
      prevSermons.map(sermon => {
        if (sermon.id === sermonId) {
          return {
            ...sermon,
            comments: sermon.comments.filter(comment => comment.id !== commentId)
          };
        }
        return sermon;
      })
    );
    toast.success("Comment deleted successfully");
  };

  const handleDelete = () => {
    if (selectedSermonId) {
      setSermons(prevSermons => prevSermons.filter(sermon => sermon.id !== selectedSermonId));
      setShowDeleteConfirm(false);
      setSelectedSermonId(null);
      toast.success(`${type === 'video' ? 'Video' : 'Audio'} sermon deleted successfully`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let isValid = true;
    const requiredFields = ['title', 'speaker', 'topic', 'date', 'description', 'transcript'];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof SermonFormData]) {
        toast.error(`Please enter the ${field.charAt(0).toUpperCase() + field.slice(1)}`);
        isValid = false;
      }
    });

    if (!editMode) {
      if (!formData.thumbnail) {
        toast.error('Please upload a thumbnail image');
        isValid = false;
      }

      if (type === 'audio' && !formData.mediaFile) {
        toast.error('Please upload an audio file');
        isValid = false;
      }

      if (type === 'video' && !formData.youtubeUrl) {
        toast.error('Please enter a YouTube URL');
        isValid = false;
      }
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (editMode && formData.id) {
        setSermons(prevSermons => 
          prevSermons.map(sermon => {
            if (sermon.id === formData.id) {
              return {
                ...sermon,
                title: formData.title,
                speaker: formData.speaker,
                topic: formData.topic,
                description: formData.description,
                date: new Date(formData.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }),
                url: type === 'video' && formData.youtubeUrl ? formData.youtubeUrl : sermon.url,
                featured: formData.featured,
                transcript: formData.transcript
              };
            }
            return sermon;
          })
        );
        toast.success(`${type === 'video' ? 'Video' : 'Audio'} sermon updated successfully`);
      } else {
        const newSermon: Sermon = {
          id: Date.now().toString(),
          title: formData.title,
          speaker: formData.speaker,
          topic: formData.topic,
          date: new Date(formData.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          duration: '45 min',
          imageUrl: formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
          type: type,
          url: type === 'video' ? formData.youtubeUrl || '' : formData.mediaFile ? URL.createObjectURL(formData.mediaFile) : '',
          featured: formData.featured,
          description: formData.description,
          transcript: formData.transcript,
          comments: []
        };
        
        setSermons(prev => [newSermon, ...prev]);
        toast.success(`${type === 'video' ? 'Video' : 'Audio'} sermon created successfully`);
      }
      
      setLoading(false);
      setShowForm(false);
      setEditMode(false);
      setFormData({
        title: '',
        speaker: '',
        topic: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        thumbnail: null,
        mediaFile: null,
        youtubeUrl: '',
        transcript: '',
        featured: false
      });
    }, 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{type === 'video' ? 'Video' : 'Audio'} Sermons</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setEditMode(false);
            setShowForm(true);
          }}
        >
          <Plus size={16} />
          Add {type === 'video' ? 'Video' : 'Audio'} Sermon
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type === 'video' ? 'video' : 'audio'} sermons...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sermon
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Speaker / Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Topic
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSermons.map((sermon) => (
              <tr key={sermon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                      <img className="h-10 w-10 object-cover" src={sermon.imageUrl} alt={sermon.title} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{sermon.title}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        {sermon.type === 'video' ? <Video size={12} className="mr-1" /> : <Music size={12} className="mr-1" />}
                        {sermon.type === 'video' ? 'Video' : 'Audio'} Sermon
                        {sermon.featured && <span className="ml-2 bg-gold/20 text-divine-dark px-1.5 py-0.5 rounded-sm text-xs">Featured</span>}
                        <button 
                          onClick={() => handleShowComments(sermon.id)} 
                          className="ml-2 flex items-center gap-1 text-divine hover:text-divine-dark"
                          title="View comments"
                        >
                          <MessageSquare size={12} />
                          {sermon.comments.length}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sermon.speaker}</div>
                  <div className="text-xs text-gray-500">{sermon.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {sermon.topic}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sermon.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/sermons/${sermon.id}`} 
                    target="_blank" 
                    className="text-divine hover:text-divine-dark mr-3"
                    title="View sermon"
                  >
                    <Eye size={16} />
                  </Link>
                  <button 
                    className="text-divine hover:text-divine-dark mr-3"
                    onClick={() => handleEdit(sermon.id)}
                    title="Edit sermon"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(sermon.id)}
                    title="Delete sermon"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSermons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Search size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No sermons found</p>
                    <p className="text-gray-400 mt-1">Try adjusting your search or add a new sermon</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Sermon</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this sermon? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showComments && selectedSermonId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Comments for "{sermons.find(s => s.id === selectedSermonId)?.title}"
                </h3>
                <button onClick={() => setShowComments(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {sermons.find(s => s.id === selectedSermonId)?.comments.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sermons.find(s => s.id === selectedSermonId)?.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.userName}</p>
                          <p className="text-sm text-gray-500">{comment.userEmail}</p>
                          <p className="text-xs text-gray-400 mt-1">{comment.date}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteComment(selectedSermonId, comment.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="mt-2 text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <button 
                onClick={() => setShowComments(false)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editMode ? `Edit ${type === 'video' ? 'Video' : 'Audio'} Sermon` : `Add New ${type === 'video' ? 'Video' : 'Audio'} Sermon`}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Sermon Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter sermon title"
                  />
                </div>
                
                <div>
                  <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 mb-1">
                    Speaker*
                  </label>
                  <input
                    type="text"
                    name="speaker"
                    id="speaker"
                    value={formData.speaker}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter speaker name"
                  />
                </div>
                
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic*
                  </label>
                  <input
                    type="text"
                    name="topic"
                    id="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                    placeholder="Enter sermon topic"
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Sermon Date*
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
                  placeholder="Enter sermon description"
                ></textarea>
              </div>
              
              <div className="mt-6">
                <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-1">
                  Transcript*
                </label>
                <textarea
                  name="transcript"
                  id="transcript"
                  value={formData.transcript}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                  placeholder="Enter sermon transcript"
                ></textarea>
              </div>
              
              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-divine border-gray-300 rounded focus:ring-divine"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Feature this sermon
                </label>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image{editMode ? '' : '*'}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark">
                          <span>Upload a file</span>
                          <input 
                            id="thumbnail" 
                            name="thumbnail" 
                            type="file" 
                            accept="image/*"
                            className="sr-only" 
                            onChange={(e) => handleFileChange(e, 'thumbnail')}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 2MB
                      </p>
                      {formData.thumbnail && (
                        <p className="text-sm text-divine-dark font-medium">{formData.thumbnail.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {type === 'audio' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Audio File{editMode ? '' : '*'}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="mediaFile" className="relative cursor-pointer bg-white rounded-md font-medium text-divine hover:text-divine-dark">
                            <span>Upload a file</span>
                            <input 
                              id="mediaFile" 
                              name="mediaFile" 
                              type="file"
                              accept="audio/*"
                              className="sr-only" 
                              onChange={(e) => handleFileChange(e, 'mediaFile')}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          MP3, WAV up to 20MB
                        </p>
                        {formData.mediaFile && (
                          <p className="text-sm text-divine-dark font-medium">{formData.mediaFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube Video URL{editMode ? '' : '*'}
                    </label>
                    <input
                      type="text"
                      name="youtubeUrl"
                      id="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                      placeholder="Enter YouTube video URL"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Example: https://www.youtube.com/watch?v=XXXXXX
                    </p>
                  </div>
                )}
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
                    <>Saving...</>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      {editMode ? 'Update' : 'Upload'} Sermon
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

export default AdminSermonsList;
