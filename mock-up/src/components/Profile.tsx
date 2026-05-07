import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Settings, Calendar, MapPin, Heart, Bookmark, Coffee, Wine } from 'lucide-react';
import blyssLogo from 'figma:asset/23292cf5e96f0a3b741483ac64e223f571497176.png';

interface ProfileEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  image: string;
  type: 'upcoming' | 'past';
}

interface Post {
  id: string;
  image: string;
  venue: string;
  caption: string;
  likes: number;
}

interface SavedItem {
  id: string;
  name: string;
  type: string;
  image: string;
  location: string;
  category: 'brunch' | 'bars' | 'culture';
}

const upcomingEvents: ProfileEvent[] = [
  {
    id: '1',
    name: 'Modern Art Gallery Opening',
    venue: 'The Contemporary',
    date: 'Sat, Feb 8 · 7:00 PM',
    image: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'upcoming',
  },
  {
    id: '2',
    name: 'Sunday Brunch Club',
    venue: 'Café Lumière',
    date: 'Sun, Feb 9 · 11:30 AM',
    image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'upcoming',
  },
];

const mockPosts: Post[] = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    venue: 'Café Lumière',
    caption: 'Perfect Sunday brunch! 🥑',
    likes: 42,
  },
  {
    id: 'p2',
    image: 'https://images.unsplash.com/photo-1647168268629-1a25ce0c0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwdmVudWV8ZW58MXx8fHwxNzY5NjM1NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    venue: 'Blue Note Jazz Club',
    caption: 'Incredible jazz night 🎷',
    likes: 67,
  },
  {
    id: 'p3',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjBjbGFzc3xlbnwxfHx8fDE3Njk2MzU1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    venue: 'Serenity Studio',
    caption: 'Peaceful morning session',
    likes: 34,
  },
  {
    id: 'p4',
    image: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    venue: 'The Contemporary',
    caption: 'Art gallery vibes',
    likes: 58,
  },
  {
    id: 'p5',
    image: 'https://images.unsplash.com/photo-1600346774255-f8e8d0b33309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBvdXRkb29yJTIwdHJhaWx8ZW58MXx8fHwxNzY5NjM1NTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    venue: 'Echo Ridge Trail',
    caption: 'Morning hike completed',
    likes: 45,
  },
  {
    id: 'p6',
    image: 'https://images.unsplash.com/photo-1758279745466-f5f4087a87d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBraXRjaGVufGVufDF8fHx8MTc2OTYzNTE1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    venue: 'Culinary Collective',
    caption: 'Cooking class fun',
    likes: 52,
  },
];

const mockSaved: SavedItem[] = [
  {
    id: '1',
    name: 'Café Lumière',
    type: 'Café',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY5NjM1NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Riverside',
    category: 'brunch',
  },
  {
    id: '5',
    name: 'Morning Glory',
    type: 'Brunch Spot',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVuY2glMjByZXN0YXVyYW50fGVufDF8fHx8MTczODQyNjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Downtown',
    category: 'brunch',
  },
  {
    id: '3',
    name: 'Blue Note',
    type: 'Bar',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwY2x1YiUyMGludGVyaW9yfGVufDF8fHx8MTc2OTYzNTU4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'West End',
    category: 'bars',
  },
  {
    id: '6',
    name: 'Sunset Lounge',
    type: 'Cocktail Bar',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGxvdW5nZXxlbnwxfHx8fDE3Mzg0MjYwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Marina',
    category: 'bars',
  },
  {
    id: '2',
    name: 'The Contemporary',
    type: 'Gallery',
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY5NjM1NTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Downtown',
    category: 'culture',
  },
];

