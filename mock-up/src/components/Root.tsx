import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, Search, Calendar, PlusSquare, User } from 'lucide-react';

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/post', icon: PlusSquare, label: 'Post' },
    { path: '/plan', icon: Calendar, label: 'Plan' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom navigation */}
      <nav className="border-t border-border bg-card">
        <div className="flex items-center justify-around px-2 py-3 safe-area-inset-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center p-3 transition-colors"
              >
                <Icon
                  className={`w-6 h-6 ${
                    active ? 'text-[#5ba8d3]' : 'text-[#8b8f94]'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}