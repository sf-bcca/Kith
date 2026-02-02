import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { ActivityService } from '../services/ActivityService';
import { FamilyService } from '../services/FamilyService';
import { Activity } from '../types/activity';

interface Props {
  onNavigate: (screen: string) => void;
}

const ActivityFeed: React.FC<Props> = ({ onNavigate }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(ActivityService.getFeed());
  }, []);

  const handleApprove = (id: string) => {
    if (ActivityService.approveActivity(id)) {
      setActivities(ActivityService.getFeed());
    }
  };

  const getMemberName = (id: string) => {
    const member = FamilyService.getById(id);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
  };

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
                  <p className="text-xs text-slate-500">Born: {details.birthDate}</p>
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
            <button className="flex flex-col items-center justify-center border-b-[3px] border-primary text-primary pb-3 pt-4 px-2">
              <p className="text-sm font-bold tracking-tight">All Updates</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 pb-3 pt-4 px-2 transition-colors">
              <p className="text-sm font-bold tracking-tight">Photos</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 pb-3 pt-4 px-2 transition-colors">
              <p className="text-sm font-bold tracking-tight">Profile</p>
            </button>
          </div>
        </nav>

        {/* Main Feed */}
        <main className="flex-1 overflow-y-auto space-y-4 py-4 px-4 pb-32">
          {activities.map((activity) => (
            <section key={activity.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="p-4 flex flex-col gap-3">
                {renderActivityContent(activity)}
                
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                  <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors">
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
          ))}
        </main>

        {/* FAB */}
        <button className="fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform hover:shadow-primary/30 z-20">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>

        <BottomNav current="Memories" onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default ActivityFeed;
