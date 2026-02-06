import React, { useMemo, useState, useEffect } from 'react';
import { FamilyService } from '../services/FamilyService';
import { FamilyMember } from '../types/family';
import { formatDate, validateLifespan } from '../src/utils/dateUtils';
import RelationshipWizard, { SiblingEntry } from './RelationshipWizard';

interface Props {
  onNavigate: (screen: string, memberId?: string) => void;
  memberId?: string;
  loggedInId?: string | null;
  onSelect?: (id: string) => void;
  initialEditMode?: boolean;
  initialMember?: FamilyMember | null;
}

const MemberBiography: React.FC<Props> = ({ onNavigate, memberId, loggedInId, onSelect, initialEditMode = false, initialMember }) => {
  const [member, setMember] = useState<FamilyMember | null>(initialMember || null);
  const [loggedInMember, setLoggedInMember] = useState<FamilyMember | null>(null);
  const [siblings, setSiblings] = useState<FamilyMember[]>([]);
  const [children, setChildren] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<FamilyMember>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeceased, setIsDeceased] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // If we have initialMember and it matches the requested ID, use it and skip fetch
      if (initialMember && initialMember.id === memberId && member?.id === memberId) {
        setLoading(false);
        // We still need loggedInMember info if not present
        if (loggedInId && !loggedInMember) {
             try {
                const me = await FamilyService.getById(loggedInId);
                setLoggedInMember(me || null);
             } catch(e) { console.warn('Failed to fetch loggedInMember', e); }
        }
        // Fetch relations if needed
        if (initialMember) {
           try {
             const [sibs, kids] = await Promise.all([
               FamilyService.getSiblings(initialMember.id),
               FamilyService.getByIds(initialMember.children)
             ]);
             setSiblings(sibs);
             setChildren(kids);
           } catch (e) { console.warn('Failed to fetch relations', e); }
        }
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const [memberData, loggedInMemberData] = await Promise.all([
          // Only fetch member if we don't have it or ID mismatch
          (initialMember && initialMember.id === memberId) ? Promise.resolve(initialMember) : FamilyService.getById(memberId!),
          loggedInId ? FamilyService.getById(loggedInId) : Promise.resolve(null)
        ]);

        if (!memberData) throw new Error('Member not found');

        setMember(memberData);
        setLoggedInMember(loggedInMemberData || null);
        setEditData(memberData);
        setIsDeceased(!!memberData.deathDate);

        // Load relationships
        const [siblingsData, childrenData] = await Promise.all([
          FamilyService.getSiblings(memberData.id),
          FamilyService.getByIds(memberData.children)
        ]);
        
        setSiblings(siblingsData);
        setChildren(childrenData);

      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Failed to load member profile');
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      console.log(`DEBUG: MemberBiography mounted with memberId: ${memberId}`);
      fetchData();
    } else {
      console.log('DEBUG: MemberBiography mounted without memberId');
      setLoading(false);
    }
  }, [memberId, loggedInId]);

  useEffect(() => {
    setIsEditing(initialEditMode || false);
  }, [initialEditMode, memberId]); // Reset/update edit mode when member or params change

  const handleSave = async () => {
    if (!member?.id) return;
    setError(null);

    // Validation using shared utility
    const lifespanValidation = validateLifespan(editData.birthDate, isDeceased ? editData.deathDate : null);
    if (!lifespanValidation.isValid) {
      setError(lifespanValidation.error || "Invalid date range.");
      return;
    }

    setSaving(true);
    try {
      const finalData = { ...editData };
      if (!isDeceased) {
        finalData.deathDate = null; // Use null to explicitly unset in backend
        finalData.deathPlace = null;
      }
      const updated = await FamilyService.update(member.id, finalData);
      setMember(updated);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to update member:', err);
      const errorMessage = err.message || err.error || 'Failed to save changes. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleWizardUpdate = async (ids: string[], entries: SiblingEntry[]) => {
    if (!member?.id) return;
    try {
      // 1. Update the siblings list for this member using enhanced objects
      const updated = await FamilyService.update(member.id, { siblings: entries as any });
      setMember(updated);

      // 2. Handle parent syncing for "Full Siblings"
      // If we are marked as full siblings, we should share the same parents
      const myParents = member.parents || [];
      if (myParents.length > 0) {
        for (const entry of entries) {
          if (entry.siblingType === 'full' && entry.id) {
            // Check if this sibling already has these parents to avoid redundant calls
            const siblingData = await FamilyService.getById(entry.id);
            const siblingParents = siblingData?.parents || [];
            
            for (const parentId of myParents) {
              if (!siblingParents.includes(parentId)) {
                console.log(`DEBUG: Syncing parent ${parentId} to full sibling ${entry.id}`);
                await FamilyService.linkMembers(entry.id, parentId, 'parent');
              }
            }
          }
        }
      }

      const updatedSiblings = await FamilyService.getSiblings(member.id);
      setSiblings(updatedSiblings);
      setIsWizardOpen(false);
    } catch (err: any) {
      console.error('Failed to update siblings:', err);
      const msg = err.message || err.error || 'Failed to update siblings.';
      alert(msg);
    }
  };

  const handleDelete = async () => {
    if (!member?.id) return;
    if (!window.confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await FamilyService.delete(member.id);
      if (loggedInId === member.id) {
        // If deleting own account, we should probably log out or go to welcome
        onNavigate('Welcome');
      } else {
        onNavigate('Tree');
      }
    } catch (err: any) {
      console.error('Failed to delete member:', err);
      const msg = err.message || err.error || 'Failed to delete member.';
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
           <div className="size-10 bg-primary/20 rounded-full mb-2"></div>
           <p className="text-slate-400 text-xs font-medium tracking-tight">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light min-h-screen">
        <div className="text-center p-6 bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="material-symbols-outlined text-3xl text-slate-400">person_off</span>
           </div>
           <h3 className="text-lg font-bold text-slate-900 mb-2">Member not found</h3>
           <p className="text-slate-500 text-sm mb-4">
             We couldn't load the profile for ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">{memberId || 'undefined'}</code>
           </p>
           {error && (
             <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs text-left mb-6 overflow-auto max-h-32">
               <strong>Error Details:</strong><br/>
               {typeof error === 'string' ? error : JSON.stringify(error)}
             </div>
           )}
           <button 
             onClick={() => onNavigate('Tree')} 
             className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
             Return to Tree
           </button>
        </div>
      </div>
    );
  }

  const isOwner = loggedInId === member.id;
  const isAdmin = loggedInMember?.role === 'admin';
  const canDelete = isOwner || isAdmin;
  const canEdit = !!loggedInId; // Collaborative editing: any logged in user can edit

  const birthYear = member.birthDate ? new Date(member.birthDate).getFullYear() : '';
  const deathYear = member.deathDate ? new Date(member.deathDate).getFullYear() : (isDeceased ? 'Unknown' : 'Present');
  const years = birthYear || member.deathDate ? `${birthYear}–${deathYear}` : '';

  return (
    <div className="bg-background-light font-display text-[#0d121b] antialiased overflow-x-hidden min-h-screen">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 flex items-center bg-background-light/80 backdrop-blur-md p-4 justify-between border-b border-gray-200">
        <button 
          onClick={() => onNavigate('Tree')}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[#0d121b]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-sm font-bold leading-tight tracking-tight flex-1 text-center truncate px-2">
          {isEditing ? 'Editing Profile' : `${member.firstName} ${member.lastName} (${years})`}
        </h2>
        <div className="flex items-center justify-end">
          {isEditing ? (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="text-primary font-bold text-sm px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <div className="flex items-center gap-1">
              {canEdit && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[#0d121b]">edit</span>
                </button>
              )}
              <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-[#0d121b]">ios_share</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-md mx-auto min-h-screen pb-32 relative z-10">
        {isEditing ? (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={editData.firstName || ''}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={editData.lastName || ''}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  value={editData.birthDate || ''}
                  onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="birthPlace" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Birth Place</label>
                <input
                  type="text"
                  id="birthPlace"
                  value={editData.birthPlace || ''}
                  onChange={(e) => setEditData({ ...editData, birthPlace: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  placeholder="e.g. London, UK"
                />
              </div>
              <div className="flex items-center gap-2 ml-1 py-2">
                <input
                  type="checkbox"
                  id="isDeceased"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all"
                />
                <label htmlFor="isDeceased" className="text-sm font-bold text-gray-700 cursor-pointer">
                  Deceased
                </label>
              </div>
              {isDeceased && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label htmlFor="deathDate" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Date of Death</label>
                    <input
                      type="date"
                      id="deathDate"
                      value={editData.deathDate || ''}
                      onChange={(e) => setEditData({ ...editData, deathDate: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="deathPlace" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Place of Death</label>
                    <input
                      type="text"
                      id="deathPlace"
                      value={editData.deathPlace || ''}
                      onChange={(e) => setEditData({ ...editData, deathPlace: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      placeholder="e.g. London, UK"
                    />
                  </div>
                </div>
              )}
              <div className="py-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Siblings</label>
                <div className="space-y-3">
                  {siblings.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {siblings.map(s => (
                        <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                          <span className="text-xs font-bold text-slate-600">{s.firstName} {s.lastName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">group_add</span>
                    Manage Siblings
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  placeholder="e.g. john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Biography</label>
                <textarea
                  value={editData.biography || ''}
                  onChange={(e) => setEditData({ ...editData, biography: e.target.value })}
                  rows={6}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell your story..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Profile Photo</label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="size-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    <img 
                      src={editData.photoUrl || member.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all">
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
                              setEditData({ ...editData, photoUrl: compressedBase64 });
                            };
                            img.src = reader.result as string;
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 animate-in shake-in">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {error}
              </div>
            )}

            {canDelete && (
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                  {deleting ? 'Deleting...' : 'Delete Member'}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-3 px-4">
                  Deleting a member will permanently remove them and all their associated records from the family tree. This action cannot be undone.
                </p>
              </div>
            )}

            <button 
              onClick={() => setIsEditing(false)}
              className="w-full py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative">
              <div 
                className="w-full h-64 bg-cover bg-center opacity-50" 
                style={{ 
                  backgroundImage: `url(${member.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'})`,
                  filter: "sepia(0.6) contrast(1.1) brightness(0.9)"
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background-light via-transparent to-transparent"></div>
              
              <div className="relative -mt-20 px-4 flex flex-col items-center">
                <div className="size-32 rounded-full border-4 border-background-light overflow-hidden shadow-xl">
                  <img 
                    alt={`${member.firstName} ${member.lastName}`} 
                    className="w-full h-full object-cover" 
                    style={{ filter: "sepia(0.2) contrast(1.05) brightness(1)" }}
                    src={member.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h1 className="text-2xl font-bold tracking-tight">{member.firstName} {member.lastName}</h1>
                  <p className="text-primary font-medium text-sm mt-1">{years}</p>
                </div>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-sm">family_history</span>
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">Family Member</span>
                  </div>
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-slate-500 text-sm">mail</span>
                      <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Email</span>
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Life Events Timeline */}
            <section className="mt-8 px-4">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-xl font-bold tracking-tight">Life Events</h2>
                <button 
                  onClick={() => onNavigate('DNA Map')}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  View map
                </button>
              </div>
              
              <div className="grid grid-cols-[40px_1fr] gap-x-3 mt-2">
                {[
                  { icon: 'child_care', title: `Born in ${member.birthPlace || 'Unknown'}`, date: member.birthDate || 'Unknown Date', isLast: !member.deathDate && siblings.length === 0 && children.length === 0 },
                  ...(member.deathDate ? [{ icon: 'church', title: `Deceased in ${member.deathPlace || 'Unknown'}`, date: member.deathDate, isLast: siblings.length === 0 && children.length === 0 }] : []),
                ].map((event, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[22px]">{event.icon}</span>
                      </div>
                      {!event.isLast && <div className="w-[2px] bg-gray-200 h-full grow my-1"></div>}
                    </div>
                    <div className={`pt-1 ${!event.isLast ? 'pb-8' : ''}`}>
                      <p className="text-base font-bold leading-none">{event.title}</p>
                      <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{formatDate(event.date)}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </section>

            {/* Siblings Section */}
            {siblings.length > 0 && (
              <section className="mt-8 px-4">
                <h2 className="text-xl font-bold tracking-tight mb-4">Siblings</h2>
                <div className="flex flex-wrap gap-3">
                  {siblings.map((sibling) => (
                    <button
                      key={sibling.id}
                      onClick={() => {
                        if (onSelect) onSelect(sibling.id);
                        onNavigate('Biography', sibling.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all shadow-sm group"
                    >
                      <div className="size-6 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                        {sibling.photoUrl ? (
                          <img src={sibling.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-xs text-slate-400 flex items-center justify-center h-full">person</span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary">
                        {sibling.firstName} {sibling.lastName}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Children Section */}
            {children.length > 0 && (
              <section className="mt-8 px-4 relative z-30">
                <h2 className="text-xl font-bold tracking-tight mb-4">Children</h2>
                <div className="flex flex-wrap gap-3">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => {
                        console.log('DEBUG: Navigating to child biography:', child.id);
                        if (onSelect) onSelect(child.id);
                        onNavigate('Biography', child.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all shadow-sm group active:scale-95 cursor-pointer"
                    >
                      <div className="size-6 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                        {child.photoUrl ? (
                          <img src={child.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-xs text-slate-400 flex items-center justify-center h-full">person</span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary">
                        {child.firstName} {child.lastName}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Biography Summary */}
            <section className="mt-12 px-4 pb-12">
              <h2 className="text-xl font-bold tracking-tight mb-3">Biography</h2>
              <p className="text-gray-600 text-sm leading-relaxed italic mb-8">
                  {member.biography || "No biography available for this family member yet."}
              </p>

              {/* Memory Action (Moved from fixed bar) */}
              <button className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Add Memory
              </button>
            </section>
          </>
        )}
      </main>

      {isWizardOpen && (
        <RelationshipWizard
          existingSiblings={siblings.map(s => s.id)}
          onUpdate={handleWizardUpdate}
          onCancel={() => setIsWizardOpen(false)}
        />
      )}
    </div>
  );
};

export default MemberBiography;