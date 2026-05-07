import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight, Bell, Lock, HelpCircle, LogOut, User } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Account Information', action: () => {} },
        { icon: Lock, label: 'Privacy', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-full bg-background pb-4">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="flex-1">Settings</h1>
        </div>
      </header>

      <div className="px-5 pt-6 space-y-8">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-[#8b8f94]">{section.title}</h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full px-4 py-4 hover:bg-[#fcfcfc] transition-colors flex items-center gap-3"
                  >
                    <Icon className="w-5 h-5 text-[#5ba8d3]" />
                    <span className="flex-1 text-left text-[#333333]">
                      {item.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#8b8f94]" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Log out button */}
        <button className="w-full px-4 py-4 bg-card rounded-xl border border-border hover:bg-[#fcfcfc] transition-colors flex items-center gap-3 text-[#d4183d]">
          <LogOut className="w-5 h-5" />
          <span className="flex-1 text-left">Log Out</span>
        </button>

        {/* App version */}
        <div className="text-center pt-4">
          <p className="text-sm text-[#8b8f94]">Blyss Social v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
