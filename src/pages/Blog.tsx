
import { useState, useEffect } from 'react';
import { Search, Filter, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import BlogCard from '../components/BlogCard';

const Blog = () => {
  // State for blogs and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  // Sample blog data
  const posts = [
    {
      id: '1',
      title: 'Finding Your Purpose in Christ',
      excerpt: 'Discover how to align your life with God\'s unique purpose for you and fulfill your divine destiny.',
      author: 'Pastor Emmanuel Johnson',
      date: 'June 10, 2024',
      category: 'Spiritual Growth',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      featured: true
    },
    {
      id: '2',
      title: '5 Biblical Principles for Spiritual Growth',
      excerpt: 'Learn practical steps from scripture to deepen your relationship with God and grow spiritually.',
      author: 'Minister Rebecca Adams',
      date: 'June 3, 2024',
      category: 'Spiritual Growth',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      featured: false
    },
    {
      id: '3',
      title: 'Understanding the Power of Prayer',
      excerpt: 'Explore the transformative power of prayer and how it connects us to God\'s heart and purposes.',
      author: 'Elder David Thompson',
      date: 'May 27, 2024',
      category: 'Prayer',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
      featured: false
    },
    {
      id: '4',
      title: 'The Meaning of "Tetelestai": It Is Finished',
      excerpt: 'Dive into the profound meaning of Jesus\'s final words on the cross and what they mean for believers today.',
      author: 'Pastor Emmanuel Johnson',
      date: 'May 20, 2024',
      category: 'Bible Study',
      imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
      featured: false
    },
    {
      id: '5',
      title: 'Building a Strong Christian Family',
      excerpt: 'Biblical principles and practical advice for nurturing a faith-centered family in today\'s challenging world.',
      author: 'Minister Rebecca Adams',
      date: 'May 13, 2024',
      category: 'Family',
      imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      featured: false
    },
    {
      id: '6',
      title: 'The Art of Biblical Meditation',
      excerpt: 'Learn how to meditate on God\'s Word to receive revelation, guidance, and spiritual nourishment.',
      author: 'Elder David Thompson',
      date: 'May 6, 2024',
      category: 'Bible Study',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      featured: false
    }
  ];

  // Get unique categories for filtering
  const categories = [...new Set(posts.map(post => post.category))];

  // Filter posts based on search and category filter
  useEffect(() => {
    let results = posts;
    
    if (searchTerm) {
      results = results.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      results = results.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(results);
  }, [searchTerm, selectedCategory]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  // Featured post (first one marked as featured)
  const featuredPost = posts.find(post => post.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 divine-gradient">
        <div className="container-custom text-center">
          <h1 className="text-white mb-4">Blog</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Spiritual insights, biblical teachings, and encouragement for your faith journey
          </p>
        </div>
      </div>
      
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-divine-light">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-divine mb-2">Featured Article</h2>
              <p className="text-gray-700">Our latest spiritual insight</p>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2">
                <div className="relative">
                  <img 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-black text-sm px-3 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={16} className="text-divine" />
                    <span className="text-sm text-gray-600">{featuredPost.category}</span>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3">{featuredPost.title}</h3>
                  
                  <p className="text-gray-700 mb-4">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <span className="font-medium">{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <a 
                      href={`/blog/${featuredPost.id}`}
                      className="btn-primary"
                    >
                      Read Article
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Blog Posts Collection */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Search and Filters */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                />
              </div>
              
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
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
          
          {/* Blog Grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-divine">All Articles</h2>
              <p className="text-gray-600">{filteredPosts.length} articles found</p>
            </div>
            
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} {...post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Filter size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Articles Found</h3>
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
      
      {/* Categories Section */}
      <section className="py-16 divine-light-gradient">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-divine mb-4">Browse By Category</h2>
            <p className="text-gray-700">
              Explore our content organized by spiritual topics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Spiritual Growth", count: 8 },
              { name: "Prayer", count: 5 },
              { name: "Bible Study", count: 12 },
              { name: "Family", count: 4 },
              { name: "Worship", count: 6 },
              { name: "Faith", count: 9 },
              { name: "Testimonies", count: 7 },
              { name: "Ministry", count: 5 }
            ].map((category, index) => (
              <a 
                key={index}
                href={`/blog?category=${category.name}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-1 text-divine">{category.name}</h3>
                <span className="text-sm text-gray-500">{category.count} articles</span>
              </a>
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

export default Blog;
