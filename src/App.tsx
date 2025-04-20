
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import Index from "./pages/Index";
import About from "./pages/About";
import Sermons from "./pages/Sermons";
import SermonDetail from "./pages/SermonDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Gallery from "./pages/Gallery";
import MinistryDetail from "./pages/MinistryDetail";
import ServiceTimes from "./pages/ServiceTimes";
import Announcements from "./pages/Announcements";
import LeaderDetail from "./pages/LeaderDetail";

// Admin imports
import AdminRoutes from "./pages/Admin/AdminRoutes";

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// AnimatedRoutes component to handle route animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/sermons/:id" element={<SermonDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/ministry/:id" element={<MinistryDetail />} />
        <Route path="/service-times" element={<ServiceTimes />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/leader/:id" element={<LeaderDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <AnimatedRoutes />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
