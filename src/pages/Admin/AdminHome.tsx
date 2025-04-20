
import { ArrowUp, ArrowDown, Users, Video, Music, Calendar, Eye, Clock, FileText } from 'lucide-react';

const AdminHome = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Visitors" 
          value="2,458" 
          change={12} 
          icon={<Users size={22} className="text-blue-500" />} 
        />
        <StatCard 
          title="Sermon Views" 
          value="854" 
          change={-3} 
          icon={<Video size={22} className="text-green-500" />} 
        />
        <StatCard 
          title="Audio Downloads" 
          value="352" 
          change={27} 
          icon={<Music size={22} className="text-purple-500" />} 
        />
        <StatCard 
          title="Event Registrations" 
          value="75" 
          change={18} 
          icon={<Calendar size={22} className="text-orange-500" />} 
        />
      </div>
      
      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Sermons</h2>
          <div className="space-y-4">
            {[
              { title: "The Power of Divine Purpose", views: "142", date: "June 12, 2024", type: "video" },
              { title: "Embracing God's Grace", views: "98", date: "June 5, 2024", type: "audio" },
              { title: "Finding Rest in God's Presence", views: "87", date: "May 29, 2024", type: "audio" }
            ].map((sermon, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">{sermon.title}</p>
                  <p className="text-xs text-gray-500">{sermon.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Eye size={14} />
                    {sermon.views}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {sermon.type}
                  </span>
                </div>
              </div>
            ))}
            <a href="/admin/sermons" className="text-divine hover:underline text-sm">
              View all sermons →
            </a>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {[
              { title: "Annual Worship Conference 2024", date: "July 15-17, 2024", registrations: "32" },
              { title: "Youth Revival Weekend", date: "June 24-25, 2024", registrations: "19" },
              { title: "Women's Prayer Breakfast", date: "June 18, 2024", registrations: "24" }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users size={14} />
                  <span>{event.registrations} registrations</span>
                </div>
              </div>
            ))}
            <a href="/admin/events" className="text-divine hover:underline text-sm">
              Manage events →
            </a>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-6 bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { type: "upload", content: "New sermon uploaded: 'Walking in God's Vision'", time: "1 hour ago" },
            { type: "registration", content: "5 new registrations for 'Annual Worship Conference 2024'", time: "3 hours ago" },
            { type: "comment", content: "New comment on sermon 'The Power of Divine Purpose'", time: "5 hours ago" },
            { type: "blog", content: "Blog post published: '5 Ways to Improve Your Prayer Life'", time: "1 day ago" }
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-divine-light flex items-center justify-center text-divine flex-shrink-0">
                <ActivityIcon type={activity.type} />
              </div>
              <div>
                <p className="text-sm">{activity.content}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: { title: string; value: string; change: number; icon: React.ReactNode }) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <span>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-semibold">{value}</h3>
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-xs font-medium">
            {isPositive ? `+${change}%` : `${change}%`}
          </span>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </div>
      </div>
    </div>
  );
};

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'upload':
      return <Video size={16} />;
    case 'registration':
      return <Users size={16} />;
    case 'comment':
      return <MessageSquare size={16} />;
    case 'blog':
      return <FileText size={16} />;
    default:
      return <Activity size={16} />;
  }
};

// Declare missing components from Lucide that might be needed
const MessageSquare = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Activity = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default AdminHome;
