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
import WelcomeView from './components/WelcomeView';
import DNAMap from './components/DNAMap';
import { FamilyService } from './services/FamilyService';

enum Screen {
  WELCOME = 'Welcome',
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
  DNA_MAP = 'DNA Map',
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.TREE);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [loggedInMemberId, setLoggedInMemberId] = useState<string | null>(localStorage.getItem('kith_member_id'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalDarkMode, setGlobalDarkMode] = useState(false);

  // Check for initial state (empty database or session)
  useEffect(() => {
    const checkState = async () => {
      try {
        setError(null);
        
        if (!loggedInMemberId) {
          const initialized = await FamilyService.isInitialized();
          if (!initialized) {
            setCurrentScreen(Screen.WELCOME);
          } else {
            // Not logged in but db has members, show welcome/login
            setCurrentScreen(Screen.WELCOME);
          }
        } else {
          // Verify logged in member exists
          const member = await FamilyService.getById(loggedInMemberId);
          if (!member) {
            localStorage.removeItem('kith_member_id');
            setLoggedInMemberId(null);
            setCurrentScreen(Screen.WELCOME);
          } else {
            setGlobalDarkMode(member.darkMode || false);
            if (!selectedMemberId) {
              setSelectedMemberId(loggedInMemberId);
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to check app state:', err);
        setError('Unable to connect to the backend server. Please ensure the backend is running on port 8081.');
      } finally {
        setLoading(false);
      }
    };
    checkState();
  }, [loggedInMemberId]);

  // Handle Dark Mode
  useEffect(() => {
    if (currentScreen === Screen.ADMIN || globalDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentScreen, globalDarkMode]);

  const [navigationParams, setNavigationParams] = useState<any>({});

  const handleNavigate = (screen: string, memberId?: string, params: any = {}) => {
    if (memberId) {
      setSelectedMemberId(memberId);
    }
    setNavigationParams(params);
    const target = Object.values(Screen).find(s => s === screen) as Screen;
    if (target) {
      setCurrentScreen(target);
    } else {
      console.warn(`Unknown screen: ${screen}`);
    }
  };

  const handleWelcomeComplete = (rootMemberId: string) => {
    console.log(`DEBUG: handleWelcomeComplete called with rootMemberId: ${rootMemberId}`);
    setLoggedInMemberId(rootMemberId);
    localStorage.setItem('kith_member_id', rootMemberId);
    setSelectedMemberId(rootMemberId);
    setCurrentScreen(Screen.TREE);
  };

  const handleLogout = () => {
    setLoggedInMemberId(null);
    localStorage.removeItem('kith_member_id');
    setCurrentScreen(Screen.WELCOME);
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse flex flex-col items-center">
            <img src="/logo.png" alt="Kith" className="w-32 h-32 mb-4 object-contain" />
            <p className="text-slate-400 font-medium">Loading Kith...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
            <span className="material-symbols-outlined text-3xl">cloud_off</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Server Connection Error</h3>
          <p className="text-slate-500 max-w-xs mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    switch (currentScreen) {
      case Screen.WELCOME: return <WelcomeView onComplete={handleWelcomeComplete} />;
      case Screen.TREE: return <FamilyTreeView onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} onLogout={handleLogout} />;
      case Screen.BIO: return <MemberBiography onNavigate={handleNavigate} memberId={selectedMemberId} loggedInId={loggedInMemberId} onSelect={setSelectedMemberId} initialEditMode={navigationParams?.edit} initialMember={navigationParams?.memberData} />;
      case Screen.MEMORIES: return <ActivityFeed onNavigate={handleNavigate} currentUserId={loggedInMemberId} />;
      case Screen.DISCOVER: return <DiscoverView onNavigate={handleNavigate} />;
      case Screen.SETTINGS: return (
        <SettingsView 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          loggedInId={loggedInMemberId} 
          onPreferenceChange={(prefs) => {
            if (prefs.darkMode !== undefined) setGlobalDarkMode(prefs.darkMode);
          }}
        />
      );
      case Screen.PEDIGREE: return <PedigreeChart onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} loggedInId={loggedInMemberId || undefined} />;
      case Screen.FAN: return <FanChart onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} loggedInId={loggedInMemberId || undefined} />;
      case Screen.DIRECTORY: return <FamilyDirectory onNavigate={handleNavigate} />;
      case Screen.HORIZONTAL: return <HorizontalTree onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />;
      case Screen.ADMIN: return <AdminDashboard onNavigate={handleNavigate} />;
      case Screen.DNA_MAP: return <DNAMap onNavigate={handleNavigate} />;
      default: return <FamilyTreeView onNavigate={handleNavigate} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-slate-900 font-display">
      {/* View Switcher for Demo Purposes - Only show if not on Welcome screen */}
      {currentScreen !== Screen.WELCOME && (
        <div className="fixed top-20 right-4 z-[100] group">
           <button className="bg-slate-900 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined">grid_view</span>
           </button>
           <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">Select Screen</p>
              {Object.values(Screen)
                .filter(s => s !== Screen.WELCOME)
                .map((screen) => (
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
      )}

      {renderScreen()}
    </div>
  );
}