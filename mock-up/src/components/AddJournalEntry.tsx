import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, X, Camera, Star, MapPin, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface SuggestedEvent {
  id: string;
  eventName: string;
  venue: string;
  date: string;
  image: string;
}

const recentVenues = [
  { id: '1', name: 'Blue Note Jazz Club', location: 'West End' },
  { id: '2', name: 'The Contemporary', location: 'Downtown' },
  { id: '3', name: 'Café Lumière', location: 'Riverside' },
  { id: '4', name: 'Serenity Studio', location: 'Midtown' },
  { id: '5', name: 'Culinary Collective', location: 'Arts District' },
];

const suggestedEvents: SuggestedEvent[] = [
  {
    id: '1',
    eventName: 'Live Jazz Night',
    venue: 'Blue Note Jazz Club',
    date: '2026-02-07',
    image: 'https://images.unsplash.com/photo-1647168268629-1a25ce0c0e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBjb25jZXJ0JTIwdmVudWV8ZW58MXx8fHwxNzY5NjM1NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    eventName: 'Modern Art Gallery Opening',
    venue: 'The Contemporary',
    date: '2026-02-08',
    image: 'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njk1ODU2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function AddJournalEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    venue: '',
    date: '',
    rating: 0,
    notes: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showVenueSearch, setShowVenueSearch] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save to database
    console.log('Saving journal entry:', formData);
    navigate('/journal');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleUseSuggestion = (event: SuggestedEvent) => {
    setFormData({
      eventName: event.eventName,
      venue: event.venue,
      date: event.date,
      rating: 0,
      notes: '',
      image: event.image,
    });
    setImagePreview(event.image);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#333333]" />
            </button>
            <h1>Add to Journal</h1>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 -mr-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
          >
            <X className="w-5 h-5 text-[#333333]" />
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-5 pt-6 space-y-6">
        {/* Suggested Events Section */}
        {suggestedEvents.length > 0 && !formData.eventName && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#5ba8d3]" />
              <label className="text-sm font-medium text-[#333333]">
                Quick Add from Recent Events
              </label>
            </div>
            <div className="space-y-2">
              {suggestedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => handleUseSuggestion(event)}
                  className="w-full p-3 bg-card border border-border rounded-xl hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all flex items-center gap-3 text-left"
                >
                  <div className="w-12 h-12 bg-[#e3e4e6] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.eventName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#333333] truncate">{event.eventName}</p>
                    <div className="flex items-center gap-1.5 text-sm text-[#8b8f94]">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                  <div className="text-xs text-[#5ba8d3] font-medium">Use</div>
                </button>
              ))}
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-[#8b8f94]">or add manually</span>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#333333]">
            Event Photo
          </label>
          <div className="relative">
            {imagePreview ? (
              <div className="relative h-48 bg-[#e3e4e6] rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: '' });
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4 text-[#333333]" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 bg-[#f5f5f5] border-2 border-dashed border-[#e3e4e6] rounded-2xl cursor-pointer hover:bg-[#e3e4e6]/50 transition-colors">
                <Camera className="w-8 h-8 text-[#8b8f94] mb-2" />
                <span className="text-sm text-[#8b8f94]">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Event Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#333333]">
            Event Name
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) =>
              setFormData({ ...formData, eventName: e.target.value })
            }
            placeholder="e.g., Live Jazz Night"
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3] text-[#333333]"
            required
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#333333]">
            Venue
          </label>
          {formData.venue ? (
            <button
              type="button"
              onClick={() => setShowVenueSearch(true)}
              className="w-full p-4 rounded-xl border border-[#5ba8d3] bg-[#5ba8d3]/5 flex items-center gap-3"
            >
              <MapPin className="w-5 h-5 text-[#5ba8d3]" />
              <span className="flex-1 text-left text-[#333333] font-medium">{formData.venue}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({ ...formData, venue: '' });
                }}
                className="p-1 hover:bg-[#5ba8d3]/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[#333333]" />
              </button>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowVenueSearch(true)}
              className="w-full p-4 rounded-xl border border-border bg-card hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all flex items-center gap-3"
            >
              <MapPin className="w-5 h-5 text-[#5ba8d3]" />
              <span className="flex-1 text-left text-[#8b8f94]">Select venue</span>
            </button>
          )}

          {/* Venue selection modal */}
          {showVenueSearch && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
              <div className="bg-background rounded-t-3xl w-full max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3>Select Venue</h3>
                  <button
                    type="button"
                    onClick={() => setShowVenueSearch(false)}
                    className="p-2 -mr-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#333333]" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                  {recentVenues.map((venue) => (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, venue: venue.name });
                        setShowVenueSearch(false);
                      }}
                      className="w-full p-3 bg-card border border-border rounded-xl hover:border-[#5ba8d3] transition-all flex items-center gap-3 text-left"
                    >
                      <MapPin className="w-4 h-4 text-[#5ba8d3] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#333333] truncate">{venue.name}</p>
                        <p className="text-sm text-[#8b8f94]">{venue.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#333333]">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3] text-[#333333]"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#333333]">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                className="p-2 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating <= formData.rating
                      ? 'fill-[#f2c05a] text-[#f2c05a]'
                      : 'fill-[#e3e4e6] text-[#e3e4e6]'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#333333]">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="How was your experience? What made it memorable?"
            rows={6}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3] text-[#333333] resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-[#5ba8d3] to-[#4a96c2] text-white rounded-xl hover:shadow-lg hover:shadow-[#5ba8d3]/30 transition-all font-semibold"
        >
          Save to Journal
        </button>
      </form>
    </div>
  );
}