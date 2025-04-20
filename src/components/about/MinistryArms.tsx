
import React from 'react';
import { Church, BookOpen, Users, Heart, ArrowRight } from 'lucide-react';

const MINISTRIES = [
  {
    icon: Church,
    title: "Worship Ministry",
    description: "Our worship ministry creates an atmosphere where people can experience God's presence through anointed praise and worship.",
    activities: [
      "Sunday worship services",
      "Worship nights",
      "Worship training and development"
    ]
  },
  {
    icon: BookOpen,
    title: "Teaching Ministry",
    description: "Focused on in-depth Biblical teaching that equips believers with knowledge and understanding of God's Word.",
    activities: [
      "Bible studies",
      "Discipleship courses",
      "Leadership development"
    ]
  },
  {
    icon: Users,
    title: "Youth Ministry",
    description: "Dedicated to raising a generation of young people who are passionate about God and His purposes.",
    activities: [
      "Youth services",
      "Mentorship programs",
      "Youth missions and outreach"
    ]
  },
  {
    icon: Heart,
    title: "Outreach Ministry",
    description: "Extending God's love through humanitarian efforts, community service, and evangelism.",
    activities: [
      "Community service projects",
      "Humanitarian aid",
      "Evangelistic campaigns"
    ]
  }
];

const MinistryArms = () => {
  return (
    <section className="section-padding celestial-gradient">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-divine mb-4">Ministry Arms</h2>
          <p className="text-gray-700">
            Tetelestai Global extends its reach through these specialized ministry departments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MINISTRIES.map((ministry, index) => (
            <div key={index} className="flex gap-4 p-6 bg-divine-light rounded-lg">
              <div className="inline-flex items-start justify-center rounded-full bg-divine p-3 text-white flex-shrink-0 mt-1">
                <ministry.icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{ministry.title}</h3>
                <p className="text-gray-700 mb-3">{ministry.description}</p>
                <ul className="space-y-2">
                  {ministry.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <ArrowRight size={16} className="text-divine" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MinistryArms;
