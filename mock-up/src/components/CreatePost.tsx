import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Image, MapPin, Check, X } from 'lucide-react';

type Step = 'create' | 'preview' | 'confirmation';

interface PostData {
  venue: string;
  photo: string | null;
  caption: string;
  tags: string[];
}

const mockVenues = [
  { id: '1', name: 'Café Lumière', location: 'Riverside' },
  { id: '2', name: 'Blue Note Jazz Club', location: 'West End' },
  { id: '3', name: 'The Contemporary', location: 'Downtown' },
  { id: '4', name: 'Serenity Studio', location: 'Midtown' },
];

const suggestedTags = ['Brunch', 'Coffee', 'Friends', 'Music', 'Jazz', 'Art', 'Wellness', 'Nightlife'];

export function CreatePost() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('create');
  const [postData, setPostData] = useState<PostData>({
    venue: '',
    photo: null,
    caption: '',
    tags: [],
  });
  const [showVenueSearch, setShowVenueSearch] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!postData.tags.includes(tag)) {
      setPostData({ ...postData, tags: [...postData.tags, tag] });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setPostData({ ...postData, tags: postData.tags.filter(t => t !== tag) });
  };

  const handlePost = () => {
    setStep('confirmation');
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  const canPreview = postData.venue && postData.caption.trim();

  // Confirmation screen
  if (step === 'confirmation') {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center px-5 pb-20">
        <div className="w-16 h-16 rounded-full bg-[#5ba8d3] flex items-center justify-center mb-4 animate-pulse">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2">Post shared!</h2>
        <p className="text-[#8b8f94] text-center">
          Your experience has been added to your profile
        </p>
      </div>
    );
  }

  // Preview screen
  if (step === 'preview') {
    return (
      <div className="min-h-full bg-background pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4 flex items-center gap-3">
          <button
            onClick={() => setStep('create')}
            className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="flex-1">Preview Post</h1>
          <button
            onClick={handlePost}
            className="px-5 py-2 bg-[#5ba8d3] text-white rounded-xl hover:bg-[#4a96c2] transition-colors font-medium"
          >
            Post
          </button>
        </header>

        {/* Preview card */}
        <div className="pt-4">
          <div className="bg-card">
            {/* Venue at top */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5ba8d3]" />
              <span className="font-medium text-[#333333]">{postData.venue}</span>
            </div>

            {/* Image placeholder */}
            <div className="w-full aspect-[4/3] bg-[#e3e4e6] flex items-center justify-center">
              {postData.photo ? (
                <img src={postData.photo} alt="Post" className="w-full h-full object-cover" />
              ) : (
                <Image className="w-12 h-12 text-[#8b8f94]" />
              )}
            </div>

            {/* Content */}
            <div className="px-5 pt-3">
              {/* User info and caption */}
              <div className="flex items-start gap-2 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e3e4e6] flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1613145997970-db84a7975fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXQlMjBwZXJzb258ZW58MXx8fHwxNzY5NTg3NzE3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-[#333333] flex-1">
                  <span className="font-semibold">Alex Johnson</span>{' '}
                  {postData.caption}
                </p>
              </div>

              {/* Tags */}
              {postData.tags.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5">
                  {postData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-[#f5f5f5] border border-[#e3e4e6] rounded-lg text-xs text-[#333333] whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-xs text-[#8b8f94] pb-4">Just now</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create screen
  return (
    <div className="min-h-full bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#333333]" />
        </button>
        <h1 className="flex-1">Create Post</h1>
        <button
          onClick={() => setStep('preview')}
          disabled={!canPreview}
          className="px-5 py-2 bg-[#5ba8d3] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4a96c2] transition-colors font-medium"
        >
          Preview
        </button>
      </header>

      <div className="px-5 pt-6 space-y-6">
        {/* Venue - at the top */}
        <div>
          <label className="block mb-3 text-[#333333] font-medium">Venue *</label>
          {postData.venue ? (
            <button
              onClick={() => setShowVenueSearch(true)}
              className="w-full p-4 rounded-xl border border-[#5ba8d3] bg-[#5ba8d3]/5 flex items-center gap-3"
            >
              <MapPin className="w-5 h-5 text-[#5ba8d3]" />
              <span className="flex-1 text-left text-[#333333] font-medium">{postData.venue}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPostData({ ...postData, venue: '' });
                }}
                className="p-1 hover:bg-[#5ba8d3]/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[#333333]" />
              </button>
            </button>
          ) : (
            <button
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
                    onClick={() => setShowVenueSearch(false)}
                    className="p-2 -mr-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#333333]" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                  {mockVenues.map((venue) => (
                    <button
                      key={venue.id}
                      onClick={() => {
                        setPostData({ ...postData, venue: venue.name });
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

        {/* Photo upload */}
        <div>
          <label className="block mb-3 text-[#333333] font-medium">Photo *</label>
          <div className="aspect-square bg-[#e3e4e6] rounded-2xl border-2 border-dashed border-[#8b8f94] flex flex-col items-center justify-center cursor-pointer hover:bg-[#d5d6d8] transition-colors">
            <Image className="w-12 h-12 text-[#8b8f94] mb-2" />
            <p className="text-[#8b8f94]">Add photo</p>
            <p className="text-sm text-[#8b8f94]">Tap to upload</p>
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block mb-3 text-[#333333] font-medium">Caption *</label>
          <textarea
            value={postData.caption}
            onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
            placeholder="Share what made this special..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30 resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-3 text-[#333333] font-medium">Tags (optional)</label>
          
          {/* Selected tags */}
          {postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {postData.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleRemoveTag(tag)}
                  className="px-3 py-1.5 bg-[#5ba8d3] text-white rounded-lg text-xs flex items-center gap-1.5"
                >
                  {tag}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {/* Suggested tags */}
          <div className="flex flex-wrap gap-2">
            {suggestedTags.filter(tag => !postData.tags.includes(tag)).map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="px-3 py-1.5 bg-[#f5f5f5] border border-[#e3e4e6] text-[#333333] rounded-lg text-xs hover:border-[#5ba8d3] hover:bg-[#5ba8d3]/5 transition-all"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}