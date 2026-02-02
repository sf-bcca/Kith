import React, { useState } from 'react';
import { FamilyMember } from '../types/family';
import { FamilyService } from '../services/FamilyService';

interface Props {
  member: FamilyMember;
  onUpdate: (updatedMember: FamilyMember) => void;
}

const PreferenceSettings: React.FC<Props> = ({ member, onUpdate }) => {
  const [darkMode, setDarkMode] = useState(member.darkMode || false);
  const [language, setLanguage] = useState(member.language || 'en');
  const [emailNotif, setEmailNotif] = useState(member.notificationsEmail !== false);
  const [pushNotif, setPushNotif] = useState(member.notificationsPush !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const updated = await FamilyService.updateSettings(member.id, {
        darkMode,
        language,
        notificationsEmail: emailNotif,
        notificationsPush: pushNotif
      });
      onUpdate(updated);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-500">settings_suggest</span>
        App Preferences
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <label htmlFor="darkMode" className="block text-sm font-bold text-slate-700">Dark Mode</label>
              <p className="text-xs text-slate-400">Switch between light and dark themes.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="darkMode"
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="p-4">
            <label htmlFor="language" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700 bg-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <label htmlFor="emailNotif" className="block text-sm font-bold text-slate-700">Email Notifications</label>
              <p className="text-xs text-slate-400">Receive weekly family highlights.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="emailNotif"
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <label htmlFor="pushNotif" className="block text-sm font-bold text-slate-700">Push Notifications</label>
              <p className="text-xs text-slate-400">Instant alerts for family activity.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="pushNotif"
                type="checkbox"
                checked={pushNotif}
                onChange={(e) => setPushNotif(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Preferences updated!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">save</span>
              Save Preferences
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PreferenceSettings;
