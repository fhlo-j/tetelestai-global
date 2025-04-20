import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import PageHeader from '../components/about/PageHeader';
import OurStory from '../components/about/OurStory';
import VisionMission from '../components/about/VisionMission';
import CoreBeliefs from '../components/about/CoreBeliefs';
import MinistryArms from '../components/about/MinistryArms';
import CallToAction from '../components/about/CallToAction';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { leaders } from '../data/leaders';

const About = () => {
  const seniorPastor = leaders.find(leader => leader.isSeniorPastor);
  const otherLeaders = leaders
    .filter(leader => !leader.isSeniorPastor)
    .sort((a, b) => a.orderRank - b.orderRank);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader />
      <OurStory />
      <VisionMission />
      <CoreBeliefs />
      
      {/* Leadership Team */}
      <section className="section-padding heavenly-gradient">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-divine mb-4">Our Leadership</h2>
            <p className="text-gray-700">
              Meet the dedicated team that guides our ministry with wisdom, vision, and a heart for God's people.
            </p>
          </div>
          
          {/* Featured Senior Pastor Card */}
          {seniorPastor && (
            <div className="mb-12">
              <Link to={`/leader/${seniorPastor.id}`} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border border-gold/30">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="md:col-span-1">
                      <img 
                        src={seniorPastor.image} 
                        alt={seniorPastor.name} 
                        className="w-full h-full object-cover object-center md:h-full"
                      />
                    </div>
                    <div className="p-8 md:col-span-2 bg-gradient-to-br from-divine/5 to-gold/5">
                      <div className="inline-block bg-gold text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                        Senior Leadership
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{seniorPastor.name}</h3>
                      <p className="text-divine font-medium mb-4">{seniorPastor.role}</p>
                      <p className="text-gray-700 mb-6 line-clamp-3">{seniorPastor.bio}</p>
                      
                      <div className="flex items-center gap-3 text-divine">
                        <Mail size={18} />
                        <span>{seniorPastor.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          
          {/* Other Leadership Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherLeaders.map((leader) => (
              <Link key={leader.id} to={`/leader/${leader.id}`} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
                  <img src={leader.image} alt={leader.name} className="w-full h-64 object-cover object-center" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{leader.name}</h3>
                    <p className="text-gold font-medium mb-3">{leader.role}</p>
                    <p className="text-gray-700 mb-4 line-clamp-3">{leader.bio}</p>
                    
                    <div className="flex items-center gap-2 text-divine-dark">
                      <Mail size={16} />
                      <span className="text-sm">{leader.email}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <MinistryArms />
      <CallToAction />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default About;
