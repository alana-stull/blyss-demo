import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Clock, MapPin, Users, Lock, Globe, UserPlus } from 'lucide-react';

type PrivacyType = 'private' | 'private-open' | 'public';
type Step = 'venueType' | 'venue' | 'privacy' | 'invitees' | 'optimalTimes' | 'details' | 'payment' | 'review' | 'confirmation';

interface EventData {
  venueType: string;
  venue: string;
  privacy: PrivacyType | null;
  invitees: string[];
  optimalTime: string;
  title: string;
  description: string;
  payment: 'host' | 'split' | null;
}

const venueTypes = [
  { id: 'cafe', label: 'Café', icon: '☕' },
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'bar', label: 'Bar', icon: '🍹' },
  { id: 'outdoor', label: 'Outdoor', icon: '🌲' },
  { id: 'cultural', label: 'Cultural', icon: '🎨' },
  { id: 'activity', label: 'Activity', icon: '🎯' },
];

const mockVenues = [
  { id: '1', name: 'Café Lumière', type: 'cafe', location: 'Riverside', distance: '0.8 mi', image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '2', name: 'Morning Glory', type: 'cafe', location: 'Downtown', distance: '1.1 mi', image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '3', name: 'The Ember Room', type: 'restaurant', location: 'Downtown', distance: '1.2 mi', image: 'https://images.unsplash.com/photo-1619108977254-314da85774bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicnVuY2glMjBmcmllbmRzfGVufDF8fHx8MTc2OTYzNTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
];

const mockFriends = [
  { id: '1', name: 'Mesha Robinson', avatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080', availability: '100%' },
  { id: '2', name: 'Chris Dos Santos', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', availability: '100%' },
  { id: '3', name: 'Johanna Kepler', avatar: 'https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHdvbWFufGVufDF8fHx8MTc2OTU4MTkwMnww&ixlib=rb-4.1.0&q=80&w=1080', availability: '75%' },
  { id: '4', name: 'Asili Johnson', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMG1hbnxlbnwxfHx8fDE3Njk2MzU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', availability: '50%' },
];

const optimalTimes = [
  { id: 't1', date: 'Sat, Feb 8', time: '7:00 PM', availability: '100% (Everyone is free!)', isOptimal: true },
  { id: 't2', date: 'Sun, Feb 9', time: '11:30 AM', availability: '100% (Everyone is free!)', isOptimal: true },
  { id: 't3', date: 'Fri, Feb 7', time: '8:00 PM', availability: '75% (3 of 4 available)', isOptimal: false },
  { id: 't4', date: 'Sat, Feb 8', time: '2:00 PM', availability: '50% (2 of 4 available)', isOptimal: false },
];

export function PlanEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('venueType');
  const [eventData, setEventData] = useState<EventData>({
    venueType: '',
    venue: '',
    privacy: null,
    invitees: [],
    optimalTime: '',
    title: '',
    description: '',
    payment: null,
  });

  const handleBack = () => {
    const stepOrder: Step[] = ['venueType', 'venue', 'privacy', 'invitees', 'optimalTimes', 'details', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    } else {
      navigate(-1);
    }
  };

  const handleNext = (nextStep: Step) => {
    setStep(nextStep);
  };

  const handleCreateEvent = () => {
    setStep('confirmation');
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  const renderProgress = () => {
    const stepOrder: Step[] = ['venueType', 'venue', 'privacy', 'invitees', 'optimalTimes', 'details', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(step);
    const progress = ((currentIndex + 1) / stepOrder.length) * 100;

    return (
      <div className="h-1 bg-[#e3e4e6] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5ba8d3] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center px-5 pb-20">
        <div className="w-16 h-16 rounded-full bg-[#5ba8d3] flex items-center justify-center mb-4 animate-pulse">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2">Event Created!</h2>
        <p className="text-[#8b8f94] text-center">
          Your invites have been sent. We'll help you coordinate the details.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="flex-1">Plan Event</h1>
        </div>
        {renderProgress()}
      </header>

      {/* Step 1: Venue Type */}
      {step === 'venueType' && (
        <div className="px-5 pt-6">
          <h2 className="mb-2">What type of venue?</h2>
          <p className="text-[#8b8f94] mb-6">Choose a category to find local options</p>

          <div className="grid grid-cols-2 gap-3">
            {venueTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setEventData({ ...eventData, venueType: type.id });
                  handleNext('venue');
                }}
                className="p-6 bg-card border border-border rounded-2xl hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all text-left"
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-medium text-[#333333]">{type.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Venue Selection */}
      {step === 'venue' && (
        <div className="px-5 pt-6">
          <h2 className="mb-2">Choose a venue</h2>
          <p className="text-[#8b8f94] mb-6">Local {eventData.venueType} options near you</p>

          <div className="space-y-3">
            {mockVenues.filter(v => v.type === eventData.venueType).map((venue) => (
              <button
                key={venue.id}
                onClick={() => {
                  setEventData({ ...eventData, venue: venue.name });
                  handleNext('privacy');
                }}
                className="w-full p-3 bg-card border border-border rounded-xl hover:border-[#5ba8d3] transition-all flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#e3e4e6] flex-shrink-0">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-[#333333] truncate mb-0.5">
                    {venue.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm text-[#8b8f94]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{venue.location} · {venue.distance}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Privacy Type */}
      {step === 'privacy' && (
        <div className="px-5 pt-6">
          <h2 className="mb-2">Event privacy</h2>
          <p className="text-[#8b8f94] mb-6">Choose who can join this event</p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setEventData({ ...eventData, privacy: 'private' });
                handleNext('invitees');
              }}
              className="w-full p-4 bg-card border border-border rounded-xl hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#5ba8d3]/10 rounded-lg">
                  <Lock className="w-5 h-5 text-[#5ba8d3]" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">Private</h4>
                  <p className="text-sm text-[#8b8f94]">
                    Only people you invite can join
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setEventData({ ...eventData, privacy: 'private-open' });
                handleNext('invitees');
              }}
              className="w-full p-4 bg-card border border-border rounded-xl hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#5ba8d3]/10 rounded-lg">
                  <UserPlus className="w-5 h-5 text-[#5ba8d3]" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">Private-Open</h4>
                  <p className="text-sm text-[#8b8f94]">
                    All friends can see and join this event
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setEventData({ ...eventData, privacy: 'public' });
                handleNext('invitees');
              }}
              className="w-full p-4 bg-card border border-border rounded-xl hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#5ba8d3]/10 rounded-lg">
                  <Globe className="w-5 h-5 text-[#5ba8d3]" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">Public</h4>
                  <p className="text-sm text-[#8b8f94]">
                    Anyone can discover and join this event
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Invitees */}
      {step === 'invitees' && (
        <div className="px-5 pt-6">
          <h2 className="mb-2">Invite friends</h2>
          <p className="text-[#8b8f94] mb-6">
            {eventData.privacy === 'private'
              ? 'Select friends to invite'
              : eventData.privacy === 'private-open'
              ? 'Suggest friends (optional)'
              : 'Invite friends to feature them (optional)'}
          </p>

          <div className="space-y-3 mb-6">
            {mockFriends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => {
                  const newInvitees = eventData.invitees.includes(friend.id)
                    ? eventData.invitees.filter(id => id !== friend.id)
                    : [...eventData.invitees, friend.id];
                  setEventData({ ...eventData, invitees: newInvitees });
                }}
                className={`w-full p-3 bg-card border rounded-xl transition-all flex items-center gap-3 ${
                  eventData.invitees.includes(friend.id)
                    ? 'border-[#5ba8d3] bg-[#5ba8d3]/5'
                    : 'border-border'
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e3e4e6] flex-shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#333333]">{friend.name}</p>
                </div>
                {eventData.invitees.includes(friend.id) && (
                  <div className="w-6 h-6 rounded-full bg-[#5ba8d3] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNext('optimalTimes')}
            disabled={eventData.privacy === 'private' && eventData.invitees.length === 0}
            className="w-full py-3 bg-[#5ba8d3] text-white rounded-xl hover:bg-[#4a96c2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 5: Optimal Times */}
      {step === 'optimalTimes' && (
        <div className="px-5 pt-6">
          <h2 className="mb-2">Best times for everyone</h2>
          <p className="text-[#8b8f94] mb-6">
            Based on your friends' schedules
          </p>

          <div className="space-y-3">
            {optimalTimes.map((timeSlot) => (
              <button
                key={timeSlot.id}
                onClick={() => {
                  setEventData({ ...eventData, optimalTime: timeSlot.id });
                  handleNext('details');
                }}
                className={`w-full p-4 bg-card border rounded-xl transition-all text-left ${
                  timeSlot.isOptimal
                    ? 'border-[#5ba8d3] bg-gradient-to-r from-[#5ba8d3]/5 to-[#b7d3e0]/10'
                    : 'border-border hover:border-[#5ba8d3]'
                }`}
              >
                {timeSlot.isOptimal && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#5ba8d3]" />
                    <span className="text-xs text-[#5ba8d3] font-semibold">Optimal Time</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[#5ba8d3]" />
                  <span className="font-medium text-[#333333]">
                    {timeSlot.date} · {timeSlot.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8b8f94]">
                  <Users className="w-3.5 h-3.5" />
                  <span>{timeSlot.availability}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 6: Title & Description */}
      {step === 'details' && (
        <div className="px-5 pt-6">
          <h2 className="mb-6">Event details</h2>

          <div className="space-y-5 mb-6">
            <div>
              <label className="block mb-2 text-[#333333] font-medium">Event title</label>
              <input
                type="text"
                placeholder="e.g., Sunday Brunch at Café Lumière"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#333333] font-medium">Description (optional)</label>
              <textarea
                placeholder="Add any details or notes about the event..."
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30 resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => handleNext('payment')}
            disabled={!eventData.title}
            className="w-full py-3 bg-[#5ba8d3] text-white rounded-xl hover:bg-[#4a96c2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 7: Payment */}
      {step === 'payment' && (
        <div className="px-5 pt-6">
          <h2 className="mb-2">Payment method</h2>
          <p className="text-[#8b8f94] mb-6">How would you like to handle payment?</p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => {
                setEventData({ ...eventData, payment: 'host' });
              }}
              className={`w-full p-4 bg-card border rounded-xl transition-all text-left ${
                eventData.payment === 'host'
                  ? 'border-[#5ba8d3] bg-[#5ba8d3]/5'
                  : 'border-border hover:border-[#5ba8d3]'
              }`}
            >
              <h4 className="mb-1">I'll pay</h4>
              <p className="text-sm text-[#8b8f94]">
                You'll cover the cost for everyone
              </p>
            </button>

            <button
              onClick={() => {
                setEventData({ ...eventData, payment: 'split' });
              }}
              className={`w-full p-4 bg-card border rounded-xl transition-all text-left ${
                eventData.payment === 'split'
                  ? 'border-[#5ba8d3] bg-[#5ba8d3]/5'
                  : 'border-border hover:border-[#5ba8d3]'
              }`}
            >
              <h4 className="mb-1">Split evenly</h4>
              <p className="text-sm text-[#8b8f94]">
                Everyone pays their share
              </p>
            </button>
          </div>

          <button
            onClick={() => handleNext('review')}
            disabled={!eventData.payment}
            className="w-full py-3 bg-[#5ba8d3] text-white rounded-xl hover:bg-[#4a96c2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 8: Review */}
      {step === 'review' && (
        <div className="px-5 pt-6">
          <h2 className="mb-6">Review event</h2>

          <div className="bg-card border border-border rounded-2xl p-5 mb-6 space-y-4">
            <div>
              <p className="text-sm text-[#8b8f94] mb-1">Event Title</p>
              <p className="font-medium text-[#333333]">{eventData.title}</p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-[#8b8f94] mb-1">Venue</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5ba8d3]" />
                <p className="font-medium text-[#333333]">{eventData.venue}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-[#8b8f94] mb-1">Privacy</p>
              <p className="font-medium text-[#333333] capitalize">
                {eventData.privacy?.replace('-', ' ')}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-[#8b8f94] mb-1">Invitees</p>
              <p className="font-medium text-[#333333]">
                {eventData.invitees.length} {eventData.invitees.length === 1 ? 'person' : 'people'}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-[#8b8f94] mb-1">Payment</p>
              <p className="font-medium text-[#333333]">
                {eventData.payment === 'host' ? "I'll pay" : 'Split evenly'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateEvent}
            className="w-full py-3 bg-[#5ba8d3] text-white rounded-xl hover:bg-[#4a96c2] transition-colors font-medium"
          >
            Create Event
          </button>
        </div>
      )}
    </div>
  );
}
