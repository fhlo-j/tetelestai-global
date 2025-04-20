
import React from 'react';
import { ArrowRight, BookOpen, Globe } from 'lucide-react';

const VisionMission = () => {
  return (
    <section className="section-padding glory-gradient">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="inline-flex items-center justify-center rounded-full bg-divine-light p-3 mb-4 text-divine">
              <BookOpen size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-700 mb-4">
              To proclaim the finished work of Christ through preaching the Gospel, 
              making disciples, and demonstrating God's love through humanitarian efforts.
            </p>
            <ul className="space-y-3">
              {['Proclaim the Gospel message with clarity and power',
                'Equip believers for effective ministry and spiritual growth',
                'Extend compassion and practical help to those in need'].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight size={18} className="text-divine mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="inline-flex items-center justify-center rounded-full bg-divine-light p-3 mb-4 text-divine">
              <Globe size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
            <p className="text-gray-700 mb-4">
              To see individuals, families, and communities transformed by the power 
              of God's Word and the reality of Christ's finished work on the cross.
            </p>
            <ul className="space-y-3">
              {['Establish centers of spiritual growth and community impact',
                'Reach the unreached with the message of salvation',
                'Train the next generation of Christian leaders'].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight size={18} className="text-divine mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
