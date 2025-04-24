import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ExternalLink, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Use the updated gallery image data from the admin gallery sample
const initialImages = [
  {
    id: "1",
    title: "Annual Conference 2024",
    description: "Highlights from our annual conference with believers from around the world.",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
    category: "Events",
  },
  {
    id: "2",
    title: "Youth Retreat",
    description: "Our young adults connecting with God and each other in nature.",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    category: "Youth",
  },
  {
    id: "3",
    title: "Community Outreach",
    description: "Serving our local community through various outreach programs.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    category: "Outreach",
  },
  {
    id: "4",
    title: "Worship Experience",
    description: "Powerful moments of praise and worship during our Sunday service.",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    category: "Worship",
  },
  {
    id: "5",
    title: "Children's Ministry",
    description: "Our dedicated team nurturing the next generation in faith.",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
    category: "Children",
  },
  {
    id: "6",
    title: "Prayer Conference",
    description: "Gathering together in prayer and intercession for the nations.",
    imageUrl: "https://images.unsplash.com/photo-1551038247-3d9af20df552",
    category: "Prayer",
  },
];

const categoryOrder = [
  "All",
  "Events",
  "Youth",
  "Outreach",
  "Worship",
  "Children",
  "Prayer",
  "Baptism", // Not used in sample data but shown in screenshot
];

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const images = initialImages;

  // Filter images based on category
  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const handleImageClick = useCallback(
    (index: number) => {
      setCurrentImageIndex(index);
      setOpen(true);
    },
    [setCurrentImageIndex, setOpen]
  );

  // Download image utility
  const handleDownload = (imageUrl: string, title: string) => {
    // Create a link and click it to trigger download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = title || "gallery-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get all unique categories from the images for filters (to keep in sync with admin/backend later)
  // (But show specified order above)
  // If a listed category is missing from data, still show it (just disables it).
  const categories = categoryOrder;

  // UI for a category pill
  const CategoryPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      className={
        "px-5 py-2 rounded-full font-medium mr-2 mb-2 border transition-all text-base " +
        (active
          ? "bg-[#E50914] text-white border-[#E50914] shadow"
          : "bg-white text-black border-gray-200 hover:bg-gray-100")
      }
      onClick={onClick}
      disabled={active}
      aria-pressed={active}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7fa]">
      <Navbar />

      {/* Header with nav bar spacing */}
      <div className="pt-24 pb-4" />

      {/* Category filter row */}
      <div className="container-custom">
        <div className="flex flex-wrap gap-2 items-center justify-center mb-8">
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      <main className="flex-1">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, idx) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.10 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden"
              >
                {/* Image section */}
                <div
                  className="relative cursor-pointer group h-56 overflow-hidden"
                  onClick={() => handleImageClick(images.indexOf(image))}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay for download icon (shown on hover) */}
                  <button
                    className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow text-[#E50914] opacity-0 group-hover:opacity-100 transition group-hover:scale-110"
                    title="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image.imageUrl, image.title);
                    }}
                  >
                    <Download size={20} />
                  </button>
                </div>
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-black truncate">{image.title}</h3>
                    <p className="text-gray-600 mb-4 font-normal text-base h-12 overflow-hidden">{image.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Category tag */}
                    <span className="px-3 py-1 rounded-full bg-[#f6f6f8] text-[#E50914] font-medium text-xs capitalize border border-[#F2E8EA]">
                      {image.category}
                    </span>
                    {/* View button */}
                    <button
                      className="flex items-center gap-1 font-medium text-[#E50914] px-2 py-1 rounded transition-all hover:bg-[#E50914]/10 text-sm"
                      onClick={() => handleImageClick(images.indexOf(image))}
                      title="View"
                    >
                      <ExternalLink size={16} className="inline-block" />
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredImages.length === 0 && (
            <div className="text-center text-gray-400 mt-24">
              <p>No images found in this category.</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Viewer */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={filteredImages.map((img) => ({
          src: img.imageUrl,
          alt: img.title,
        }))}
        index={currentImageIndex}
        render={{
          slide: ({ slide }) => (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt || ""}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "80vh",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          ),
        }}
      />

      <Footer />
    </div>
  );
};

export default Gallery;
