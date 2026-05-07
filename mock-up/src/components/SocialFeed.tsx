import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, MessageCircle, Send, MapPin, Calendar, Users, Bookmark, Mail, CalendarPlus } from 'lucide-react';
import blyssLogo from 'figma:asset/23292cf5e96f0a3b741483ac64e223f571497176.png';

interface FriendPost {
  id: string;
  type: 'post';
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  caption: string;
  venue: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

interface AttendableEvent {
  id: string;
  type: 'event';
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image: string;
  attendeeCount: number;
  attendeeAvatars: string[];
  tags: string[];
  organizer: string;
  organizerAvatar: string;
}

type FeedItem = FriendPost | AttendableEvent;

const mockFeed: FeedItem[] = [
  {
    id: 'p1',
    type: 'post',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Perfect Sunday brunch with friends! The avocado toast here is incredible 🥑',
    venue: 'Café Lumière',
    tags: ['Brunch', 'Coffee', 'Friends'],
    likes: 42,
    comments: 8,
    timestamp: '2h ago',
    liked: false,
  },
  {
    id: 'e1',
    type: 'event',
    title: 'Modern Art Gallery Opening',
    date: 'Sat, Feb 8',
    time: '7:00 PM',
    venue: 'The Contemporary',
    location: 'Downtown',
    image: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    attendeeCount: 24,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    tags: ['Art', 'Culture'],
    organizer: 'Marcus Rivera',
    organizerAvatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'p2',
    type: 'post',
    userId: '2',
    userName: 'Marcus Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    image: 'https://images.unsplash.com/photo-1647168268629-1a25ce0c0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwdmVudWV8ZW58MXx8fHwxNzY5NjM1NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Amazing jazz performance tonight! The energy was incredible 🎷✨',
    venue: 'Blue Note Jazz Club',
    tags: ['Music', 'Jazz', 'Nightlife'],
    likes: 67,
    comments: 12,
    timestamp: '5h ago',
    liked: true,
  },
  {
    id: 'e2',
    type: 'event',
    title: 'Sunday Brunch Club',
    date: 'Sun, Feb 9',
    time: '11:30 AM',
    venue: 'Café Lumière',
    location: 'Riverside',
    image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    attendeeCount: 8,
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    tags: ['Food', 'Social'],
    organizer: 'Sarah Chen',
    organizerAvatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'p3',
    type: 'post',
    userId: '3',
    userName: 'Emma Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    image: 'https://images.unsplash.com/photo-1600346774255-f8e8d0b33309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBvdXRkb29yJTIwdHJhaWx8ZW58MXx8fHwxNzY5NjM1NTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Perfect morning hike with this crew! Nothing beats fresh air and good company 🌲',
    venue: 'Echo Ridge Trailhead',
    tags: ['Outdoors', 'Hiking', 'Wellness'],
    likes: 53,
    comments: 6,
    timestamp: '1d ago',
    liked: false,
  },
];

export function SocialFeed() {
  const navigate = useNavigate();
  const [feed] = useState<FeedItem[]>(mockFeed);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set(['p2']));

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShare = (item: FeedItem) => {
    navigate('/messages');
  };

