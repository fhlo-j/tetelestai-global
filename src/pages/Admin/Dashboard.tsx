
import { useState } from 'react';
import { LogOut, Menu, X, Home, Calendar, Video, Music, FileText, Image, Megaphone, Users } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const handleLogout = () => navigate('/');
  
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
    { name: 'Events', icon: <Calendar size={20} />, path: '/admin/events' },
    { name: 'Video Sermons', icon: <Video size={20} />, path: '/admin/sermons/video' },
    { name: 'Audio Sermons', icon: <Music size={20} />, path: '/admin/sermons/audio' },
    { name: 'Blog Posts', icon: <FileText size={20} />, path: '/admin/blog' },
    { name: 'Media Gallery', icon: <Image size={20} />, path: '/admin/gallery' },
    { name: 'Announcements', icon: <Megaphone size={20} />, path: '/admin/announcements' },
    { name: 'Ministries', icon: <Users size={20} />, path: '/admin/ministries' },
    { name: 'Registrations', icon: <Users size={20} />, path: '/admin/registrations' },
    { name: 'Service Times', icon: <Calendar size={20} />, path: '/admin/service-times' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - Mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-divine text-white z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold">Tetelestai</span>
              <span className="text-gold font-heading text-sm">Admin</span>
            </Link>
            <button className="md:hidden text-white" onClick={closeSidebar}>
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActivePath(item.path) 
                        ? 'bg-white/10 text-white font-medium' 
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="pt-4 border-t border-white/20">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-white/80 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              className="md:hidden text-gray-600"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center ml-auto gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Admin User"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium hidden lg:block">Admin User</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
