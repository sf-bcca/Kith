import React from 'react';

interface BottomNavProps {
  current: string;
  onNavigate: (screen: any) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate }) => {
  const navItems = [
    { id: 'Tree', icon: 'account_tree', label: 'Tree' },
    { id: 'Discover', icon: 'explore', label: 'Discover' },
    { id: 'Memories', icon: 'photo_library', label: 'Memories' },
    { id: 'Settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-6 py-2 pb-safe z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto h-[60px] pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 active:scale-95 ${
              current === item.id 
                ? 'text-primary' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className={`material-symbols-outlined text-[26px] ${current === item.id ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-semibold tracking-tight ${current === item.id ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;