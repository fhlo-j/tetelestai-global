import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { ArrowLeft, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { leaders } from '../data/leaders';

const LeaderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const leader = leaders.find(leader => leader.id === id);

  if (!leader) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold mb-4">Leader Not Found</h1>
          <p className="text-gray-600 mb-6">The leader profile you're looking for doesn't exist.</p>
          <Link to="/about" className="btn-primary">
            Back to Leadership
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const SocialIcon = ({ type }: { type: keyof NonNullable<typeof leader.socialMedia> }) => {
    const icons = {
      facebook: <Facebook size={20} />,
      twitter: <Twitter size={20} />,
      instagram: <Instagram size={20} />,
      linkedin: <Linkedin size={20} />
    };
    
    const url = leader.socialMedia?.[type];
    if (!url) return null;
    
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-divine/10 hover:bg-divine/20 text-divine p-2 rounded-full transition-colors"
      >
        {icons[type]}
      </a>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 celestial-gradient">
        <div className="container-custom">
          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 text-divine hover:text-divine-dark mb-8"
          >
            <ArrowLeft size={18} />
            Back to Leadership
          </Link>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src={leader.image} 
                alt={leader.name} 
                className="w-full h-auto max-h-80 object-cover rounded-lg shadow-lg"
              />
              
              <div className="flex flex-wrap gap-4 mt-6 items-center">
                {leader.email && (
                  <a href={`mailto:${leader.email}`} className="flex items-center gap-2 text-divine hover:text-divine-dark">
                    <Mail size={18} />
                    {leader.email}
                  </a>
                )}
                
                {leader.phone && (
                  <a href={`tel:${leader.phone}`} className="flex items-center gap-2 text-divine hover:text-divine-dark">
                    <Phone size={18} />
                    {leader.phone}
                  </a>
                )}
              </div>
              
              <div className="flex gap-3 mt-4">
                <SocialIcon type="facebook" />
                <SocialIcon type="twitter" />
                <SocialIcon type="instagram" />
                <SocialIcon type="linkedin" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{leader.name}</h1>
              <p className="text-divine text-xl font-semibold mb-4">{leader.role}</p>
              
              {leader.visionStatement && (
                <blockquote className="border-l-4 border-gold pl-4 my-4 italic text-gray-600">
                  "{leader.visionStatement}"
                </blockquote>
              )}
              
              <div className="prose max-w-none text-gray-700">
                <p>{leader.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {leader.ministryFocus && leader.ministryFocus.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-divine">Ministry Focus</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {leader.ministryFocus.map((focus, index) => (
                    <li key={index} className="text-gray-700">{focus}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {leader.education && leader.education.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-divine">Education & Certifications</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {leader.education.map((edu, index) => (
                    <li key={index} className="text-gray-700">{edu}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {leader.familyInfo && (
            <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
              <h2 className="text-xl font-semibold mb-4 text-divine">Family</h2>
              <p className="text-gray-700">{leader.familyInfo}</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Other Leaders Section */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-semibold mb-6 text-center">Other Leadership Team Members</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders
              .filter(l => l.id !== leader.id)
              .sort((a, b) => a.orderRank - b.orderRank)
              .slice(0, 3)
              .map(otherLeader => (
                <Link 
                  to={`/leader/${otherLeader.id}`} 
                  key={otherLeader.id}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                >
                  <img 
                    src={otherLeader.image} 
                    alt={otherLeader.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{otherLeader.name}</h3>
                    <p className="text-divine">{otherLeader.role}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default LeaderDetail;
