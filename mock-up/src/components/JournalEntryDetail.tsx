import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Calendar, Star } from 'lucide-react';

interface JournalEntryData {
  id: string;
  eventName: string;
  venue: string;
  date: string;
  rating: number;
  notes: string;
  image: string;
}

const mockEntries: Record<string, JournalEntryData> = {
  '1': {
    id: '1',
    eventName: 'Live Jazz Night',
    venue: 'Blue Note Jazz Club',
    date: 'Feb 7, 2026',
    rating: 5,
    notes: 'Amazing performance! Marcus Thompson Quartet was incredible. The sound quality was perfect, and the intimate atmosphere made the experience even more special. The venue has such great acoustics and the staff was very attentive.\n\nWe sat near the stage and could see every expression on the musicians\' faces. The setlist was a perfect mix of classic standards and original compositions. Would definitely come back again!',
    image: 'https://images.unsplash.com/photo-1647168268629-1a25ce0c0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwdmVudWV8ZW58MXx8fHwxNzY5NjM1NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  '2': {
    id: '2',
    eventName: 'Morning Yoga & Meditation',
    venue: 'Serenity Studio',
    date: 'Feb 2, 2026',
    rating: 4,
    notes: 'Great way to start the weekend. The instructor was knowledgeable and the space was peaceful. Really enjoyed the guided meditation session at the end.',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjBjbGFzc3xlbnwxfHx8fDE3Njk2MzU1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  '3': {
    id: '3',
    eventName: 'Italian Cooking Workshop',
    venue: 'Culinary Collective',
    date: 'Jan 25, 2026',
    rating: 5,
    notes: 'Learned to make authentic pasta from scratch! Chef was patient and fun. Bringing Sarah next time. The techniques we learned were so practical and the recipes were delicious.',
    image: 'https://images.unsplash.com/photo-1758279745466-f5f4087a87d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBraXRjaGVufGVufDF8fHx8MTc2OTYzNTE1MXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
};

export function JournalEntryDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const entry = id ? mockEntries[id] : null;

  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-[#8b8f94]">Entry not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image with overlay controls */}
      <div className="relative h-80 bg-[#e3e4e6]">
        <img
          src={entry.image}
          alt={entry.eventName}
          className="w-full h-full object-cover"
        />
        {/* Overlay controls */}
        <div className="absolute top-0 left-0 right-0 p-5 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
        </div>
      </div>

      {/* Entry Info */}
      <div className="px-5 pt-5">
        {/* Name and Rating */}
        <div className="mb-4">
          <h2 className="mb-2">{entry.eventName}</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < entry.rating
                      ? 'fill-[#f2c05a] text-[#f2c05a]'
                      : 'fill-[#e3e4e6] text-[#e3e4e6]'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#333333]">
              {entry.rating}.0
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          {/* Venue */}
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#333333] font-medium">{entry.venue}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#333333] font-medium">{entry.date}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-[#375169] mb-3">My Notes</h3>
          <p className="text-[#333333] leading-relaxed whitespace-pre-line">
            {entry.notes}
          </p>
        </div>
      </div>
    </div>
  );
}
