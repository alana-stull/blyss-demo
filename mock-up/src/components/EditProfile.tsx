import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera } from 'lucide-react';

export function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    username: 'alexj',
    bio: '',
    location: 'San Francisco',
  });

  const handleSave = () => {
    // In a real app, this would save to a backend
    navigate('/profile');
  };

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#333333]" />
        </button>
        <h1 className="flex-1">Edit Profile</h1>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-[#5ba8d3] text-white rounded-xl hover:bg-[#4a96c2] transition-colors"
        >
          Save
        </button>
      </header>

      <div className="px-5 pt-8 space-y-6">
        {/* Profile photo */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#e3e4e6] border-4 border-background shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1613145997970-db84a7975fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXQlMjBwZXJzb258ZW58MXx8fHwxNzY5NTg3NzE3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-[#5ba8d3] text-white rounded-full shadow-lg hover:bg-[#4a96c2] transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-5">
          <div>
            <label className="block mb-2 text-[#333333]">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30"
            />
          </div>

          <div>
            <label className="block mb-2 text-[#333333]">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30"
            />
          </div>

          <div>
            <label className="block mb-2 text-[#333333]">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us a little about yourself..."
              rows={4}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30 resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-[#333333]">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
