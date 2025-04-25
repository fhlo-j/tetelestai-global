import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Simulate API call
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <div className="bg-divine-light py-14">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-divine mb-4">
            Stay Connected with the Latest Updates
          </h2>
          <p className="text-gray-700 mb-6">
            Subscribe to our newsletter and receive spiritual insights, event
            updates, and the latest sermons directly in your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-divine focus:border-transparent"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap flex items-center justify-center gap-2"
            >
              Subscribe
              <Send size={16} />
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
