
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  featured?: boolean;
}

const BlogCard = ({ id, title, excerpt, author, date, imageUrl, featured = false }: BlogCardProps) => {
  return (
    <div className={`rounded-lg overflow-hidden bg-white card-shadow ${featured ? 'border-2 border-gold' : ''}`}>
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        {featured && (
          <span className="absolute top-4 right-4 bg-gold text-black text-xs px-2 py-1 rounded font-medium">
            Featured
          </span>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/blog/${id}`}>
          <h3 className="text-lg font-semibold hover:text-divine transition-colors line-clamp-2">{title}</h3>
        </Link>
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{excerpt}</p>
        
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
        </div>
        
        <Link 
          to={`/blog/${id}`}
          className="mt-3 inline-flex items-center gap-1 text-divine hover:text-divine-dark text-sm font-medium transition-colors"
        >
          Read More
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
