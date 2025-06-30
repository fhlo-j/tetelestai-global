import { formatDate } from '@/utils/dateFormatter'
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EventCardProps {
  _id: string
  title: string
  date: string
  time: string
  location: string
  imageUrl: string
  featured?: boolean
  description?: string
}

const EventCard = ({
  _id,
  title,
  date,
  time,
  location,
  imageUrl,
  featured = false,
  description,
}: EventCardProps) => {
  return (
    <div
      className={`rounded-lg overflow-hidden bg-white card-shadow ${
        featured ? 'border-2 border-gold' : ''
      }`}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          {featured && (
            <span className="absolute top-4 right-4 bg-gold text-black text-xs px-2 py-1 rounded font-medium">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <Link to={`/events/${_id}`}>
          <h3 className="text-lg font-semibold hover:text-divine transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar
              size={14}
              className="text-divine"
            />
            <span>
              {formatDate(date)} • {time}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin
              size={14}
              className="text-divine"
            />
            <span>{location}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/events/${_id}`}
            className="text-divine hover:text-divine-dark text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View Details
            <ExternalLink size={14} />
          </Link>

          <Link
            to={`/events/${_id}#register`}
            className="bg-divine text-white hover:bg-divine-dark text-sm px-3 py-1.5 rounded transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard
