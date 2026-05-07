import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Star, Clock, DollarSign, Phone, Globe, Bookmark, Share2, Navigation } from 'lucide-react';

interface VenueData {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  priceLevel: string;
  distance: string;
  address: string;
  neighborhood: string;
  phone: string;
  website: string;
  hours: string;
  tags: string[];
  description: string;
}

const mockVenues: Record<string, VenueData> = {
  '1': {
    id: '1',
    name: 'Café Lumière',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY5NjM1NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviewCount: 342,
    category: 'Coffee Shop',
    priceLevel: '$$',
    distance: '0.8 mi',
    address: '742 River Street',
    neighborhood: 'Riverside',
    phone: '(555) 123-4567',
    website: 'cafelumiere.com',
    hours: 'Open until 8:00 PM',
    tags: ['Coffee', 'Brunch', 'WiFi', 'Outdoor Seating'],
    description: 'Cozy neighborhood café known for artisan coffee and fresh pastries. Perfect spot for morning meetings or catching up with friends over brunch.',
  },
  '2': {
    id: '2',
    name: 'The Contemporary',
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY5NjM1NTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviewCount: 189,
    category: 'Art Gallery',
    priceLevel: 'Free',
    distance: '1.2 mi',
    address: '128 Gallery Avenue',
    neighborhood: 'Downtown',
    phone: '(555) 234-5678',
    website: 'thecontemporary.org',
    hours: 'Open until 6:00 PM',
    tags: ['Art', 'Culture', 'Exhibitions', 'Events'],
    description: 'Modern art gallery featuring rotating exhibitions from emerging and established artists. Free admission on Thursdays.',
  },
  '3': {
    id: '3',
    name: 'Blue Note',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwY2x1YiUyMGludGVyaW9yfGVufDF8fHx8MTc2OTYzNTU4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 521,
    category: 'Bar',
    priceLevel: '$$$',
    distance: '2.1 mi',
    address: '456 Music Row',
    neighborhood: 'West End',
    phone: '(555) 345-6789',
    website: 'bluenotejazz.com',
    hours: 'Opens at 7:00 PM',
    tags: ['Music', 'Jazz', 'Nightlife', 'Drinks'],
    description: 'Intimate jazz club featuring world-class musicians in a sophisticated atmosphere. Reservations recommended for weekend shows.',
  },
  '4': {
    id: '4',
    name: 'Echo Ridge Trailhead',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjB0cmFpbCUyMG5hdHVyZXxlbnwxfHx8fDE3Njk2MzU1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviewCount: 267,
    category: 'Outdoor Recreation',
    priceLevel: 'Free',
    distance: '5.4 mi',
    address: 'Echo Ridge Park Entrance',
    neighborhood: 'North Hills',
    phone: '(555) 456-7890',
    website: 'cityparks.gov/echoridge',
    hours: 'Sunrise to Sunset',
    tags: ['Hiking', 'Nature', 'Outdoors', 'Scenic Views'],
    description: 'Popular hiking trail with moderate difficulty and stunning city views from the summit. Well-maintained paths and ample parking.',
  },
  '5': {
    id: '5',
    name: 'Morning Glory',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVuY2glMjByZXN0YXVyYW50fGVufDF8fHx8MTczODQyNjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviewCount: 428,
    category: 'Brunch Spot',
    priceLevel: '$$',
    distance: '1.5 mi',
    address: '234 Market Street',
    neighborhood: 'Downtown',
    phone: '(555) 234-8901',
    website: 'morningglorybrunch.com',
    hours: '8:00 AM - 3:00 PM',
    tags: ['Brunch', 'Breakfast', 'Healthy', 'Mimosas'],
    description: 'Bright and airy brunch spot serving farm-to-table breakfast and lunch. Famous for their avocado toast and bottomless mimosas on weekends.',
  },
  '6': {
    id: '6',
    name: 'Sunset Lounge',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGxvdW5nZXxlbnwxfHx8fDE3Mzg0MjYwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviewCount: 315,
    category: 'Cocktail Bar',
    priceLevel: '$$$',
    distance: '2.8 mi',
    address: '88 Marina Boulevard',
    neighborhood: 'Marina',
    phone: '(555) 345-9012',
    website: 'sunsetlounge.com',
    hours: '5:00 PM - 1:00 AM',
    tags: ['Cocktails', 'Views', 'Rooftop', 'Date Night'],
    description: 'Sophisticated rooftop bar with stunning sunset views over the water. Expert mixologists craft seasonal cocktails in an elegant setting.',
  },
};

export function VenueProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const venue = id ? mockVenues[id] : null;

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-[#8b8f94]">Venue not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image with overlay controls */}
      <div className="relative h-80 bg-[#e3e4e6]">
        <img
          src={venue.image}
          alt={venue.name}
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
            <button className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-[#333333]" />
            </button>
            <button className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
              <Bookmark className="w-5 h-5 text-[#333333]" />
            </button>
          </div>
        </div>
      </div>

      {/* Venue Info */}
      <div className="px-5 pt-5">
        {/* Name and Rating */}
        <div className="mb-4">
          <h2 className="mb-2">{venue.name}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-[#f2c05a] text-[#f2c05a]" />
              <span className="font-semibold text-[#333333]">{venue.rating}</span>
              <span className="text-sm text-[#8b8f94]">({venue.reviewCount} reviews)</span>
            </div>
            <span className="text-sm text-[#8b8f94]">•</span>
            <span className="text-sm text-[#333333] font-medium">{venue.category}</span>
            <span className="text-sm text-[#8b8f94]">•</span>
            <span className="text-sm text-[#333333] font-medium">{venue.priceLevel}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 mb-5">
          {venue.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-[#f5f5f5] border border-[#e3e4e6] rounded-[8px] text-xs text-[#333333] whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-[#333333] leading-relaxed">{venue.description}</p>
        </div>

        {/* Details Section */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <h3 className="text-[#375169] mb-4">Details</h3>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#333333] font-medium">{venue.address}</p>
              <p className="text-sm text-[#8b8f94]">{venue.neighborhood}</p>
            </div>
            <span className="text-sm font-semibold text-[#5ba8d3]">{venue.distance}</span>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#333333] font-medium">{venue.hours}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <a 
                href={`tel:${venue.phone}`}
                className="text-[#333333] font-medium hover:text-[#5ba8d3] transition-colors"
              >
                {venue.phone}
              </a>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-[#5ba8d3] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <a 
                href={`https://${venue.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5ba8d3] font-medium hover:underline"
              >
                {venue.website}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 py-3 bg-gradient-to-r from-[#5ba8d3] to-[#4a96c2] text-white rounded-xl hover:shadow-lg hover:shadow-[#5ba8d3]/30 transition-all font-semibold flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            Get Directions
          </button>
          <button className="px-6 py-3 bg-[#f5f5f5] border border-[#e3e4e6] text-[#333333] rounded-xl hover:bg-[#e3e4e6] transition-colors font-semibold">
            Plan Event
          </button>
        </div>
      </div>
    </div>
  );
}