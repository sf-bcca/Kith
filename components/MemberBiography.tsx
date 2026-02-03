import React, { useMemo, useState, useEffect } from 'react';
import { FamilyService } from '../services/FamilyService';
import { FamilyMember } from '../types/family';

interface Props {
  onNavigate: (screen: string) => void;
  memberId?: string;
  loggedInId?: string | null;
}

const MemberBiography: React.FC<Props> = ({ onNavigate, memberId, loggedInId }) => {
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loggedInMember, setLoggedInMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<FamilyMember>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const promises: Promise<any>[] = [];
        if (memberId) {
          promises.push(FamilyService.getById(memberId));
        } else {
          promises.push(Promise.resolve(null));
        }

        if (loggedInId) {
          promises.push(FamilyService.getById(loggedInId));
        } else {
          promises.push(Promise.resolve(null));
        }

        const [memberResult, loggedInResult] = await Promise.all(promises);
        
        setMember(memberResult || null);
        setLoggedInMember(loggedInResult || null);
        
        if (memberResult) {
          setEditData(memberResult);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memberId, loggedInId]);

  const handleSave = async () => {
    if (!member?.id) return;
    setSaving(true);
    try {
      const updated = await FamilyService.update(member.id, editData);
      setMember(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update member:', err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
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
    } catch (err) {
      console.error('Failed to delete member:', err);
      alert('Failed to delete member.');
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

  if (!member) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light min-h-screen">
        <div className="text-center p-6">
           <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">person_off</span>
           <p className="text-slate-500 font-bold">Member not found.</p>
           <button onClick={() => onNavigate('Tree')} className="mt-4 text-primary font-bold text-sm">Return to Tree</button>
        </div>
      </div>
    );
  }

  const isOwner = loggedInId === member.id;
  const isAdmin = loggedInMember?.role === 'admin';
  const canDelete = isOwner || isAdmin;
  const canEdit = !!loggedInId; // Collaborative editing: any logged in user can edit

  const years = `${member.birthDate ? new Date(member.birthDate).getFullYear() : ''}–${member.deathDate ? new Date(member.deathDate).getFullYear() : 'Present'}`;

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

      <main className="max-w-md mx-auto min-h-screen pb-20">
        {isEditing ? (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">First Name</label>
                <input
                  type="text"
                  value={editData.firstName || ''}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Last Name</label>
                <input
                  type="text"
                  value={editData.lastName || ''}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Birth Date</label>
                <input
                  type="date"
                  value={editData.birthDate || ''}
                  onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
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
                  { icon: 'child_care', title: `Born in ${member.birthPlace || 'Unknown'}`, date: member.birthDate || 'Unknown Date', isLast: !member.deathDate },
                  ...(member.deathDate ? [{ icon: 'church', title: `Deceased in ${member.deathPlace || 'Unknown'}`, date: member.deathDate, isLast: true }] : []),
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
                      <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{event.date}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </section>

            {/* Biography Summary */}
            <section className="mt-12 px-4 pb-20">
              <h2 className="text-xl font-bold tracking-tight mb-3">Biography</h2>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                  {member.biography || "No biography available for this family member yet."}
              </p>
            </section>
          </>
        )}
      </main>

      {/* Bottom Action Bar */}
      {!isEditing && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent pointer-events-none">
          <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
            <button className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Add Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberBiography;