import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import AccountSettings from './AccountSettings';
import PrivacySettings from './PrivacySettings';
import PreferenceSettings from './PreferenceSettings';
import FamilyManagement from './FamilyManagement';
import { FamilyService } from '../services/FamilyService';
import { FamilyMember } from '../types/family';

interface Props {
  onNavigate: (screen: string, memberId?: string) => void;
  onLogout?: () => void;
  loggedInId?: string | null;
  onPreferenceChange?: (prefs: { darkMode?: boolean; language?: string }) => void;
}

const SettingsView: React.FC<Props> = ({ onNavigate, onLogout, loggedInId, onPreferenceChange }) => {
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'account' | 'privacy' | 'preferences' | 'family'>('overview');

  useEffect(() => {
    const fetchMember = async () => {
      if (!loggedInId) return;
      setLoading(true);
      try {
        const result = await FamilyService.getById(loggedInId);
        setMember(result || null);
      } catch (err) {
        console.error('Failed to fetch logged in member:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [loggedInId]);

  const handleMemberUpdate = (updatedMember: FamilyMember) => {
    setMember(updatedMember);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="size-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-sm font-medium">Loading settings...</p>
        </div>
      );
    }

    if (!member) {
      return (
        <div className="p-8 text-center">
          <p className="text-slate-500">Please log in to manage your settings.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'account':
        return <AccountSettings member={member} onUpdate={handleMemberUpdate} />;
      case 'privacy':
        return <PrivacySettings member={member} onUpdate={handleMemberUpdate} />;
      case 'preferences':
        return (
          <PreferenceSettings 
            member={member} 
            onUpdate={(updated) => {
              handleMemberUpdate(updated);
              onPreferenceChange?.({ darkMode: updated.darkMode, language: updated.language });
            }} 
          />
        );
      case 'family':
        return <FamilyManagement member={member} />;
      default:
        return (
          <>
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white flex flex-col items-center mb-8">
                <button 
                   onClick={() => onNavigate('Biography', loggedInId || undefined)}
                   className="size-20 rounded-full bg-white p-1 shadow-md mb-3 overflow-hidden hover:scale-105 transition-transform active:scale-95"
                >
                    {member?.photoUrl ? (
                       <img src={member.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                       <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                           <span className="material-symbols-outlined text-4xl">person</span>
                       </div>
                    )}
                </button>
                <h2 className="font-bold text-xl">{`${member.firstName} ${member.lastName}`}</h2>
                <p className="text-blue-100 text-sm mb-4">{member?.biography ? (member.biography.slice(0, 30) + '...') : 'No biography set'}</p>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm border border-white/20">Family Member</span>
                    <button 
                       onClick={() => onNavigate('Biography', loggedInId || undefined)}
                       className="px-3 py-1 rounded-full bg-white text-primary text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                       Edit Profile
                    </button>
                </div>
            </div>

            {/* General Section */}
            <div className="mb-2">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">General</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
               <button 
                  onClick={() => setActiveTab('account')}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left group"
               >
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <span className="material-symbols-outlined text-blue-500 text-[20px]">manage_accounts</span>
                  </div>
                  <span className="flex-1 font-semibold text-slate-700 text-sm">Account Settings</span>
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
               </button>

               <button 
                  onClick={() => setActiveTab('privacy')}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left group"
               >
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px]">lock</span>
                  </div>
                  <span className="flex-1 font-semibold text-slate-700 text-sm">Privacy & Security</span>
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
               </button>

               <button 
                  onClick={() => setActiveTab('family')}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left group"
               >
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <span className="material-symbols-outlined text-amber-600 text-[20px]">groups</span>
                  </div>
                  <span className="flex-1 font-semibold text-slate-700 text-sm">Family Management</span>
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
               </button>
            </div>

            {/* Preferences Section */}
            <div className="mb-2">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">App Preferences</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <button 
                  onClick={() => setActiveTab('preferences')}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left group"
                >
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                       <span className="material-symbols-outlined text-slate-500 text-[20px]">palette</span>
                  </div>
                  <span className="flex-1 font-semibold text-slate-700 text-sm">Appearance</span>
                  <span className="text-xs text-slate-400 font-medium mr-2">{member.darkMode ? 'Dark' : 'Light'}</span>
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
               </button>
               <button 
                  onClick={() => setActiveTab('preferences')}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left group"
               >
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                       <span className="material-symbols-outlined text-slate-500 text-[20px]">language</span>
                  </div>
                  <span className="flex-1 font-semibold text-slate-700 text-sm">Language</span>
                  <span className="text-xs text-slate-400 font-medium mr-2">{member.language === 'es' ? 'Español' : member.language === 'fr' ? 'Français' : member.language === 'de' ? 'Deutsch' : 'English'}</span>
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
               </button>
            </div>

            {/* Support Section */}
            <div className="mb-2">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Support</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
               <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left">
                  <span className="material-symbols-outlined text-slate-400">help</span>
                  <span className="flex-1 font-semibold text-slate-700 text-sm">Help Center</span>
               </button>
               <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
                  <span className="material-symbols-outlined text-slate-400">mail</span>
                  <span className="flex-1 font-semibold text-slate-700 text-sm">Contact Support</span>
               </button>
            </div>

            <div className="pb-8">
               <button 
                 onClick={onLogout}
                 className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-300 hover:text-slate-800 transition-colors mb-4"
               >
                  Sign Out
               </button>
               <button 
                 onClick={async () => {
                   if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                     if (loggedInId) {
                       try {
                         await FamilyService.delete(loggedInId);
                         onLogout?.();
                       } catch (err) {
                         alert('Failed to delete account');
                       }
                     }
                   }
                 }}
                 className="w-full py-3.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors mb-4"
               >
                  Delete Account
               </button>
               <p className="text-center text-[10px] text-slate-400">Kith Version 2.4.0 (Build 892)<br/>© 2024 Kith Inc.</p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center">
        {activeTab !== 'overview' && (
          <button 
            onClick={() => setActiveTab('overview')}
            className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center -ml-2 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <h1 className={`text-xl font-bold tracking-tight ${activeTab === 'overview' ? 'text-center flex-1' : 'ml-2'}`}>
          {activeTab === 'overview' ? 'Settings' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Settings'}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-32">
         {renderContent()}
      </main>

      <BottomNav current="Settings" onNavigate={onNavigate} />
    </div>
  );
};

export default SettingsView;