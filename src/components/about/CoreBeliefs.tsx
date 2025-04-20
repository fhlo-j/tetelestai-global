
import React from 'react';

const BELIEFS = [
  {
    title: "The Bible",
    description: "We believe the Bible is God's Word, divinely inspired and without error, serving as the ultimate authority for faith and life."
  },
  {
    title: "Salvation Through Christ",
    description: "We believe salvation comes through faith in Jesus Christ alone, whose death and resurrection provide forgiveness and eternal life."
  },
  {
    title: "The Holy Spirit",
    description: "We believe in the Holy Spirit who indwells believers, empowering them for godly living and spiritual service."
  },
  {
    title: "The Church",
    description: "We believe the Church is the body of Christ, called to worship, fellowship, discipleship, and evangelism."
  },
  {
    title: "Divine Healing",
    description: "We believe God heals through prayer and faith, according to His sovereign will and purpose."
  },
  {
    title: "Christ's Return",
    description: "We believe Jesus Christ will return visibly and personally to establish His eternal kingdom."
  }
];

const CoreBeliefs = () => {
  return (
    <section className="section-padding angelic-gradient">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-divine mb-4">Our Core Beliefs</h2>
          <p className="text-gray-700">
            Tetelestai Global Ministry is founded on these fundamental biblical principles that guide our teaching and ministry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BELIEFS.map((belief, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-divine">{belief.title}</h3>
              <p className="text-gray-700">{belief.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreBeliefs;
