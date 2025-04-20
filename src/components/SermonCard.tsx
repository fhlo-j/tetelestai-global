import { Play, Download, Clock, Video, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SermonCardProps {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  imageUrl: string;
  featured?: boolean;
  type: 'audio' | 'video';
  url: string;
  downloads?: number;
}

const SermonCard = ({ 
  id, 
  title, 
  speaker, 
  date, 
  duration, 
  imageUrl, 
  featured = false, 
  type, 
  url,
  downloads = 0 
}: SermonCardProps) => {
  return (
    <div className={`rounded-lg overflow-hidden bg-white card-shadow ${featured ? 'border-2 border-gold' : ''}`}>
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          {featured && (
            <span className="absolute top-4 right-4 bg-gold text-black text-xs px-2 py-1 rounded font-medium">
              Featured
            </span>
          )}
          <div className="text-white flex items-center gap-2">
            <Clock size={14} />
            <span className="text-sm">{duration}</span>
          </div>
          <div className="ml-auto text-white">
            {type === 'video' ? (
              <span className="flex items-center gap-1">
                <Video size={14} />
                <span className="text-xs">Video</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Music size={14} />
                <span className="text-xs">Audio</span>
              </span>
            )}
          </div>
        </div>
        <Link 
          to={`/sermons/${id}`} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-divine/80 hover:bg-divine text-white rounded-full p-4 transition-colors"
        >
          <Play size={22} className="ml-1" />
        </Link>
      </div>
      
      <div className="p-4">
        <Link to={`/sermons/${id}`}>
          <h3 className="text-lg font-semibold hover:text-divine transition-colors line-clamp-2">{title}</h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm text-gray-600">{speaker}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
          {type === 'audio' && (
            <div className="flex items-center gap-2">
              <a 
                href={url} 
                download={`${title}-${speaker}.mp3`}
                className="text-divine hover:text-divine-dark flex items-center gap-1" 
                title="Download sermon"
              >
                <Download size={18} />
                <span className="text-xs text-gray-500">{downloads} downloads</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SermonCard;