export function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'events' | 'posts' | 'saved'>('events');

  // Group saved items by category
  const savedByCategory = mockSaved.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SavedItem[]>);

  const categoryLabels = {
    brunch: 'Brunch Spots',
    bars: 'Bars & Lounges',
    culture: 'Culture & Arts',
  };

  const categoryIcons = {
    brunch: Coffee,
    bars: Wine,
    culture: Calendar,
  };

  return (
    <div className="min-h-full bg-background pb-4">
      <div className="px-5 pt-6 pb-6">
        {/* Profile header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#e3e4e6] mx-auto mb-4 border-4 border-background shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1613145997970-db84a7975fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXQlMjBwZXJzb258ZW58MXx8fHwxNzY5NTg3NzE3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mb-1">Alex Johnson</h2>
          <p className="text-[#8b8f94] mb-4">@alexj · San Francisco</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-4">
            <button
              onClick={() => navigate('/profile/friends')}
              className="text-center"
            >
              <p className="font-semibold text-[#333333]">142</p>
              <p className="text-sm text-[#8b8f94]">Friends</p>
            </button>
            <button
              onClick={() => navigate('/journal')}
              className="text-center"
            >
              <p className="font-semibold text-[#333333]">24</p>
              <p className="text-sm text-[#8b8f94]">Planned</p>
            </button>
            <button
              onClick={() => navigate('/journal')}
              className="text-center"
            >
              <p className="font-semibold text-[#333333]">87</p>
              <p className="text-sm text-[#8b8f94]">Attended</p>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/profile/edit')}
              className="text-sm text-[#5ba8d3] hover:underline"
            >
              Edit Profile
            </button>
            <span className="text-[#8b8f94]">·</span>
            <button
              onClick={() => navigate('/settings')}
              className="text-sm text-[#5ba8d3] hover:underline"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#f5f5f5] p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              activeTab === 'events'
                ? 'bg-white text-[#333333] shadow-sm'
                : 'text-[#8b8f94]'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              activeTab === 'posts'
                ? 'bg-white text-[#333333] shadow-sm'
                : 'text-[#8b8f94]'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-[#333333] shadow-sm'
                : 'text-[#8b8f94]'
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5">
        {/* Events tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 text-[#8b8f94] mx-auto mb-3" />
                <p className="text-[#8b8f94] mb-1">No upcoming events</p>
                <p className="text-sm text-[#8b8f94]">Join or create events to get started</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="w-full bg-white border border-[#e3e4e6] rounded-2xl hover:border-[#5ba8d3] transition-all overflow-hidden text-left flex items-stretch"
                >
                  <div className="w-28 bg-[#e3e4e6] flex-shrink-0 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
                    <p className="font-semibold text-[#333333] mb-1.5 line-clamp-1">
                      {event.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-[#5ba8d3] mb-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-medium truncate">{event.venue}</span>
                    </div>
                    <p className="text-sm text-[#8b8f94] mb-2">{event.date}</p>
                    
                    {/* Invited by or attendees */}
                    <div className="flex items-center gap-2">
                      {event.id === '1' ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-[#e3e4e6] border border-white">
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3Mzg0MjYwNjh8MA&ixlib=rb-4.1.0&q=80&w=100"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-[#8b8f94]">Sarah's event</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-2">
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-[#e3e4e6] border border-white">
                              <img
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTczODQyNjA2OHww&ixlib=rb-4.1.0&q=80&w=1080"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-[#e3e4e6] border border-white">
                              <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3Mzg0MjYwNjh8MA&ixlib=rb-4.1.0&q=80&w=100"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-[#e3e4e6] border border-white">
                              <img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMGNhc3VhbHxlbnwxfHx8fDE3Mzg0MjYwNjl8MA&ixlib=rb-4.1.0&q=80&w=100"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <p className="text-xs text-[#8b8f94]">4 attending</p>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Posts tab */}
        {activeTab === 'posts' && (
          <div className="space-y-3">
            {mockPosts.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-[#8b8f94] mx-auto mb-3" />
                <p className="text-[#8b8f94] mb-1">No posts yet</p>
                <p className="text-sm text-[#8b8f94]">Share your experiences to create posts</p>
              </div>
            ) : (
              mockPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div className="aspect-[8/3] bg-[#e3e4e6]">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#5ba8d3] flex-shrink-0" />
                      <p className="font-medium text-[#333333] text-sm truncate">{post.venue}</p>
                    </div>
                    <p className="text-[#333333] text-sm mb-2 line-clamp-1">{post.caption}</p>
                    <div className="flex items-center gap-1.5 text-sm text-[#8b8f94]">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="font-semibold">{post.likes}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved tab */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            {mockSaved.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className="w-12 h-12 text-[#8b8f94] mx-auto mb-3" />
                <p className="text-[#8b8f94] mb-1">No saved items</p>
                <p className="text-sm text-[#8b8f94]">Save venues and events for later</p>
              </div>
            ) : (
              Object.keys(savedByCategory).map((category) => {
                const cat = category as 'brunch' | 'bars' | 'culture';
                const Icon = categoryIcons[cat];
                
                return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-[#5ba8d3]" />
                    <p className="font-medium text-[#333333]">{categoryLabels[cat]}</p>
                  </div>
                  <div className="space-y-3 mb-6">
                    {savedByCategory[category].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.type === 'Event') {
                            navigate(`/event/${item.id}`);
                          } else {
                            navigate(`/venue/${item.id}`);
                          }
                        }}
                        className="w-full p-3 bg-card border border-border rounded-xl hover:border-[#5ba8d3] transition-all flex items-center gap-3"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#e3e4e6] flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-[#333333] truncate mb-0.5">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-sm text-[#8b8f94]">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.location}</span>
                          </div>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#b7d3e0] text-[#375169] rounded-md text-xs">
                            {item.type}
                          </span>
                        </div>
                        <Bookmark className="w-5 h-5 text-[#5ba8d3] fill-[#5ba8d3] flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )})
            )}
          </div>
        )}
      </div>
    </div>
  );
}