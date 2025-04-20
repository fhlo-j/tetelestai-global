
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import BlogPostEditor from '@/components/BlogPostEditor';
import { toast } from "@/hooks/use-toast";

const AdminBlogList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState(blogPosts);
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleCreatePost = (post: { title: string; content: string; imageUrl: string }) => {
    const newPost = {
      id: Date.now().toString(),
      title: post.title,
      excerpt: post.content.substring(0, 150) + '...',
      author: 'Admin User', // This would come from auth context in a real app
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      imageUrl: post.imageUrl,
      featured: false,
      status: 'published',
      views: 0
    };

    setPosts([newPost, ...posts]);
    toast({
      title: "Blog post created",
      description: "Your post has been published successfully.",
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Blog Posts</h1>
          <p className="text-gray-500">Manage your blog content</p>
        </div>
        
        <Button 
        className="bg-divine hover:bg-divine/90"
        onClick={() => setIsEditorOpen(true)}
      >
          <Plus size={16} className="mr-2" />
          New Post
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or author..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
                <div className="h-48 md:h-full relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {post.featured && (
                    <div className="absolute top-2 left-2 bg-gold/90 text-black text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <div className="flex flex-col h-full">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <span className={`text-xs px-2 py-1 rounded ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span>By: {post.author}</span>
                        <span>Date: {post.date}</span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {post.views} views
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye size={14} />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:border-red-200">
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-md">
            <p className="text-gray-500">No blog posts found</p>
          </div>
        )}
      </div>

      <BlogPostEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onSave={handleCreatePost}
      />
    </div>
  );
};

export default AdminBlogList;

// Sample blog posts data
const blogPosts = [
    {
      id: '1',
      title: 'Finding Your Purpose in Christ',
      excerpt: 'Discover how to align your life with God\'s unique purpose for you and fulfill your divine destiny.',
      author: 'Pastor Emmanuel Johnson',
      date: 'June 10, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      featured: true,
      status: 'published',
      views: 243
    },
    {
      id: '2',
      title: '5 Biblical Principles for Spiritual Growth',
      excerpt: 'Learn practical steps from scripture to deepen your relationship with God and grow spiritually.',
      author: 'Minister Rebecca Adams',
      date: 'June 3, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      featured: false,
      status: 'published',
      views: 178
    },
    {
      id: '3',
      title: 'The Power of Prayer in Daily Life',
      excerpt: 'How consistent prayer can transform your daily routine and bring you closer to God.',
      author: 'Elder David Thompson',
      date: 'May 25, 2024',
      imageUrl: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
      featured: false,
      status: 'draft',
      views: 0
    }
  ];
