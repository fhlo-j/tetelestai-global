import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchMinistries } from "@/hooks/useMinistries";
import { useQuery } from "@tanstack/react-query";

// Ministry data

const MinistryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ministries = [], error } = useQuery({
    queryKey: ["ministries"],
    queryFn: fetchMinistries,
  });

  const ministry = ministries.find((m) => m.id === id);

  useEffect(() => {
    if (!ministry) {
      navigate("/not-found");
    }

    window.scrollTo(0, 0);
  }, [ministry, navigate]);

  if (!ministry) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img
            src={ministry.bannerUrl}
            alt={ministry.title}
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
            {ministry.title} Ministry
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-white/90 max-w-2xl mx-auto"
          >
            {ministry.desc}
          </motion.p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 py-16">
        <div className="container-custom">
          {/* Quick Ministry Navigation */}
          <div className="mb-10 bg-white p-4 rounded-lg shadow-sm">
            <p className="mb-3 text-sm text-gray-500 font-medium">
              Our Ministries:
            </p>
            <div className="flex flex-wrap gap-2">
              {ministries.map((m) => (
                <Link
                  key={m.id}
                  to={`/ministry/${m.id}`}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    m.id === id
                      ? "bg-divine text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {m.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold text-divine mb-4">
                  About Our {ministry.title} Ministry
                </h2>
                <div className="prose max-w-none text-gray-700">
                  {ministry.fullDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </motion.section>

              {/* Goals */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold text-divine mb-4">
                  Our Goals
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {ministry.goals.map((goal, index) => (
                    <li key={index}>{goal.value}</li>
                  ))}
                </ul>
              </motion.section>

              {/* Activities */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold text-divine mb-4">
                  Activities & Programs
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {ministry.activities.map((activity, index) => (
                    <li key={index}>{activity.value}</li>
                  ))}
                </ul>
              </motion.section>
            </div>

            <div className="space-y-8">
              {/* Ministry Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={ministry.imageUrl}
                  alt={ministry.title}
                  className="w-full h-auto"
                />
              </motion.div>

              {/* Get Involved */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-divine text-white rounded-lg p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4">Get Involved</h2>
                <p className="mb-4">{ministry.getInvolved}</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1 bg-white text-divine px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Contact Us <ChevronRight size={16} />
                </Link>
              </motion.section>

              {/* Related Links */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold text-divine mb-4">
                  Related Links
                </h2>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/events"
                      className="text-divine hover:underline flex items-center gap-1"
                    >
                      <ChevronRight size={16} />
                      <span>Upcoming Events</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/sermons"
                      className="text-divine hover:underline flex items-center gap-1"
                    >
                      <ChevronRight size={16} />
                      <span>Related Sermons</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/service-times"
                      className="text-divine hover:underline flex items-center gap-1"
                    >
                      <ChevronRight size={16} />
                      <span>Service Times</span>
                    </Link>
                  </li>
                </ul>
              </motion.section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MinistryDetail;
