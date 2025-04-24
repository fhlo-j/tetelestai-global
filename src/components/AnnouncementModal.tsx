import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  isImportant: boolean;
}

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Special Guest Speaker this Sunday",
    content:
      'We are honored to have Dr. Michael Johnson, renowned author and theologian, as our guest speaker this Sunday. Join us for this special service as he shares insights on "Living a Purpose-Driven Life in Christ".',
    date: "June 15, 2024",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
    isImportant: true,
  },
  {
    id: "2",
    title: "Building Fund Update",
    content:
      "We are pleased to announce that we have reached 75% of our building fund goal. Thank you for your generous contributions. The new sanctuary construction will begin next month.",
    date: "June 10, 2024",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
    isImportant: false,
  },
  {
    id: "3",
    title: "Youth Camp Registration",
    content:
      "Registration for our annual Youth Summer Camp is now open. The camp will be held July 15-19 at Camp New Hope. Early bird registration ends June 30.",
    date: "June 5, 2024",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    isImportant: true,
  },
];

const AnnouncementModal = () => {
  const [open, setOpen] = useState(false);
  const [showAgain, setShowAgain] = useState(true);

  const importantAnnouncements = announcements.filter(
    (announcement) => announcement.isImportant
  );

  useEffect(() => {
    const hasImportantAnnouncements = importantAnnouncements.length > 0;
    const hasSeenAnnouncements = localStorage.getItem("announcementsSeen");
    const today = new Date().toDateString();

    if (
      hasImportantAnnouncements &&
      (!hasSeenAnnouncements || hasSeenAnnouncements !== today) &&
      showAgain
    ) {
      setOpen(true);
    }
  }, [importantAnnouncements.length, showAgain]);

  const handleClose = () => {
    setOpen(false);
    if (!showAgain) {
      localStorage.setItem("announcementsSeen", new Date().toDateString());
    }
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
                    {announcement.date}
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
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementModal;
