
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Ministry data
const ministries = [
  { 
    id: "worship", 
    title: "Worship", 
    desc: "Engaging the presence of God through anointed praise and worship.",
    fullDescription: `Our worship ministry is dedicated to creating an atmosphere where people can encounter the presence of God through anointed music and praise. We believe worship is more than just singing songs; it's a lifestyle of honoring God in everything we do.

The worship team consists of dedicated musicians, vocalists, and technical personnel who work together to lead the congregation in corporate worship during our services and events.

We emphasize both the heart posture and skill development in our worship ministry, providing training and mentorship to help team members grow in their gifts and spiritual maturity.`,
    goals: [
      "To create an atmosphere where people can encounter God's presence",
      "To express authentic worship that honors God",
      "To disciple and develop worshippers who live lives of worship",
      "To utilize music and the arts as a means to reach hearts for Christ"
    ],
    activities: [
      "Sunday worship services",
      "Worship nights",
      "Music training and development",
      "Songwriting sessions"
    ],
    getInvolved: "If you have musical talents or technical skills and a heart for worship, we'd love to have you join our worship team. Contact our worship director for more information on auditions and training opportunities.",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
    bannerUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e"
  },
  { 
    id: "teaching", 
    title: "Teaching", 
    desc: "In-depth biblical teaching that transforms lives and renews minds.",
    fullDescription: `Our teaching ministry is committed to sound biblical instruction that helps believers grow in their knowledge of God's Word and its application to daily life. We believe the Bible is the inspired Word of God and the foundation for all that we believe and practice.

Through various formats including sermons, Bible studies, and discipleship courses, we aim to equip the saints for the work of ministry and build up the body of Christ to maturity.

Our teaching emphasizes practical application, helping believers not only understand scriptural truth but also live it out in their daily lives.`,
    goals: [
      "To teach the whole counsel of God's Word with clarity and accuracy",
      "To equip believers to study and apply Scripture for themselves",
      "To develop mature disciples who can discern truth and teach others",
      "To address contemporary issues from a biblical perspective"
    ],
    activities: [
      "Sunday sermons",
      "Midweek Bible studies",
      "Discipleship courses",
      "Leadership development classes"
    ],
    getInvolved: "If you have a passion for God's Word and teaching others, consider joining one of our Bible study groups or inquire about teaching opportunities in our various educational programs.",
    imageUrl: "https://images.unsplash.com/photo-1551038247-3d9af20df552",
    bannerUrl: "https://images.unsplash.com/photo-1551038247-3d9af20df552"
  },
  { 
    id: "community", 
    title: "Community", 
    desc: "Building strong relationships and fostering spiritual growth.",
    fullDescription: `Our community ministry focuses on creating meaningful connections that foster spiritual growth and support among believers. We believe the Christian life is not meant to be lived in isolation, but in authentic community where we can encourage one another and grow together.

Through small groups, fellowship events, and informal gatherings, we create spaces where people can develop deep relationships, share life's joys and challenges, and practice the "one another" commands of Scripture.

We emphasize creating inclusive environments where everyone feels welcome and valued as part of our church family.`,
    goals: [
      "To foster meaningful relationships among church members",
      "To provide spaces for authentic sharing and mutual support",
      "To encourage practical application of faith in daily life",
      "To integrate newcomers into the life of the church"
    ],
    activities: [
      "Home small groups",
      "Fellowship meals and gatherings",
      "Interest-based groups (sports, hobbies, etc.)",
      "Community service projects"
    ],
    getInvolved: "Everyone is encouraged to join a small group or community activity. You can also consider hosting or leading a group if you have a heart for bringing people together.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bannerUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  { 
    id: "outreach", 
    title: "Outreach", 
    desc: "Extending God's love through humanitarian efforts and evangelism.",
    fullDescription: `Our outreach ministry is dedicated to extending God's love beyond the walls of our church through humanitarian efforts and evangelism. We believe we are called to be the hands and feet of Jesus, reaching out to those in need with practical help and the message of hope.

Through various initiatives including local community service, support for vulnerable populations, and global missions, we seek to demonstrate Christ's love in tangible ways while sharing the good news of the gospel.

We partner with various organizations and ministries to maximize our impact and address diverse needs in our community and around the world.`,
    goals: [
      "To demonstrate God's love through practical service",
      "To share the gospel message with those who don't know Christ",
      "To address physical, emotional, and spiritual needs",
      "To develop partnerships that expand our reach and impact"
    ],
    activities: [
      "Food and clothing drives",
      "Community service projects",
      "Evangelistic outreach events",
      "Mission trips (local and global)"
    ],
    getInvolved: "There are many ways to get involved in outreach, from volunteering at local events to participating in mission trips. Contact our outreach coordinator to find opportunities that match your passions and gifts.",
    imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840",
    bannerUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840"
  }
];

const MinistryDetail = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  
  const ministry = ministries.find(m => m.id === id);
  
  useEffect(() => {
    if (!ministry) {
      navigate('/not-found');
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
            <p className="mb-3 text-sm text-gray-500 font-medium">Our Ministries:</p>
            <div className="flex flex-wrap gap-2">
              {ministries.map(m => (
                <Link
                  key={m.id}
                  to={`/ministry/${m.id}`}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    m.id === id 
                      ? 'bg-divine text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <h2 className="text-xl font-semibold text-divine mb-4">About Our {ministry.title} Ministry</h2>
                <div className="prose max-w-none text-gray-700">
                  {ministry.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
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
                <h2 className="text-xl font-semibold text-divine mb-4">Our Goals</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {ministry.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
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
                <h2 className="text-xl font-semibold text-divine mb-4">Activities & Programs</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {ministry.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
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
                <h2 className="text-xl font-semibold text-divine mb-4">Related Links</h2>
                <ul className="space-y-3">
                  <li>
                    <Link to="/events" className="text-divine hover:underline flex items-center gap-1">
                      <ChevronRight size={16} />
                      <span>Upcoming Events</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/sermons" className="text-divine hover:underline flex items-center gap-1">
                      <ChevronRight size={16} />
                      <span>Related Sermons</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/service-times" className="text-divine hover:underline flex items-center gap-1">
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
