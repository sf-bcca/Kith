import React, { useState, useEffect } from 'react';
import { FamilyService } from '../services/FamilyService';
import { ActivityService } from '../services/ActivityService';
import { Activity } from '../types/activity';

interface Props {
  onNavigate: (screen: string) => void;
}

interface Stats {
  totalMembers: number;
  totalActivities: number;
  pendingApprovals: number;
}

const AdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingActivities, setPendingActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        FamilyService.getAdminStats(),
        ActivityService.getFeed({ status: 'pending' })
      ]);
      setStats(statsRes);
      setPendingActivities(pendingRes);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const success = await ActivityService.approveActivity(id);
      if (success) {
        // Refresh data
        fetchData();
      }
    } catch (err) {
      console.error('Failed to approve activity:', err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="bg-background-dark text-slate-100 font-display min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
           <div className="size-12 bg-primary/20 rounded-full mb-4"></div>
           <p className="text-slate-400 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center bg-background-dark/95 backdrop-blur-md p-4 border-b border-slate-800 justify-between">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('Discover')}
                className="text-slate-300 p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                 <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Admin Dashboard</h2>
           </div>
           <div className="flex items-center gap-1">
              <button 
                onClick={() => fetchData()}
                className="relative flex size-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
              >
                 <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
              </button>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ml-2 border border-primary/30">
                 <span className="text-xs font-bold text-primary">AD</span>
              </div>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="p-4 grid grid-cols-2 gap-4">
           {/* Stat 1 */}
           <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-800 bg-slate-900 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">group</span>
                 <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Users</p>
              </div>
              <div className="flex items-baseline justify-between">
                 <p className="text-white text-2xl font-bold tracking-tight">{stats?.totalMembers || 0}</p>
              </div>
           </div>
           {/* Stat 2 */}
           <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-800 bg-slate-900 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">account_tree</span>
                 <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Activities</p>
              </div>
              <div className="flex items-baseline justify-between">
                 <p className="text-white text-2xl font-bold tracking-tight">{stats?.totalActivities || 0}</p>
              </div>
           </div>
           {/* Stat 3 */}
           <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-800 bg-slate-900 shadow-sm col-span-2 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-orange-500 text-sm">report_problem</span>
                 <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Approvals</p>
              </div>
              <div className="flex items-baseline justify-between">
                 <p className="text-white text-2xl font-bold tracking-tight">{stats?.pendingApprovals || 0} Items</p>
              </div>
           </div>
        </div>

        {/* Pending Approvals */}
        <div className="flex items-center justify-between px-4 pt-4">
           <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Approval Queue</h2>
           <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded-md text-slate-400">
             {pendingActivities.length} Pending
           </span>
        </div>

        <div className="flex flex-col gap-4 p-4">
           {pendingActivities.length === 0 ? (
             <div className="py-12 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                <span className="material-symbols-outlined text-slate-700 text-4xl mb-2">check_circle</span>
                <p className="text-slate-500 font-medium">All caught up! No pending approvals.</p>
             </div>
           ) : (
             pendingActivities.map((activity) => (
               <div key={activity.id} className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start">
                     <div className="flex flex-col gap-1">
                        <p className="text-white text-base font-bold leading-tight capitalize">{activity.type.replace('_', ' ')}</p>
                        <p className="text-slate-400 text-sm font-normal">
                          {activity.content.description}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                     </div>
                     {activity.content.photoUrls?.[0] && (
                       <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-800 bg-center bg-cover border border-slate-700" style={{backgroundImage: `url("${activity.content.photoUrls[0]}")`}}></div>
                     )}
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => handleApprove(activity.id)}
                        className="flex-1 flex h-10 items-center justify-center rounded-lg bg-primary text-white gap-2 text-sm font-bold shadow-sm shadow-primary/20 hover:bg-blue-600 transition-colors"
                     >
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        <span>Approve</span>
                     </button>
                     <button className="flex-1 flex h-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 gap-2 text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                        <span>Dismiss</span>
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Flagged Section - Remains Static for now as per spec */}
        <div className="flex items-center justify-between px-4 pt-2">
           <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Security Alerts</h2>
        </div>

        <div className="flex flex-col gap-2 p-4 pb-20">
           <div className="flex items-center gap-4 rounded-xl bg-slate-900 border border-slate-800 p-3 hover:bg-slate-800/50 transition-colors cursor-pointer text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                 <span className="material-symbols-outlined">shield</span>
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-white text-sm font-bold truncate">RBAC Active</p>
                 <p className="text-slate-400 text-xs truncate">Collaborative editing enabled</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;