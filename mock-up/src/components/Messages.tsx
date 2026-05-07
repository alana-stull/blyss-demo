import { useNavigate } from 'react-router';
import { MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  isEvent: boolean;
  eventName?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Modern Art Gallery Opening',
    avatar: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: 'Sarah: Looking forward to this! Should we meet outside at 7?',
    time: '2h',
    unread: true,
    isEvent: true,
    eventName: 'Modern Art Gallery Opening',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: 'Thanks for organizing brunch last week!',
    time: '1d',
    unread: false,
    isEvent: false,
  },
  {
    id: '3',
    name: 'Sunday Brunch Club',
    avatar: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: 'Marcus: I\'ll bring the pastries 🥐',
    time: '2d',
    unread: false,
    isEvent: true,
    eventName: 'Sunday Brunch Club',
  },
  {
    id: '4',
    name: 'Marcus Rivera',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: 'See you at the concert!',
    time: '3d',
    unread: false,
    isEvent: false,
  },
];

export function Messages() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <h1>Messages</h1>
      </header>

      {/* Messages list */}
      <div className="divide-y divide-border">
        {mockMessages.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <MessageCircle className="w-12 h-12 text-[#8b8f94] mx-auto mb-3" />
            <p className="text-[#8b8f94] mb-1">No messages yet</p>
            <p className="text-sm text-[#8b8f94]">
              Join events to start connecting with people
            </p>
          </div>
        ) : (
          mockMessages.map((message) => (
            <button
              key={message.id}
              onClick={() => navigate(`/messages/${message.id}`)}
              className="w-full px-5 py-4 hover:bg-[#fcfcfc] transition-colors flex items-start gap-3 text-left"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#e3e4e6] flex-shrink-0">
                <img
                  src={message.avatar}
                  alt={message.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h4 className="truncate">{message.name}</h4>
                  <span className="text-xs text-[#8b8f94] flex-shrink-0">
                    {message.time}
                  </span>
                </div>

                <p
                  className={`text-sm truncate ${
                    message.unread ? 'text-[#333333]' : 'text-[#8b8f94]'
                  }`}
                >
                  {message.lastMessage}
                </p>

                {message.isEvent && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#b7d3e0] text-[#375169] rounded-full text-xs">
                    Event
                  </span>
                )}
              </div>

              {/* Unread indicator */}
              {message.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#5ba8d3] flex-shrink-0 mt-2" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}