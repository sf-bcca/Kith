import React, { useState } from 'react';
import { FamilyMember } from '../types/family';
import { FamilyService } from '../services/FamilyService';

interface Props {
  member: FamilyMember;
  onUpdate: (updatedMember: FamilyMember) => void;
}

const PrivacySettings: React.FC<Props> = ({ member, onUpdate }) => {
  const [visibility, setVisibility] = useState(member.visibility || 'family-only');
  const [dataSharing, setDataSharing] = useState(member.dataSharing !== false);
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
        visibility,
        dataSharing
      });
      onUpdate(updated);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-500">lock</span>
        Privacy & Security
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="visibility" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Profile Visibility</label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700 bg-white"
              >
                <option value="public">Public (Everyone)</option>
                <option value="family-only">Family Only (Confirmed Members)</option>
                <option value="private">Private (Only Me)</option>
              </select>
              <p className="mt-2 text-xs text-slate-400 px-1">Controls who can see your profile, biography, and media.</p>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <label htmlFor="dataSharing" className="block text-sm font-bold text-slate-700">Share Usage Data</label>
              <p className="text-xs text-slate-400">Help us improve Kith by sharing anonymous usage statistics.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="dataSharing"
                type="checkbox"
                checked={dataSharing}
                onChange={(e) => setDataSharing(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
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
            Privacy settings saved!
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
              Save Privacy Settings
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PrivacySettings;
