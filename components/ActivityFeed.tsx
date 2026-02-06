import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from './BottomNav';
import MediaGallery from './MediaGallery';
import AddMediaModal from './AddMediaModal';
import { ActivityService } from '../services/ActivityService';
import { FamilyService } from '../services/FamilyService';
import { Activity } from '../types/activity';
import { formatDate } from '../src/utils/dateUtils';

interface Props {
  onNavigate: (screen: string, memberId?: string) => void;
  currentUserId?: string | null;
}

type Tab = 'all' | 'photos';

const ActivityFeed: React.FC<Props> = ({ onNavigate, currentUserId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [membersMap, setMembersMap] = useState<Record<string, string>>({});
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchFeed = async () => {
    try {
      const [feed, members] = await Promise.all([
        ActivityService.getFeed(),
        FamilyService.getAll()
      ]);
      
      const mMap: Record<string, string> = {};
      members.forEach(m => {
        mMap[m.id] = `${m.firstName} ${m.lastName}`;
      });
      
      setMembersMap(mMap);
      setActivities(feed);
    } catch (err) {
      console.error('Failed to fetch activity feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const success = await ActivityService.approveActivity(id);
      if (success) {
        setActivities(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'approved' } : a
        ));
      }
    } catch (err) {
      console.error('Failed to approve activity:', err);
    }
  };

  const handleAddComment = async (activityId: string) => {
    if (!commentText.trim() || !currentUserId) return;
    
    const authorId = currentUserId;
    const text = commentText;

    try {
      if (await ActivityService.addComment(activityId, { authorId, text })) {
        // Update local state for immediate feedback
        setActivities(prev => prev.map(a => {
          if (a.id === activityId) {
            return {
              ...a,
              comments: [...a.comments, {
                id: Date.now().toString(), // Simple local ID
                authorId,
                text,
                timestamp: new Date().toISOString()
              }]
            };
          }
          return a;
        }));
        setCommentingId(null);
        setCommentText('');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const getMemberName = (id: string) => {
    return membersMap[id] || 'Unknown Member';
  };

  const mediaItems = useMemo(() => {
    const items: any[] = [];
    activities.forEach(a => {
      if (a.type === 'photo_added' && a.content.photoUrls) {
        a.content.photoUrls.forEach(url => {
          items.push({
            url,
            activityId: a.id,
            timestamp: a.timestamp,
            actorName: getMemberName(a.actorId),
            description: a.content.description
          });
        });
      }
    });
    return items;
  }, [activities, membersMap]);

  const renderActivityContent = (activity: Activity) => {
    const actorName = getMemberName(activity.actorId);
    const targetName = activity.targetId ? getMemberName(activity.targetId) : '';

    switch (activity.type) {
      case 'photo_added':
        return (
          <>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-slate-900 leading-tight">
                  <span className="font-bold">{actorName}</span> added <span className="font-bold">{activity.content.photoUrls?.length} photos</span> to <span className="text-primary font-semibold cursor-pointer hover:underline">{targetName}</span>
                </p>
                <p className="text-xs text-slate-500">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
            {activity.content.photoUrls && (
              <div className="grid grid-cols-3 gap-2">
                {activity.content.photoUrls.map((url, i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-lg bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundImage: `url('${url}')` }}></div>
                ))}
              </div>
            )}
            {activity.content.description && (
              <p className="text-sm text-slate-600 italic">"{activity.content.description}"</p>
            )}
          </>
        );
      case 'member_updated':
        return (
          <>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                <span className="material-symbols-outlined">person_pin</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-slate-900 leading-tight">
                  <span className="font-bold">{actorName}</span> updated the <span className="font-bold">{activity.content.field}</span> for <span className="text-primary font-semibold cursor-pointer hover:underline">{targetName}</span>
                </p>
                <p className="text-xs text-slate-500">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Old</p>
                <p className="text-slate-400 line-through text-sm">{activity.content.oldValue}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              <div className="text-center">
                <p className="text-[10px] uppercase text-primary font-bold mb-1">New</p>
                <p className="text-slate-900 font-bold text-sm">{activity.content.newValue}</p>
              </div>
            </div>
          </>
        );
      case 'member_added':
        const details = activity.content.memberDetails;
        return (
          <>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined">family_history</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-slate-900 leading-tight">
                  <span className="font-bold">{actorName}</span> added <span className="font-bold">{details?.name}</span> to the family tree
                </p>
                <p className="text-xs text-slate-500">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
            {details && (
              <div className="flex items-center gap-4 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                <div className="size-16 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: `url('${details.imageUrl}')` }}></div>
                <div>
                  <p className="font-bold text-slate-900">{details.name}</p>
                  <p className="text-xs text-slate-500">Born: {formatDate(details.birthDate)}</p>
                  <p className="text-xs text-slate-500 italic mt-1">{details.relationship}</p>
                </div>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light shadow-xl overflow-x-hidden border-x border-gray-100">
        {/* Top App Bar */}
        <header className="sticky top-0 z-10 flex items-center bg-background-light/95 backdrop-blur-md px-4 py-3 justify-between border-b border-slate-200">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-slate-700">notifications</span>
          </div>
          <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Memories & Feed</h1>
          <div className="flex size-10 items-center justify-end">
            <button className="flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors p-2">
              <span className="material-symbols-outlined text-slate-700">search</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="bg-background-light sticky top-[60px] z-10">
          <div className="flex border-b border-slate-200 px-4 gap-6">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 px-2 transition-colors ${
                activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <p className="text-sm font-bold tracking-tight">All Updates</p>
            </button>
            <button 
              onClick={() => setActiveTab('photos')}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 px-2 transition-colors ${
                activeTab === 'photos' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <p className="text-sm font-bold tracking-tight">Photos</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 pb-3 pt-4 px-2 transition-colors">
              <p className="text-sm font-bold tracking-tight">Stories</p>
            </button>
          </div>
        </nav>

        {/* Main Feed */}
        <main className="flex-1 overflow-y-auto space-y-4 py-4 px-4 pb-32">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-slate-500">
              Loading memories...
            </div>
          ) : activeTab === 'photos' ? (
            <MediaGallery items={mediaItems} onSelect={setSelectedMedia} />
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <span className="material-symbols-outlined text-3xl">info</span>
              </div>
              <p className="text-slate-500 font-medium">No activities yet</p>
            </div>
          ) : (
            activities.map((activity) => (
              <section key={activity.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="p-4 flex flex-col gap-3">
                  {renderActivityContent(activity)}
                  
                  {activity.comments.length > 0 && (
                    <div className="mt-2 space-y-2 border-t border-slate-50 pt-2">
                      {activity.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[14px]">person</span>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2 flex-1">
                            <p className="text-xs font-bold">{getMemberName(comment.authorId)}</p>
                            <p className="text-xs text-slate-600">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {commentingId === activity.id && (
                    <div className="mt-2 flex gap-2">
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(activity.id)}
                      />
                      <button 
                        onClick={() => handleAddComment(activity.id)}
                        className="bg-primary text-white rounded-lg px-3 py-1 text-sm font-bold"
                      >
                        Post
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                    <button 
                      onClick={() => setCommentingId(commentingId === activity.id ? null : activity.id)}
                      className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg font-semibold text-sm transition-colors ${
                        commentingId === activity.id ? 'bg-slate-200' : 'bg-slate-100 hover:bg-slate-200'
                      } text-slate-700`}
                    >
                      <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                      Comment
                    </button>
                    <button 
                      onClick={() => handleApprove(activity.id)}
                      disabled={activity.status === 'approved'}
                      className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg font-semibold text-sm transition-colors ${
                        activity.status === 'approved' 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-primary text-white hover:bg-blue-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {activity.status === 'approved' ? 'check_circle' : 'verified'}
                      </span>
                      {activity.status === 'approved' ? 'Approved' : 'Approve'}
                    </button>
                  </div>
                </div>
              </section>
            ))
          )}
        </main>

        {/* FAB */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform hover:shadow-primary/30 z-20"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>

        <BottomNav current="Memories" onNavigate={onNavigate} />
      </div>

      <AddMediaModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchFeed}
        members={Object.entries(membersMap).map(([id, name]) => ({ id, name }))}
      />

      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:scale-110 transition-transform"
            onClick={() => setSelectedMedia(null)}
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          
          <div className="max-w-4xl w-full h-[70vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedMedia.url} 
              alt="Full size" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
          
          <div className="mt-8 text-white text-center max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold">{selectedMedia.actorName}</h3>
            <p className="text-sm text-gray-400 mb-4">{formatDate(selectedMedia.timestamp)}</p>
            {selectedMedia.description && (
              <p className="text-lg italic text-gray-200">"{selectedMedia.description}"</p>
            )}
            
            <div className="mt-6 flex gap-4 justify-center">
               <button className="flex flex-col items-center gap-1 group">
                 <div className="size-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                   <span className="material-symbols-outlined">download</span>
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Save</span>
               </button>
               <button className="flex flex-col items-center gap-1 group">
                 <div className="size-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                   <span className="material-symbols-outlined">share</span>
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
               </button>
               <button 
                 onClick={() => onNavigate('Biography', selectedMedia.actorId)}
                 className="flex flex-col items-center gap-1 group"
               >
                 <div className="size-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                   <span className="material-symbols-outlined">person</span>
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;