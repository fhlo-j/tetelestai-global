// src/components/AnnouncementModal.tsx
import { useEffect, useState } from "react";
import { X, Loader2, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Announcement } from "@/services/apiAnnouncement";
import { useAnnouncements } from "@/hooks/useAnnouncements";

const AnnouncementModal = () => {
  const [open, setOpen] = useState(false);
  const [showAgain, setShowAgain] = useState(true); // This state controls the "Don't show again today" checkbox

  const {
    data: announcements,
    isLoading,
    isError,
    error,
    refetch,
  } = useAnnouncements("");

  const importantAnnouncements =
    announcements?.filter((announcement) => announcement.isImportant) || [];

  // --- DEBUGGING LOGS ---
  useEffect(() => {
    console.log("--- AnnouncementModal Debugging ---");
    console.log("isLoading:", isLoading);
    console.log("isError:", isError);
    if (isError) {
      console.error("Error fetching announcements:", error);
    }
    console.log("Fetched Announcements (raw):", announcements);
    console.log("Important Announcements (filtered):", importantAnnouncements);
    console.log(
      "Number of Important Announcements:",
      importantAnnouncements.length
    );

    const hasImportantAnnouncements = importantAnnouncements.length > 0;
    const hasSeenAnnouncements = localStorage.getItem("announcementsSeen");
    const today = new Date().toDateString();

    console.log("hasImportantAnnouncements:", hasImportantAnnouncements);
    console.log(
      "hasSeenAnnouncements (from localStorage):",
      hasSeenAnnouncements
    );
    console.log("Current Date String (today):", today);
    console.log("showAgain state:", showAgain);
    console.log(
      "Condition 1: !isLoading && !isError ->",
      !isLoading && !isError
    );
    console.log(
      "Condition 2: hasImportantAnnouncements ->",
      hasImportantAnnouncements
    );
    console.log(
      "Condition 3: (!hasSeenAnnouncements || hasSeenAnnouncements !== today) ->",
      !hasSeenAnnouncements || hasSeenAnnouncements !== today
    );
    console.log("Condition 4: showAgain ->", showAgain);

    if (!isLoading && !isError) {
      if (
        hasImportantAnnouncements &&
        (!hasSeenAnnouncements || hasSeenAnnouncements !== today) &&
        showAgain
      ) {
        console.log("All conditions met! Setting modal to open.");
        setOpen(true);
      } else {
        console.log("Conditions not met for opening modal.");
        setOpen(false); // Ensure it's closed if conditions aren't met
      }
    }
  }, [
    importantAnnouncements.length,
    showAgain,
    isLoading,
    isError,
    announcements,
    error,
  ]); // Added all relevant dependencies

  const handleClose = () => {
    setOpen(false);
    if (!showAgain) {
      // Store today's date so the modal doesn't show again until tomorrow
      console.log(
        "Storing 'announcementsSeen' in localStorage:",
        new Date().toDateString()
      );
      localStorage.setItem("announcementsSeen", new Date().toDateString());
    } else {
      console.log(
        "'Don't show again today' was unchecked, not storing in localStorage."
      );
    }
  };

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading important announcements...</p>
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

    if (importantAnnouncements.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-md border">
          <Bell size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">
            No important announcements at this time.
          </p>
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleClose} // Allow closing the empty modal
              className="bg-divine hover:bg-divine/90"
            >
              Close
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="p-6 space-y-6">
          {importantAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {announcement.imageUrl && (
                  <div className="md:w-1/3">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                <div
                  className={`${announcement.imageUrl ? "md:w-2/3" : "w-full"}`}
                >
                  <h3 className="text-xl font-semibold text-divine mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {/* Format the date from the backend */}
                    {new Date(announcement.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-gray-700">{announcement.content}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="dont-show"
                checked={!showAgain}
                onChange={() => setShowAgain(!showAgain)}
                className="rounded text-divine focus:ring-divine"
              />
              <label htmlFor="dont-show" className="text-sm text-gray-600">
                Don't show again today
              </label>
            </div>

            <Button
              onClick={handleClose}
              className="bg-divine hover:bg-divine/90"
            >
              Close
            </Button>
          </div>

          <div className="text-center border-t pt-4">
            <Button variant="link" asChild>
              <a
                href="/announcements"
                className="text-divine hover:text-divine/80"
              >
                View All Announcements
              </a>
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0"
        aria-describedby="announcement-description"
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Important Announcements</DialogTitle>
          <DialogDescription id="announcement-description" className="sr-only">
            A list of important ministry updates and events you should know
            about.
          </DialogDescription>
          <div className="bg-divine text-white py-4 px-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Important Announcements</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementModal;
