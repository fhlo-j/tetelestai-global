// src/pages/Announcements.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Bell, Loader2 } from "lucide-react"; // Import Bell and Loader2 for empty/loading states
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Import Button for retry
// Import Announcement type from your API service, as it's now the source of truth
import { Announcement } from "@/services/apiAnnouncement";
import { useAnnouncements } from "@/hooks/useAnnouncements"; // Import the useAnnouncements hook

const Announcements = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use the useAnnouncements hook to fetch data
  const {
    data: announcements, // Rename data to announcements for consistency
    isLoading,
    isError,
    error,
    refetch, // Allows retrying the fetch
  } = useAnnouncements(searchQuery); // Pass searchQuery to the hook for server-side filtering if your API supports it

  // Filter announcements based on search query (if not handled by API directly)
  // If your useAnnouncements hook already filters by searchQuery on the backend,
  // this client-side filter might be redundant. Keep it for now for robustness.
  const filteredAnnouncements =
    announcements?.filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []; // Ensure it's an empty array if announcements is undefined

  const renderAnnouncementsList = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading announcements...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-10 text-red-500">
          <p>
            Error:{" "}
            {error?.message ||
              "Failed to load announcements. Please try again."}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    if (filteredAnnouncements.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Bell size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No announcements found</p>
          {searchQuery && (
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="text-divine mt-1"
            >
              Clear search
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {filteredAnnouncements.map((announcement) => (
          <AnnouncementItem key={announcement.id} announcement={announcement} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1551038247-3d9af20df552"
            alt="Announcements Header"
            className="w-full h-[40vh] object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>

        <Navbar />

        <div className="relative z-10 container-custom pt-32 pb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mb-4"
          >
            Announcements
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-white/90 max-w-2xl mx-auto"
          >
            Stay updated with the latest news and events from our ministry.
          </motion.p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search announcements..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading} // Disable search while loading
              />
            </div>
          </div>

          {renderAnnouncementsList()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Announcement item component
const AnnouncementItem = ({ announcement }: { announcement: Announcement }) => {
  // Ensure date is formatted correctly from ISO string if coming from backend
  const formattedDate = new Date(announcement.date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="md:flex">
        {announcement.imageUrl && (
          <div className="md:w-1/3 h-64 md:h-auto">
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className={`p-6 ${announcement.imageUrl ? "md:w-2/3" : "w-full"}`}>
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-semibold text-divine mb-2">
              {announcement.title}
            </h2>
            {announcement.isImportant && (
              <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                Important
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Calendar size={16} />
            <span>{formattedDate}</span> {/* Use formattedDate */}
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Announcements;
