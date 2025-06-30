import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ExternalLink, Download, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const categoryOrder = [
  "All",
  "Events",
  "Youth",
  "Outreach",
  "Worship",
  "Children",
  "Prayer",
  "Baptism",
];

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch gallery images using React Query
  const {
    data: images = [],
    isLoading,
    isError,
    error,
  } = useQuery<GalleryImage[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/gallery`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter images based on category
  const filteredImages = useMemo(() => {
    return selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const handleImageClick = useCallback(
    (index: number) => {
      setCurrentImageIndex(index);
      setOpen(true);
    },
    [setCurrentImageIndex, setOpen]
  );

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = title || "gallery-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(images.map((img) => img.category))
    ).sort();
    return ["All", ...uniqueCategories];
  }, [images]);

  const CategoryPill = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      className={
        "px-5 py-2 rounded-full font-medium mr-2 mb-2 border transition-all text-base uppercase " +
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f7fa]">
        <Navbar />
        <div className="container-custom py-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f7fa]">
        <Navbar />
        <div className="container-custom py-24 text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600">Error loading gallery images</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#E50914] text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7fa]">
      <Navbar />
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
      <main className="flex-1 mb-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, idx) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden"
              >
                <div
                  className="relative cursor-pointer group h-56 overflow-hidden"
                  onClick={() => handleImageClick(images.indexOf(image))}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                <div className="flex-1 flex flex-col justify-between px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-black truncate">
                      {image.title}
                    </h3>
                    <p className="text-gray-600 mb-4 font-normal text-base h-12 overflow-hidden">
                      {image.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#f6f6f8] text-[#E50914] font-medium text-xs capitalize border border-[#F2E8EA]">
                      {image.category}
                    </span>
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
