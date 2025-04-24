// Sample announcements data - would come from an API/database in a real app
interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
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
