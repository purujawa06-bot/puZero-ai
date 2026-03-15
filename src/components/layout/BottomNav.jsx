import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, BookLibrary, Settings, Library } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Discover', path: '/discover' },
    { icon: Library, label: 'Library', path: '/library' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-background/80 backdrop-blur-lg border-t border-white/5 px-6 py-3 safe-bottom z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              )
            }
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;