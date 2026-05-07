import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, MapPin, Calendar, Users, X } from 'lucide-react';
import blyssLogo from 'figma:asset/23292cf5e96f0a3b741483ac64e223f571497176.png';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image: string;
  tags: string[];
  attendeeCount: number;
  isPublic: boolean;
}

interface Venue {
  id: string;
  name: string;
  type: string;
  location: string;
  distance: string;
  image: string;
  rating: number;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Modern Art Gallery Opening',
    date: 'Sat, Feb 8',
    time: '7:00 PM',
    venue: 'The Contemporary',
    location: 'Downtown',
    image: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Art', 'Culture'],
    attendeeCount: 24,
    isPublic: true,
  },
  {
    id: '2',
    title: 'Live Jazz Night',
    date: 'Fri, Feb 7',
    time: '8:30 PM',
    venue: 'Blue Note',
    location: 'West End',
    image: 'https://images.unsplash.com/photo-1647168268629-1a25ce0c0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwdmVudWV8ZW58MXx8fHwxNzY5NjM1NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Music', 'Nightlife'],
    attendeeCount: 18,
    isPublic: true,
  },
  {
    id: '3',
    title: 'Morning Yoga & Meditation',
    date: 'Sun, Feb 9',
    time: '9:00 AM',
    venue: 'Serenity Studio',
    location: 'Midtown',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjBjbGFzc3xlbnwxfHx8fDE3Njk2MzU1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Wellness', 'Outdoors'],
    attendeeCount: 12,
    isPublic: false,
  },
  {
    id: '4',
    title: 'Sunday Brunch Club',
    date: 'Sun, Feb 9',
    time: '11:30 AM',
    venue: 'Café Lumière',
    location: 'Riverside',
    image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Food', 'Social'],
    attendeeCount: 8,
    isPublic: true,
  },
  {
    id: '5',
    title: 'Mountain Trail Hike',
    date: 'Sat, Feb 15',
    time: '8:00 AM',
    venue: 'Echo Ridge Trailhead',
    location: 'North County',
    image: 'https://images.unsplash.com/photo-1600346774255-f8e8d0b33309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBvdXRkb29yJTIwdHJhaWx8ZW58MXx8fHwxNzY5NjM1NTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Outdoors', 'Fitness'],
    attendeeCount: 15,
    isPublic: true,
  },
  {
    id: '6',
    title: 'Italian Cooking Workshop',
    date: 'Thu, Feb 13',
    time: '6:00 PM',
    venue: 'Culinary Collective',
    location: 'Arts District',
    image: 'https://images.unsplash.com/photo-1758279745466-f5f4087a87d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBraXRjaGVufGVufDF8fHx8MTc2OTYzNTE1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Food', 'Learning'],
    attendeeCount: 10,
    isPublic: false,
  },
];

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Café Lumière',
    type: 'Café · Brunch',
    location: 'Riverside',
    distance: '0.8 mi',
    image: 'https://images.unsplash.com/photo-1642647916129-3909c75c0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGludGVyaW9yfGVufDF8fHx8MTc2OTY4MTAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'The Contemporary',
    type: 'Gallery · Art Space',
    location: 'Downtown',
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Blue Note Jazz Club',
    type: 'Music Venue · Jazz',
    location: 'Arts District',
    distance: '2.1 mi',
    image: 'https://images.unsplash.com/photo-1758673142162-27000a0fc910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMG5pZ2h0bGlmZXxlbnwxfHx8fDE3Njk2ODcxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Echo Ridge Trailhead',
    type: 'Outdoor · Hiking',
    location: 'North Hills',
    distance: '5.4 mi',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjB0cmFpbCUyMG5hdHVyZXxlbnwxfHx8fDE3Njk2MzU1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
  },
];

const categories = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'food', label: 'Food & Drink', icon: '🍽️' },
  { id: 'culture', label: 'Culture', icon: '🎨' },
  { id: 'wellness', label: 'Wellness', icon: '🧘' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'outdoors', label: 'Outdoors', icon: '🌲' },
];

export function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState<'events' | 'venues'>('events');

  const filteredEvents = mockEvents
    .filter(event => event.isPublic || event.tags.some(tag => tag.toLowerCase().includes('open')))
    .filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter((event) => {
      if (selectedCategory === 'all') return true;
      return event.tags.some(tag => tag.toLowerCase().includes(selectedCategory));
    });

  const filteredVenues = mockVenues.filter((venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-background pb-4">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <img src={blyssLogo} alt="Blyss" className="h-8 w-8 mb-4" />

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8f94]" />
          <input
            type="text"
            placeholder="Search events or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-[#8b8f94]" />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView('events')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              view === 'events'
                ? 'bg-[#5ba8d3] text-white shadow-sm'
                : 'bg-card text-[#8b8f94] border border-border'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setView('venues')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              view === 'venues'
                ? 'bg-[#5ba8d3] text-white shadow-sm'
                : 'bg-card text-[#8b8f94] border border-border'
            }`}
          >
            Venues
          </button>
        </div>

        {/* Category filters - horizontal scroll */}
        {view === 'events' && (
          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#5ba8d3] text-white shadow-sm'
                    : 'bg-card text-[#333333] border border-border'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Events view */}
      {view === 'events' && (
        <div className="px-5 pt-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-[#8b8f94] mx-auto mb-3" />
              <p className="text-[#8b8f94] mb-1">No events found</p>
              <p className="text-sm text-[#8b8f94]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="w-full bg-card border border-border rounded-2xl overflow-hidden hover:border-[#5ba8d3] hover:shadow-md transition-all"
                >
                  <div className="flex gap-3 p-3">
                    {/* Event image */}
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#e3e4e6] flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Event info */}
                    <div className="flex-1 text-left flex flex-col justify-between min-w-0 py-1">
                      <div>
                        <div className="flex gap-2 mb-2">
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 bg-[#b7d3e0] text-[#375169] rounded-lg text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="mb-1.5 line-clamp-2">{event.title}</h3>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#8b8f94]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date} · {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#8b8f94]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{event.venue} · {event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#8b8f94]">
                          <Users className="w-3.5 h-3.5" />
                          <span>{event.attendeeCount} attending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Venues view */}
      {view === 'venues' && (
        <div className="px-5 pt-4">
          {filteredVenues.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-[#8b8f94] mx-auto mb-3" />
              <p className="text-[#8b8f94] mb-1">No venues found</p>
              <p className="text-sm text-[#8b8f94]">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredVenues.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => navigate(`/venue/${venue.id}`)}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-[#5ba8d3] hover:shadow-md transition-all text-left"
                >
                  {/* Venue image */}
                  <div className="aspect-square bg-[#e3e4e6]">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Venue info */}
                  <div className="p-3">
                    <h4 className="mb-1 line-clamp-1">{venue.name}</h4>
                    <p className="text-xs text-[#8b8f94] mb-2 line-clamp-1">{venue.type}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-[#8b8f94]">
                        <MapPin className="w-3 h-3" />
                        <span>{venue.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#f2c05a]">★</span>
                        <span className="text-xs font-medium text-[#333333]">{venue.rating}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-background rounded-t-3xl w-full max-w-md mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 -mr-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
              >
                <X className="w-5 h-5 text-[#333333]" />
              </button>
            </div>
            <p className="text-[#8b8f94] text-center py-8">Filter options coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}