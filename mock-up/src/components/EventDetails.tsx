import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Users, Bookmark, Share2, Check } from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  avatar: string;
}

const mockAttendees: Attendee[] = [
  { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '2', name: 'Marcus Rivera', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '3', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '4', name: 'James Park', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

const eventDetails: { [key: string]: any } = {
  '1': {
    id: '1',
    title: 'Modern Art Gallery Opening',
    date: 'Sat, Feb 8',
    time: '7:00 PM',
    venue: 'The Contemporary',
    location: 'Downtown',
    address: '234 Arts Avenue, Downtown',
    image: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Join us for an intimate evening celebrating contemporary works from local emerging artists. This exclusive opening features installations, paintings, and mixed media pieces exploring themes of urban identity and connection.\n\nThe evening includes a guided tour at 7:30 PM, followed by a meet-and-greet with the artists. Light refreshments and wine will be served.',
    tags: ['Art', 'Culture'],
    attendees: mockAttendees,
    totalAttendees: 24,
  },
  '2': {
    id: '2',
    title: 'Sunday Brunch Club',
    date: 'Sun, Feb 9',
    time: '11:30 AM',
    venue: 'Café Lumière',
    location: 'Riverside',
    address: '456 River Street, Riverside',
    image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Start your Sunday right with good food and great company! Join us for our weekly brunch meetup featuring Café Lumière\'s renowned menu of fresh pastries, specialty coffee drinks, and brunch classics.\n\nThis is a casual, come-as-you-are gathering perfect for meeting new friends and catching up with familiar faces. Whether you\'re a regular or joining for the first time, you\'ll feel right at home.',
    tags: ['Food', 'Social'],
    attendees: mockAttendees.slice(0, 3),
    totalAttendees: 8,
  },
};

export function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false);

  const event = eventDetails[id || '1'] || eventDetails['1'];

  const handleJoin = () => {
    setIsJoined(true);
    setShowJoinConfirmation(true);
    setTimeout(() => setShowJoinConfirmation(false), 2000);
  };

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Hero image with overlay controls */}
      <div className="relative h-80 bg-[#e3e4e6]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay controls */}
        <div className="absolute top-0 left-0 right-0 p-5 pt-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 ${isSaved ? 'fill-[#5ba8d3] text-[#5ba8d3]' : 'text-[#333333]'}`}
              />
            </button>
            <button className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-[#333333]" />
            </button>
          </div>
        </div>
        {/* Tags overlay */}
        <div className="absolute bottom-4 left-5 flex gap-2">
          {event.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-[8px] text-xs font-medium text-[#333333] shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Event content */}
      <div className="px-5 pt-5 space-y-6">
        {/* Title and basic info */}
        <div>
          <h1 className="mb-4">{event.title}</h1>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[#333333]">{event.date}</p>
                <p className="text-sm text-[#8b8f94]">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[#333333]">{event.venue}</p>
                <p className="text-sm text-[#8b8f94]">{event.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="mb-2">About this event</h3>
          <p className="text-[#333333] leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Attendees */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>Who's going</h3>
            <div className="flex items-center gap-1.5 text-sm text-[#8b8f94]">
              <Users className="w-4 h-4" />
              <span>{event.totalAttendees} attending</span>
            </div>
          </div>

          <div className="flex -space-x-3">
            {event.attendees.map((attendee: Attendee) => (
              <div
                key={attendee.id}
                className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-[#e3e4e6]"
              >
                <img
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {event.totalAttendees > event.attendees.length && (
              <div className="w-10 h-10 rounded-full border-2 border-background bg-[#b7d3e0] flex items-center justify-center text-xs text-[#375169]">
                +{event.totalAttendees - event.attendees.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join confirmation toast */}
      {showJoinConfirmation && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-[#375169] text-white rounded-xl shadow-lg flex items-center gap-2 max-w-sm mx-5">
          <Check className="w-5 h-5" />
          <span>You're going to this event!</span>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="fixed bottom-[76px] left-0 right-0 bg-card border-t border-border p-5 max-w-md mx-auto">
        {isJoined ? (
          <button
            onClick={() => setIsJoined(false)}
            className="w-full py-3.5 bg-[#e3e4e6] text-[#333333] rounded-xl transition-colors"
          >
            Cancel RSVP
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="w-full py-3.5 bg-[#5ba8d3] text-white rounded-xl hover:bg-[#4a96c2] transition-colors"
          >
            Join Event
          </button>
        )}
      </div>
    </div>
  );
}