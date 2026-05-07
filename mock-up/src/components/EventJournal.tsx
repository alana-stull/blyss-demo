import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Plus } from 'lucide-react';

interface JournalEntry {
  id: string;
  eventName: string;
  venue: string;
  date: string;
  rating: number;
  notes: string;
  image: string;
}

const journalEntries: JournalEntry[] = [
  {
    id: '1',
    eventName: 'Live Jazz Night',
    venue: 'Blue Note',
    date: 'Feb 7, 2026',
    rating: 5,
    notes: 'Amazing performance! Marcus Thompson Quartet was incredible. Would definitely go again.',
    image: 'https://images.unsplash.com/photo-1647168268629-1a25ce0c0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwdmVudWV8ZW58MXx8fHwxNzY5NjM1NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    eventName: 'Morning Yoga & Meditation',
    venue: 'Serenity Studio',
    date: 'Feb 2, 2026',
    rating: 4,
    notes: 'Great way to start the weekend. The instructor was knowledgeable and the space was peaceful.',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjBjbGFzc3xlbnwxfHx8fDE3Njk2MzU1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    eventName: 'Italian Cooking Workshop',
    venue: 'Culinary Collective',
    date: 'Jan 25, 2026',
    rating: 5,
    notes: 'Learned to make authentic pasta from scratch! Chef was patient and fun. Bringing Sarah next time.',
    image: 'https://images.unsplash.com/photo-1758279745466-f5f4087a87d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBraXRjaGVufGVufDF8fHx8MTc2OTYzNTE1MXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    eventName: 'Wine Tasting Experience',
    venue: 'The Cellar',
    date: 'Jan 18, 2026',
    rating: 4,
    notes: 'Fantastic selection of local wines. Learned so much about the region\'s vineyards.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwdGFzdGluZ3xlbnwxfHx8fDE3Mzg0MjYwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '5',
    eventName: 'Saturday Farmers Market',
    venue: 'Riverside Market',
    date: 'Jan 11, 2026',
    rating: 5,
    notes: 'Perfect morning activity. Got fresh produce and met some great local vendors.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwbWFya2V0fGVufDF8fHx8MTczODQyNjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '6',
    eventName: 'Sunset Hike',
    venue: 'Echo Ridge Trail',
    date: 'Dec 20, 2025',
    rating: 5,
    notes: 'Breathtaking views at the summit. Perfect weather and great company.',
    image: 'https://images.unsplash.com/photo-1600346774255-f8e8d0b33309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBvdXRkb29yJTIwdHJhaWx8ZW58MXx8fHwxNzY5NjM1NTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '7',
    eventName: 'Jazz Brunch',
    venue: 'Blue Note',
    date: 'Dec 14, 2025',
    rating: 4,
    notes: 'Love the live music during brunch. The eggs benedict was delicious.',
    image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function EventJournal() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'year' | 'month'>('all');

  // Filter entries based on selected period
  const filterEntries = () => {
    const now = new Date('2026-01-30'); // Current date from context
    
    if (filter === 'all') {
      return journalEntries;
    } else if (filter === 'year') {
      // Filter to 2026 only
      return journalEntries.filter(entry => entry.date.includes('2026'));
    } else if (filter === 'month') {
      // Filter to February 2026 only
      return journalEntries.filter(entry => entry.date.includes('Feb') && entry.date.includes('2026'));
    }
    return journalEntries;
  };

  const filteredEntries = filterEntries();

  // Calculate stats based on filtered entries
  const calculateStats = () => {
    if (filter === 'all') {
      // All time stats - larger numbers
      return {
        events: 87,
        venues: 42,
        avgRating: '4.6',
      };
    } else if (filter === 'year') {
      // This year stats - 2026
      return {
        events: 34,
        venues: 22,
        avgRating: '4.7',
      };
    } else if (filter === 'month') {
      // This month stats - February 2026
      return {
        events: 11,
        venues: 8,
        avgRating: '4.5',
      };
    }
    
    return {
      events: 0,
      venues: 0,
      avgRating: '0.0',
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-full bg-background pb-4">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="flex-1">Event Journal</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all' as const, label: 'All Time' },
            { id: 'year' as const, label: 'This Year' },
            { id: 'month' as const, label: 'This Month' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                filter === tab.id
                  ? 'bg-[#375169] text-white'
                  : 'bg-card border border-border text-[#333333]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Stats summary */}
      <div className="px-5 pt-6 pb-4">
        <div className="grid grid-cols-3 gap-4 p-4 bg-card rounded-xl border border-border">
          <div className="text-center">
            <p className="font-semibold text-[#333333]">{stats.events}</p>
            <p className="text-xs text-[#8b8f94]">Events</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#333333]">{stats.venues}</p>
            <p className="text-xs text-[#8b8f94]">Venues</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#333333]">{stats.avgRating}</p>
            <p className="text-xs text-[#8b8f94]">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Journal entries */}
      <div className="px-5 space-y-4 pb-20">
        <h3 className="text-[#8b8f94]">Recent</h3>
        
        {filteredEntries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => navigate(`/journal/${entry.id}`)}
            className="w-full bg-card rounded-2xl border border-border overflow-hidden hover:border-[#5ba8d3] hover:shadow-md transition-all text-left"
          >
            {/* Event image */}
            <div className="h-40 bg-[#e3e4e6]">
              <img
                src={entry.image}
                alt={entry.eventName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Entry content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="truncate mb-1">{entry.eventName}</h4>
                  <div className="flex items-center gap-2 text-sm text-[#8b8f94]">
                    <MapPin className="w-4 h-4" />
                    <span>{entry.venue}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < entry.rating ? 'text-[#f2c05a]' : 'text-[#e3e4e6]'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm text-[#333333] leading-relaxed mb-3">
                {entry.notes}
              </p>

              <div className="flex items-center gap-2 text-xs text-[#8b8f94]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{entry.date}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Floating action button */}
      <button
        onClick={() => navigate('/journal/add')}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-r from-[#5ba8d3] to-[#4a96c2] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-10"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}