  return (
    <div className="min-h-full bg-background pb-4">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/plan')}
          className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
        >
          <CalendarPlus className="w-5 h-5 text-[#333333]" />
        </button>
        <img src={blyssLogo} alt="Blyss" className="h-8 w-8 absolute left-1/2 -translate-x-1/2" />
        <button
          onClick={() => navigate('/messages')}
          className="p-2 -mr-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
        >
          <Mail className="w-5 h-5 text-[#333333]" />
        </button>
      </header>

      {/* Feed */}
      <div className="space-y-6 pt-4">
        {feed.map((item) => {
          if (item.type === 'post') {
            const post = item as FriendPost;
            const isLiked = likedPosts.has(post.id);
            
            return (
              <div key={post.id} className="bg-card px-5 pt-4 pb-5">
                {/* Post image - rounded, wider */}
                <div className="w-full aspect-[4/3] bg-[#e3e4e6] rounded-2xl overflow-hidden mb-3 -mx-2">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Actions right under image - matching width */}
                <div className="flex items-center gap-4 mb-4 -mx-2 px-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked ? 'fill-[#f2c05a] text-[#f2c05a]' : 'text-[#333333]'
                      }`}
                    />
                    <span className="text-sm font-semibold text-[#333333]">
                      {isLiked ? post.likes + 1 : post.likes}
                    </span>
                  </button>
                  <button className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 text-[#333333]" />
                    <span className="text-sm font-semibold text-[#333333]">{post.comments}</span>
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1.5"
                  >
                    <Send className="w-5 h-5 text-[#333333]" />
                  </button>
                  <button className="ml-auto p-1 rounded-full hover:bg-[#e3e4e6] transition-colors">
                    <Bookmark className="w-5 h-5 text-[#333333]" />
                  </button>
                </div>

                {/* Venue (big) and user name in same row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MapPin className="w-5 h-5 text-[#5ba8d3] flex-shrink-0" />
                    <h2 className="text-[#333333] font-bold">{post.venue}</h2>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-xs text-[#8b8f94]">{post.userName}</p>
                    <p className="text-xs text-[#8b8f94]">{post.timestamp}</p>
                  </div>
                </div>

                {/* Caption */}
                <p className="text-sm text-[#333333] mb-3">{post.caption}</p>

                {/* Tags - horizontal scroll */}
                <div className="flex gap-2 overflow-x-auto mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-[#f5f5f5] border border-[#e3e4e6] rounded-[8px] text-xs text-[#333333] whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          } else {
            const event = item as AttendableEvent;
            
            return (
              <div key={event.id} className="px-5">
                <div
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="bg-gradient-to-br from-[#5ba8d3]/5 to-[#b7d3e0]/10 rounded-3xl overflow-hidden border-2 border-[#5ba8d3]/30 shadow-lg shadow-[#5ba8d3]/10 cursor-pointer transition-all active:scale-[0.98] hover:shadow-xl hover:shadow-[#5ba8d3]/20"
                >
                  {/* Event badge */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e3e4e6] ring-2 ring-white flex-shrink-0">
                        <img
                          src={event.organizerAvatar}
                          alt={event.organizer}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-[#333333]">
                        <span className="font-semibold">{event.organizer}</span>{' '}
                        <span className="text-[#8b8f94]">is inviting you</span>
                      </span>
                    </div>
                  </div>

                  {/* Event image */}
                  <div className="relative h-44 bg-[#e3e4e6] mx-4 rounded-2xl overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Tags overlay */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-[8px] text-xs font-medium text-[#333333] shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Event info */}
                  <div className="p-5">
                    <h3 className="mb-3 text-[#375169]">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#333333]">
                        <Calendar className="w-4 h-4 text-[#5ba8d3]" />
                        <span className="font-medium">{event.date} · {event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-[#333333]">
                        <MapPin className="w-4 h-4 text-[#5ba8d3]" />
                        <span>{event.venue} · {event.location}</span>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {event.attendeeAvatars.slice(0, 3).map((avatar, idx) => (
                            <div
                              key={idx}
                              className="w-9 h-9 rounded-full overflow-hidden bg-[#e3e4e6] ring-2 ring-white"
                            >
                              <img
                                src={avatar}
                                alt="Attendee"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-[#375169] font-medium">
                          {event.attendeeCount} attending
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                          <Bookmark className="w-5 h-5 text-[#375169]" />
                        </button>
                        <button className="px-5 py-2 bg-gradient-to-r from-[#5ba8d3] to-[#4a96c2] text-white rounded-xl hover:shadow-lg hover:shadow-[#5ba8d3]/30 transition-all text-sm font-semibold">
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}