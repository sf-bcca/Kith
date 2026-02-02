import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { FamilyService } from '../services/FamilyService';
import { FamilyMember } from '../types/family';

interface Props {
  onNavigate: (screen: string, memberId?: string) => void;
  onLogout?: () => void;
  loggedInId?: string | null;
}

const SettingsView: React.FC<Props> = ({ onNavigate, onLogout, loggedInId }) => {
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/95 backdrop-blur-md px-4 py-3 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-center">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
         {/* Profile Card */}
         <div className="bg-gradient-to-br from-primary to-blue-600 m-4 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white flex flex-col items-center">
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
             <h2 className="font-bold text-xl">{loading ? 'Loading...' : (member ? `${member.firstName} ${member.lastName}` : 'Guest User')}</h2>
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
         <div className="px-4 mb-2 mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">General</h3>
         </div>
         <div className="bg-white mx-4 rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            {[
                { icon: 'manage_accounts', label: 'Account Settings', color: 'text-blue-500' },
                { icon: 'notifications', label: 'Notifications', color: 'text-amber-500' },
                { icon: 'lock', label: 'Privacy & Security', color: 'text-emerald-500' },
                { icon: 'credit_card', label: 'Subscription', color: 'text-purple-500', badge: 'Active' }
            ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left group">
                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                        <span className={`material-symbols-outlined ${item.color} text-[20px]`}>{item.icon}</span>
                    </div>
                    <span className="flex-1 font-semibold text-slate-700 text-sm">{item.label}</span>
                    {item.badge && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2">{item.badge}</span>}
                    <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
                </button>
            ))}
         </div>

         {/* Preferences Section */}
         <div className="px-4 mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">App Preferences</h3>
         </div>
         <div className="bg-white mx-4 rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
             <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left group">
               <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500 text-[20px]">palette</span>
               </div>
               <span className="flex-1 font-semibold text-slate-700 text-sm">Appearance</span>
               <span className="text-xs text-slate-400 font-medium mr-2">Light</span>
               <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left group">
               <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500 text-[20px]">language</span>
               </div>
               <span className="flex-1 font-semibold text-slate-700 text-sm">Language</span>
               <span className="text-xs text-slate-400 font-medium mr-2">English</span>
               <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
            </button>
         </div>

         {/* Support Section */}
         <div className="px-4 mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Support</h3>
         </div>
         <div className="bg-white mx-4 rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left">
               <span className="material-symbols-outlined text-slate-400">help</span>
               <span className="flex-1 font-semibold text-slate-700 text-sm">Help Center</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
               <span className="material-symbols-outlined text-slate-400">mail</span>
               <span className="flex-1 font-semibold text-slate-700 text-sm">Contact Support</span>
            </button>
         </div>

         <div className="px-8 pb-8">
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
      </main>

      <BottomNav current="Settings" onNavigate={onNavigate} />
    </div>
  );
};

export default SettingsView;