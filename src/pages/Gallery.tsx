
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, ZoomIn, Download } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Sample gallery data - in a real app, this would come from an API/database
const galleryImages = [
  {
    id: '1',
    title: 'Annual Conference 2024',
    description: 'Highlights from our annual conference with believers from around the world.',
    imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
    category: 'events'
  },
  {
    id: '2',
    title: 'Youth Retreat',
    description: 'Our young adults connecting with God and each other in nature.',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    category: 'youth'
  },
  {
    id: '3',
    title: 'Community Outreach',
    description: 'Serving our local community through various outreach programs.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    category: 'outreach'
  },
  {
    id: '4',
    title: 'Worship Experience',
    description: 'Powerful moments of praise and worship during our Sunday service.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    category: 'worship'
  },
  {
    id: '5',
    title: "Children\"s Ministry",
    description: 'Our dedicated team nurturing the next generation in faith.',
    imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098',
    category: 'children'
  },
  {
    id: '6',
    title: 'Prayer Conference',
    description: 'Gathering together in prayer and intercession for the nations.',
    imageUrl: 'https://images.unsplash.com/photo-1551038247-3d9af20df552',
    category: 'prayer'
  },
  {
    id: '7',
    title: 'Building Dedication',
    description: 'The dedication ceremony of our new sanctuary building.',
    imageUrl: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
    category: 'events'
  },
  {
    id: '8',
    title: 'Christmas Celebration',
    description: 'Our annual Christmas celebration with the community.',
    imageUrl: 'https://images.unsplash.com/photo-1466442929976-97f336a657be',
    category: 'events'
  },
  {
    id: '9',
    title: 'Baptism Service',
    description: 'New believers proclaiming their faith through baptism.',
    imageUrl: 'https://images.unsplash.com/photo-1524230572899-a752b3835840',
    category: 'baptism'
  }
];

// Gallery image categories
const categories = ['all', ...Array.from(new Set(galleryImages.map(img => img.category)))];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  // Filter images by category
  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1492321936769-b49830bc1d1e"
            alt="Gallery Header"
            className="w-full h-[40vh] object-cover"
          />
        </div>
        
        <Navbar />
        
        <div className="relative z-10 container-custom pt-32 pb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mb-4"
          >
            Media Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-white/90 max-w-2xl mx-auto"
          >
            Browse through our collection of moments, memories, and milestones in our ministry journey.
          </motion.p>
        </div>
      </div>
      
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-6 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-divine text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => setSelectedImage(image)}
                      className="bg-white text-divine p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-divine hover:text-white"
                    >
                      <ZoomIn size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl font-semibold mb-2">{image.title}</h3>
                  <p className="text-gray-600">{image.description}</p>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-divine font-medium bg-divine/10 px-3 py-1 rounded-full">
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </span>
                    <button 
                      onClick={() => setSelectedImage(image)}
                      className="text-divine hover:text-divine-dark flex items-center gap-1"
                    >
                      <ImageIcon size={16} />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No images found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <div>
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full max-h-[60vh] object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{selectedImage.title}</h2>
              <p className="text-gray-700 mb-4">{selectedImage.description}</p>
              <div className="flex justify-between">
                <span className="text-sm text-divine font-medium bg-divine/10 px-3 py-1 rounded-full">
                  {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                </span>
                <button className="flex items-center gap-1 text-divine hover:text-divine-dark">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Gallery;
