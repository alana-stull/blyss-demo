import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, UserPlus } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  mutualFriends: number;
}

const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: '@sarahc',
    avatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    mutualFriends: 24,
  },
  {
    id: '2',
    name: 'Marcus Rivera',
    username: '@marcusr',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    mutualFriends: 18,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    username: '@emmaw',
    avatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    mutualFriends: 31,
  },
  {
    id: '4',
    name: 'James Park',
    username: '@jamespark',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    mutualFriends: 12,
  },
];

export function FriendsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = mockFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="flex-1">Friends</h1>
          <button className="p-2 -mr-2 rounded-full hover:bg-[#e3e4e6] transition-colors">
            <UserPlus className="w-5 h-5 text-[#5ba8d3]" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8f94]" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30"
          />
        </div>
      </header>

      {/* Friends list */}
      <div className="px-5 pt-4 space-y-2">
        <p className="text-sm text-[#8b8f94] mb-3">
          {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'}
        </p>

        {filteredFriends.map((friend) => (
          <button
            key={friend.id}
            className="w-full p-4 bg-card border border-border rounded-xl hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all flex items-center gap-3"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[#e3e4e6] flex-shrink-0">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-left min-w-0">
              <h4 className="truncate mb-0.5">{friend.name}</h4>
              <p className="text-sm text-[#8b8f94]">{friend.username}</p>
              <p className="text-xs text-[#8b8f94]">
                {friend.mutualFriends} mutual friends
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
