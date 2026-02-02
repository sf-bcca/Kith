import React, { useState } from 'react';
import { FamilyService } from '../services/FamilyService';
import { FamilyMember, Gender } from '../types/family';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMember: FamilyMember) => void;
  initialData?: Partial<FamilyMember>;
  relationshipType?: 'child' | 'parent' | 'spouse';
  relativeId?: string;
}

export default function AddMemberModal({ isOpen, onClose, onSuccess, initialData, relationshipType, relativeId }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newMember = await FamilyService.create({
        firstName,
        lastName,
        gender,
        birthDate,
        photoUrl,
        parents: relationshipType === 'child' && relativeId ? [relativeId] : [],
        spouses: relationshipType === 'spouse' && relativeId ? [relativeId] : [],
        children: relationshipType === 'parent' && relativeId ? [relativeId] : [],
      });

      // If there's a relative, we need to update the relative's relationships too
      if (relativeId && relationshipType) {
        const relative = await FamilyService.getById(relativeId);
        if (relative) {
          const updatedRelative = { ...relative };
          if (relationshipType === 'child') {
            updatedRelative.children = [...(relative.children || []), newMember.id];
          } else if (relationshipType === 'spouse') {
            updatedRelative.spouses = [...(relative.spouses || []), newMember.id];
          } else if (relationshipType === 'parent') {
            updatedRelative.parents = [...(relative.parents || []), newMember.id];
          }
          await FamilyService.update(relativeId, updatedRelative);
        }
      }

      onSuccess(newMember);
      onClose();
      // Reset form
      setFirstName('');
      setLastName('');
      setBirthDate('');
    } catch (err) {
      setError('Failed to add family member. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">
            {relationshipType ? `Add ${relationshipType.charAt(0).toUpperCase() + relationshipType.slice(1)}` : 'Add Family Member'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none bg-white appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Birth Date</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Profile Photo (Optional)</label>
            <div className="flex items-center gap-4 mt-1">
              <div className="size-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400 text-3xl">person</span>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  Upload or Take Selfie
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement('canvas');
                          const MAX_WIDTH = 400;
                          const MAX_HEIGHT = 400;
                          let width = img.width;
                          let height = img.height;

                          if (width > height) {
                            if (width > MAX_WIDTH) {
                              height *= MAX_WIDTH / width;
                              width = MAX_WIDTH;
                            }
                          } else {
                            if (height > MAX_HEIGHT) {
                              width *= MAX_HEIGHT / height;
                              height = MAX_HEIGHT;
                            }
                          }

                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          ctx?.drawImage(img, 0, 0, width, height);
                          
                          // Compress to JPEG with 0.7 quality
                          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                          setPhotoUrl(compressedBase64);
                        };
                        img.src = reader.result as string;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {photoUrl && (
                <button 
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-primary text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
