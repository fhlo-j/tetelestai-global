
import { useState, useRef, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Bookmark, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { Sermon, Comment } from '../pages/Admin/AdminSermonsList';
import { toast } from 'sonner';

const SermonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const commentFormRef = useRef<HTMLFormElement>(null);

  const sermons: Sermon[] = [
    {
      id: '1',
      title: 'The Power of Divine Purpose',
      speaker: 'Pastor Emmanuel Johnson',
      date: 'June 12, 2024',
      topic: 'Purpose',
      duration: '45 min',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      description: 'Discover how to align your life with God\'s purpose and fulfill your divine destiny in this powerful message.',
      featured: true,
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample YouTube URL
      transcript: 'This is a sample transcript of the powerful sermon on divine purpose. The sermon talks about finding your purpose in Christ and following God\'s plan for your life.',
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
      description: 'Learn how God\'s grace sustains us during difficult seasons and empowers us to overcome every challenge.',
      featured: false,
      type: 'audio',
      url: 'https://soundbible.com/mp3/church-chime-daniel_simon.mp3', // Sample audio URL
      transcript: 'This sermon explores how God\'s grace sustains us during difficult seasons. We learn how to receive grace and extend it to others.',
      comments: [
        {
          id: '1',
          userName: 'Michael Roberts',
          userEmail: 'michael@example.com',
          content: 'Pastor Sarah always has such encouraging messages. This one came at just the right time.',
          date: 'June 7, 2024'
        }
      ]
    }
  ];

  const sermon = sermons.find(sermon => sermon.id === id);

  if (!sermon) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-20">
          <h2 className="text-2xl font-semibold mb-4">Sermon Not Found</h2>
          <p className="text-gray-600 mb-6">The sermon you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/sermons')}
            className="btn-primary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Sermons
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim() || !userEmail.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsCommenting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would submit this data to your backend
      toast.success("Comment submitted successfully");
      setIsCommenting(false);
      setComment('');
      setUserName('');
      setUserEmail('');
      commentFormRef.current?.reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div className="pt-24 pb-12 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
            alt="Sermon detail header background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="container-custom relative z-10">
          <button 
            onClick={() => navigate('/sermons')}
            className="text-white flex items-center gap-1 mb-6 hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Sermons
          </button>
          
          <h1 className="text-white mb-2">{sermon.title}</h1>
          <p className="text-white/90 text-lg mb-4">{sermon.speaker}</p>
          <div className="flex flex-wrap gap-4 text-white/80">
            <span>{sermon.date}</span>
            <span>•</span>
            <span>{sermon.duration}</span>
            <span>•</span>
            <span>Topic: {sermon.topic}</span>
          </div>
        </div>
      </div>
      
      {/* Sermon Content */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Video or Audio Player */}
              <div className="mb-6">
                {sermon.type === 'video' ? (
                  <div className="aspect-video">
                    <iframe 
                      src={sermon.url}
                      title={sermon.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{sermon.title}</h3>
                      <span className="text-gray-500">{sermon.duration}</span>
                    </div>
                    <audio 
                      controls 
                      src={sermon.url}
                      className="w-full"
                    >
                      Your browser doesn't support audio playback.
                    </audio>
                    <div className="flex justify-end mt-4">
                      <a 
                        href={sermon.url}
                        download={`${sermon.title}-${sermon.speaker}.mp3`}
                        className="text-divine hover:text-divine-dark flex items-center gap-2"
                      >
                        <Download size={18} />
                        Download Audio
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-divine mb-4">Description</h2>
                <p className="text-gray-700">{sermon.description}</p>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4 my-6">
                  <button className="flex items-center gap-2 text-divine hover:text-divine-dark">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button className="flex items-center gap-2 text-divine hover:text-divine-dark">
                    <Bookmark size={18} />
                    Save
                  </button>
                </div>
                
                {/* Transcript */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Transcript</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{sermon.transcript}</p>
                  </div>
                </div>
                
                {/* Comments */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Comments</h3>
                  <form ref={commentFormRef} onSubmit={handleSubmitComment} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                        required
                      />
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Your Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-divine"
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={isCommenting}
                      className="btn-primary flex items-center gap-2"
                    >
                      {isCommenting ? 'Posting...' : 'Post Comment'}
                      {!isCommenting && <MessageSquare size={18} />}
                    </button>
                  </form>
                  
                  {sermon.comments && sermon.comments.length > 0 ? (
                    <div className="space-y-4">
                      {sermon.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex flex-col">
                            <p className="font-medium">{comment.userName}</p>
                            <p className="text-xs text-gray-400 mt-1">{comment.date}</p>
                          </div>
                          <p className="mt-2 text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>Be the first to comment on this sermon</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">About the Speaker</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt={sermon.speaker}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{sermon.speaker}</h4>
                    <p className="text-sm text-gray-600">Lead Pastor</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  {sermon.speaker} is dedicated to spreading the gospel of Jesus Christ and helping believers fulfill their divine purpose.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Related Sermons</h3>
                <div className="space-y-4">
                  {sermons.filter(s => s.id !== sermon.id).map(s => (
                    <div key={s.id} className="flex gap-3">
                      <img 
                        src={s.imageUrl} 
                        alt={s.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                      <div>
                        <Link to={`/sermons/${s.id}`} className="font-medium hover:text-divine line-clamp-2">
                          {s.title}
                        </Link>
                        <p className="text-xs text-gray-500">{s.speaker}</p>
                      </div>
                    </div>
                  ))}
                </div>
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

export default SermonDetail;
