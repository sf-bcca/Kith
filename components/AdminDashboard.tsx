import React from 'react';

interface Props {
  onNavigate: (screen: string) => void;
}

const AdminDashboard: React.FC<Props> = ({ onNavigate }) => {
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
              <button className="relative flex size-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
                 <span className="material-symbols-outlined">notifications</span>
                 <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ml-2 border border-primary/30 cursor-pointer hover:bg-primary/30 transition-colors">
                 <span className="text-xs font-bold text-primary">JD</span>
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
                 <p className="text-white text-2xl font-bold tracking-tight">12,840</p>
                 <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">+5%</span>
              </div>
           </div>
           {/* Stat 2 */}
           <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-800 bg-slate-900 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">account_tree</span>
                 <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Trees</p>
              </div>
              <div className="flex items-baseline justify-between">
                 <p className="text-white text-2xl font-bold tracking-tight">3,150</p>
                 <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">+2%</span>
              </div>
           </div>
           {/* Stat 3 */}
           <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-800 bg-slate-900 shadow-sm col-span-2 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-orange-500 text-sm">report_problem</span>
                 <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Reports</p>
              </div>
              <div className="flex items-baseline justify-between">
                 <p className="text-white text-2xl font-bold tracking-tight">24 Issues</p>
                 <span className="text-orange-500 text-xs font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">-10%</span>
              </div>
           </div>
        </div>

        {/* Pending Approvals */}
        <div className="flex items-center justify-between px-4 pt-4">
           <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Pending Approvals</h2>
           <button className="text-primary text-sm font-semibold hover:text-blue-400 transition-colors">View All</button>
        </div>

        <div className="flex flex-col gap-4 p-4">
           {/* Approval Card 1 */}
           <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-1">
                    <p className="text-white text-base font-bold leading-tight">Edit Birth Date</p>
                    <p className="text-slate-400 text-sm font-normal">Submitted by <span className="text-primary font-medium">John Doe</span> for <span className="font-medium">'Sarah Smith'</span></p>
                 </div>
                 <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-800 bg-center bg-cover border border-slate-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuTROIIxNRFF8sP7C4v7uPrSfTGrPwwTOOoSseYpx-kAzYtcqfwrIoiua1rks9UcXLIph7OvRUc9l92FVcZYF33GXnP6KZ4ha7TV5SJAuzfawCufJurpKZgXiGtbtZxaXDPClFIjsLL-g--fcCoQ--2QPD5XCbwloKPbjSxMEcP_MIWUjOsBC90dt45XSOs2O834K4H4d9FQNZDYfn7wCiwrK5hNANzKoo_W3beyyuvhjWemhsExa8_NLJ4CYVU2yGb7Ny8DtHxUI")'}}></div>
              </div>
              <div className="flex gap-2">
                 <button className="flex-1 flex h-10 items-center justify-center rounded-lg bg-primary text-white gap-2 text-sm font-bold shadow-sm shadow-primary/20 hover:bg-blue-600 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>Approve</span>
                 </button>
                 <button className="flex-1 flex h-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 gap-2 text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    <span>Reject</span>
                 </button>
              </div>
           </div>
           {/* Approval Card 2 */}
           <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-1">
                    <p className="text-white text-base font-bold leading-tight">Add Relationship</p>
                    <p className="text-slate-400 text-sm font-normal">Submitted by <span className="text-primary font-medium">Emily Chen</span> for <span className="font-medium">'Robert Miller'</span></p>
                 </div>
                 <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-800 bg-center bg-cover border border-slate-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIslO6fdx8LtzpioWJjiwHajUpr2un0P5-WKJsSHDpy5IdVpj-XKEN4qSZOjHQmvjfjipwVEbtI0NHt1uuBrgXpF4_6iq6SRx0L73R_uLC4gCIc9_AzGKUgReQjKYfY5S6LVv1ZU6SUzSQD-aqAGf4QoN1J6Oue457GJSck2tludE0cc7Z6_r1Mu460X94a8zqXzzq-3wCNdbqPnji566VDHAMIS917KG_0hAuqSBoRtNprFJL6FyuAfpgOBpfVv53jVgfzIw7xbk")'}}></div>
              </div>
              <div className="flex gap-2">
                 <button className="flex-1 flex h-10 items-center justify-center rounded-lg bg-primary text-white gap-2 text-sm font-bold shadow-sm shadow-primary/20 hover:bg-blue-600 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>Approve</span>
                 </button>
                 <button className="flex-1 flex h-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 gap-2 text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    <span>Reject</span>
                 </button>
              </div>
           </div>
        </div>

        {/* Flagged */}
        <div className="flex items-center justify-between px-4 pt-2">
           <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Recent Flagged Content</h2>
           <button className="text-primary text-sm font-semibold hover:text-blue-400 transition-colors">Review Queue</button>
        </div>

        <div className="flex flex-col gap-2 p-4">
           {/* Item 1 */}
           <div className="flex items-center gap-4 rounded-xl bg-slate-900 border border-slate-800 p-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                 <span className="material-symbols-outlined">warning</span>
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-white text-sm font-bold truncate">Privacy Violation</p>
                 <p className="text-slate-400 text-xs truncate">Sensitive address data detected</p>
              </div>
              <button className="h-8 px-3 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-colors">Review</button>
           </div>
           {/* Item 2 */}
           <div className="flex items-center gap-4 rounded-xl bg-slate-900 border border-slate-800 p-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                 <span className="material-symbols-outlined">content_copy</span>
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-white text-sm font-bold truncate">Duplicate Profile</p>
                 <p className="text-slate-400 text-xs truncate">Probable match: ID #8824</p>
              </div>
              <button className="h-8 px-3 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-colors">Review</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;