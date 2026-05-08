export type EventData = {
  id: string;
  title: string;
  host: string;
  hostInitials: string;
  hostAvatar?: string;
  venue: string;
  venueId: string;
  date: string;
  time: string;
  dateLabel: string;
  image: string;
  tags: string[];
  description: string;
  attending: string[];
  totalAttendees: number;
  isPrivate: boolean;
};

export const EVENTS: Record<string, EventData> = {
  'event-upcoming-1': {
    id: 'event-upcoming-1',
    title: 'Trivia Tuesday at Ponysaurus',
    host: 'Jordan K',
    hostInitials: 'JK',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    venue: 'Ponysaurus Brewing',
    venueId: 'V010',
    date: 'Tue, May 7',
    time: '7:30 PM',
    dateLabel: 'Tue, May 7 · 7:30 PM',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    tags: ['Trivia', 'Nightlife'],
    description:
      'Join a fun trivia night with local teams, craft drinks, and good vibes. Bring a friend or come solo for a lively evening of pop culture, music, and prizes. This is a casual event perfect for meeting new people and enjoying some friendly competition.',
    attending: ['Jordan', 'Ari', 'Noah', 'Lisa', 'Sam'],
    totalAttendees: 42,
    isPrivate: false,
  },
  'event-inv1': {
    id: 'event-inv1',
    title: 'Tapas Night',
    host: 'Maya Torres',
    hostInitials: 'MT',
    venue: 'Mateo Bar de Tapas',
    venueId: 'V007',
    date: 'Sat, Feb 8',
    time: '8:00 PM',
    dateLabel: 'Sat, Feb 8 · 8:00 PM',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    tags: ['Tapas', 'Cocktails'],
    description:
      'A fun evening of Spanish tapas, craft cocktails, and great company at Mateo Bar de Tapas. Come hungry and ready to share plates. Reservations have been made for the group.',
    attending: ['Maya', 'Jordan', 'Priya', 'Sam'],
    totalAttendees: 4,
    isPrivate: true,
  },
  'event-inv2': {
    id: 'event-inv2',
    title: 'Morning Hike',
    host: 'Chris Dos Santos',
    hostInitials: 'CS',
    venue: 'Eno River State Park',
    venueId: 'V023',
    date: 'Sun, Feb 9',
    time: '10:00 AM',
    dateLabel: 'Sun, Feb 9 · 10:00 AM',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    tags: ['Outdoors', 'Hiking'],
    description:
      'Starting the morning with a peaceful 3-mile loop along the Eno River trail. Meet at the Cox Mountain trailhead parking lot at 9:50 AM. Bring water, sunscreen, and good shoes.',
    attending: ['Chris', 'Maya', 'Alex', 'Tara', 'Jordan', 'Sam'],
    totalAttendees: 6,
    isPrivate: true,
  },
};

// ─── Accepted event state (in-memory, persists across navigation) ─────────────

const _accepted = new Set<string>();

export function acceptEvent(id: string)    { _accepted.add(id); }
export function cancelEvent(id: string)    { _accepted.delete(id); }
export function isAccepted(id: string)     { return _accepted.has(id); }
export function getAcceptedEventIds()      { return [..._accepted]; }
