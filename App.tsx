import React, { useState, useEffect } from 'react';
import FamilyTreeView from './components/FamilyTreeView';
import MemberBiography from './components/MemberBiography';
import ActivityFeed from './components/ActivityFeed';
import PedigreeChart from './components/PedigreeChart';
import FanChart from './components/FanChart';
import FamilyDirectory from './components/FamilyDirectory';
import HorizontalTree from './components/HorizontalTree';
import AdminDashboard from './components/AdminDashboard';
import DiscoverView from './components/DiscoverView';
import SettingsView from './components/SettingsView';

enum Screen {
  TREE = 'Tree',
  BIO = 'Biography',
  MEMORIES = 'Memories',
  DISCOVER = 'Discover',
  SETTINGS = 'Settings',
  PEDIGREE = 'Pedigree',
  FAN = 'Fan Chart',
  DIRECTORY = 'Directory',
  HORIZONTAL = 'Horizontal Tree',
  ADMIN = 'Admin',
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.TREE);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('7'); // Default to Merlin

  // Handle Dark Mode for Admin Dashboard
  useEffect(() => {
    if (currentScreen === Screen.ADMIN) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentScreen]);

  const handleNavigate = (screen: string, memberId?: string) => {
    if (memberId) {
      setSelectedMemberId(memberId);
    }
    const target = Object.values(Screen).find(s => s === screen) as Screen;
    if (target) {
      setCurrentScreen(target);
    } else {
      console.warn(`Unknown screen: ${screen}`);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.TREE: return <FamilyTreeView onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />;
      case Screen.BIO: return <MemberBiography onNavigate={handleNavigate} memberId={selectedMemberId} />;
      case Screen.MEMORIES: return <ActivityFeed onNavigate={handleNavigate} />;
      case Screen.DISCOVER: return <DiscoverView onNavigate={handleNavigate} />;
      case Screen.SETTINGS: return <SettingsView onNavigate={handleNavigate} />;
      case Screen.PEDIGREE: return <PedigreeChart onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />;
      case Screen.FAN: return <FanChart onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />;
      case Screen.DIRECTORY: return <FamilyDirectory onNavigate={handleNavigate} />;
      case Screen.HORIZONTAL: return <HorizontalTree onNavigate={handleNavigate} />;
      case Screen.ADMIN: return <AdminDashboard onNavigate={handleNavigate} />;
      default: return <FamilyTreeView onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-slate-900 font-display">
      {/* View Switcher for Demo Purposes */}
      <div className="fixed top-20 right-4 z-[100] group">
         <button className="bg-slate-900 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center">
            <span className="material-symbols-outlined">grid_view</span>
         </button>
         <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">Select Screen</p>
            {Object.values(Screen).map((screen) => (
              <button
                key={screen}
                onClick={() => handleNavigate(screen)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === screen 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {screen}
              </button>
            ))}
         </div>
      </div>

      {renderScreen()}
    </div>
  );
}