import React, { useState } from 'react';
import { FamilyService } from '../services/FamilyService';
import { FamilyMember, Gender } from '../types/family';
import RelationshipWizard, { SiblingEntry } from './RelationshipWizard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMember: FamilyMember) => void;
  initialData?: Partial<FamilyMember>;
  relationshipType?: 'child' | 'parent' | 'spouse';
  relativeId?: string;
}

export default function AddMemberModal({ isOpen, onClose, onSuccess, initialData, relationshipType, relativeId }: Props) {
  const [activeTab, setActiveTab] = useState<'new' | 'link'>('new');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [isDeceased, setIsDeceased] = useState(false);
  const [deathDate, setDeathDate] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sibling wizard state
  const [siblings, setSiblings] = useState<string[]>([]);
  const [showSiblingWizard, setShowSiblingWizard] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);
  const [searching, setSearching] = useState(false);

  // Effect to reset state when modal opens/closes or tab changes
  React.useEffect(() => {
    setError(null);
    if (isOpen) {
      if (activeTab === 'new') {
        setLastName(initialData?.lastName || '');
        setFirstName('');
        setBirthDate('');
        setBirthPlace('');
        setIsDeceased(false);
        setDeathDate('');
        setDeathPlace('');
        setEmail('');
        setPhotoUrl('');
        setSiblings([]);
      } else {
        setSearchQuery('');
        setSearchResults([]);
      }
    }
  }, [isOpen, initialData, activeTab]);

  // Handle sibling updates from wizard
  const handleSiblingUpdate = (siblingIds: string[], entries: SiblingEntry[]) => {
    setSiblings(siblingIds);
    setShowSiblingWizard(false);
  };

  // Search effect
  React.useEffect(() => {
    const searchMembers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        const results = await FamilyService.search(searchQuery);
        // Filter out the current relative if possible to avoid self-linking (though backend catches it)
        const filtered = results.filter(m => m.id !== relativeId);
        setSearchResults(filtered);
      } catch (err: any) {
        console.error('Search failed', err);
        setError(`Search failed: ${err.message}`);
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(searchMembers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, relativeId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (isDeceased && deathDate) {
      const birth = birthDate ? new Date(birthDate) : null;
      const death = new Date(deathDate);
      const today = new Date();

      if (death > today) {
        setError("Date of Death cannot be in the future.");
        setLoading(false);
        return;
      }

      if (birth && death < birth) {
        setError("Date of Death must be after Date of Birth.");
        setLoading(false);
        return;
      }
    }

    try {
      const newMember = await FamilyService.create({
        firstName,
        lastName,
        gender,
        birthDate,
        birthPlace,
        deathDate: isDeceased ? deathDate : undefined,
        deathPlace: isDeceased ? deathPlace : undefined,
        email,
        photoUrl,
        parents: relationshipType === 'child' && relativeId ? [relativeId] : [],
        spouses: relationshipType === 'spouse' && relativeId ? [relativeId] : [],
        children: relationshipType === 'parent' && relativeId ? [relativeId] : [],
        siblings,
      });

      onSuccess(newMember);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add family member. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async (memberToLink: FamilyMember) => {
    if (!relativeId || !relationshipType) return;
    
    setLoading(true);
    setError(null);
    try {
      await FamilyService.linkMembers(relativeId, memberToLink.id, relationshipType);
      onSuccess(memberToLink);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to link member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {relationshipType ? `Add ${relationshipType.charAt(0).toUpperCase() + relationshipType.slice(1)}` : 'Add Family Member'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>
          
          {/* Tabs */}
          {relativeId && relationshipType && (
            <div className="flex p-1 bg-slate-200/50 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'new' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Create New
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('link')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'link' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Link Existing
              </button>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-8">
          {activeTab === 'new' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
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
                  <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Gender</label>
                  <select
                    id="gender"
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
                  <label htmlFor="birthDate" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Birth Date</label>
                  <input
                    type="date"
                    id="birthDate"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="birthPlace" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Birth Place</label>
                <input
                  type="text"
                  id="birthPlace"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  placeholder="e.g. New York, USA"
                />
              </div>

              <div className="flex items-center gap-2 ml-1">
                <input
                  type="checkbox"
                  id="isDeceased"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all"
                />
                <label htmlFor="isDeceased" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Deceased
                </label>
              </div>

              {isDeceased && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label htmlFor="deathDate" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Date of Death</label>
                    <input
                      type="date"
                      id="deathDate"
                      value={deathDate}
                      onChange={(e) => setDeathDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="deathPlace" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Place of Death</label>
                    <input
                      type="text"
                      id="deathPlace"
                      value={deathPlace}
                      onChange={(e) => setDeathPlace(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      placeholder="e.g. London, UK"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  placeholder="e.g. john.doe@example.com"
                />
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

              <div className="border-t border-slate-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowSiblingWizard(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-100 hover:border-primary/30 transition-all"
                >
                  <span className="material-symbols-outlined text-primary">family_restroom</span>
                  {siblings.length > 0
                    ? `Manage Siblings (${siblings.length} selected)`
                    : 'Add Siblings'}
                </button>
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
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Search Family Member</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    placeholder="Search by name..."
                    autoFocus
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                </div>
              </div>

              <div className="space-y-2">
                {searching ? (
                   <div className="text-center py-8 text-slate-400">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors group">
                      <div className="size-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-400">person</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">
                          Born: {member.birthDate ? new Date(member.birthDate).getFullYear() : 'Unknown'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleLink(member)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                      >
                        Link
                      </button>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="text-center py-8 text-slate-400">No members found.</div>
                ) : (
                  <div className="text-center py-8 text-slate-400">Start typing to search...</div>
                )}
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {showSiblingWizard && (
          <RelationshipWizard
            existingSiblings={siblings}
            onUpdate={handleSiblingUpdate}
            onCancel={() => setShowSiblingWizard(false)}
          />
        )}
      </div>
    </div>
  );
}
