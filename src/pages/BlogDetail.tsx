
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SermonCard from '../components/SermonCard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [recommendedSermons, setRecommendedSermons] = useState<any[]>([]);

  // This would normally fetch from an API
  useEffect(() => {
    // Sample blog data
    setBlog({
      id,
      title: 'Finding Your Purpose in Christ',
      content: `
        <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In the journey of faith, discovering our purpose is fundamental to living a fulfilled life. Christ has a unique calling for each of us.</p>
        
        <h2 class="text-2xl font-bold mt-6 mb-3">The Divine Plan</h2>
        <p class="mb-4">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. God has prepared good works in advance for us to do, and understanding this divine arrangement brings peace and direction.</p>
        
        <h2 class="text-2xl font-bold mt-6 mb-3">Walking in Your Calling</h2>
        <p class="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Our calling often aligns with our natural gifts and the burdens God has placed on our hearts.</p>
        
        <blockquote class="border-l-4 border-divine pl-4 italic my-6">
          "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future." - Jeremiah 29:11
        </blockquote>
        
        <h2 class="text-2xl font-bold mt-6 mb-3">Overcoming Obstacles</h2>
        <p class="mb-4">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. The path to purpose is rarely straight or without challenges, but these obstacles often shape us for greater service.</p>
        
        <p class="mb-4">In conclusion, finding your purpose in Christ involves prayer, community, scripture study, and stepping out in faith when God calls. It's a journey of discovery that unfolds over time as we walk with Him.</p>
      `,
      author: 'Pastor Emmanuel Johnson',
      date: 'June 10, 2024',
      category: 'Spiritual Growth',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    });

    // Sample recommended sermons
    setRecommendedSermons([
      {
        id: '1',
        title: 'Walking in Divine Purpose',
        speaker: 'Pastor Emmanuel Johnson',
        date: 'June 12, 2024',
        duration: '45 min',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        type: 'video' as const,
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        downloads: 125
      },
      {
        id: '2',
        title: 'Understanding Your Calling',
        speaker: 'Pastor Sarah Williams',
        date: 'June 5, 2024',
        duration: '38 min',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        type: 'audio' as const,
        url: 'https://soundbible.com/mp3/church-chime-daniel_simon.mp3',
        downloads: 84
      }
    ]);
  }, [id]);

  if (!blog) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container-custom h-full flex flex-col justify-end pb-12">
            <Button
              variant="ghost"
              className="text-white mb-4 w-fit"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span>{blog.author}</span>
              <span>•</span>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Recommended Sermons Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Related Sermons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedSermons.map((sermon) => (
                <SermonCard key={sermon.id} {...sermon} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
