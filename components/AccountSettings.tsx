import React, { useState } from 'react';
import { FamilyMember } from '../types/family';
import { FamilyService } from '../services/FamilyService';

interface Props {
  member: FamilyMember;
  onUpdate: (updatedMember: FamilyMember) => void;
}

const AccountSettings: React.FC<Props> = ({ member, onUpdate }) => {
  const [email, setEmail] = useState(member.email || '');
  const [username, setUsername] = useState(member.username || '');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (showPasswordChange) {
      if (!currentPassword || !newPassword) {
        setError('Both current and new passwords are required');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      const updated = await FamilyService.updateSettings(member.id, {
        email,
        username,
        ...(showPasswordChange ? { current_password: currentPassword, new_password: newPassword } : {})
      });
      
      onUpdate(updated);
      setSuccess(true);
      if (showPasswordChange) {
        setShowPasswordChange(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update account settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">manage_accounts</span>
        Account Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700"
              placeholder="johndoe"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showPasswordChange ? 'keyboard_arrow_up' : 'lock_reset'}
            </span>
            {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
          </button>

          {showPasswordChange && (
            <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <div>
                <label htmlFor="currentPassword" className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700 text-sm"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700 text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 animate-in shake-in">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2 animate-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Account settings updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">save</span>
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
