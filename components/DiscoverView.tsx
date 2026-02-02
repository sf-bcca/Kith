import React from 'react';
import BottomNav from './BottomNav';

interface Props {
  onNavigate: (screen: string) => void;
}

const DiscoverView: React.FC<Props> = ({ onNavigate }) => {
  const tools = [
    { title: 'Directory', subtitle: 'Browse all relatives', icon: 'group', screen: 'Directory', color: 'bg-blue-500' },
    { title: 'Pedigree', subtitle: 'Vertical lineage', icon: 'account_tree', screen: 'Pedigree', color: 'bg-emerald-500' },
    { title: 'Fan Chart', subtitle: 'Circular view', icon: 'blur_on', screen: 'Fan Chart', color: 'bg-purple-500' },
    { title: 'Horizontal', subtitle: 'Wide family view', icon: 'linear_scale', screen: 'Horizontal Tree', color: 'bg-orange-500' },
    { title: 'Admin', subtitle: 'Manage content', icon: 'dashboard', screen: 'Admin', color: 'bg-slate-700' },
    { title: 'DNA Map', subtitle: 'Origins & migrations', icon: 'public', screen: 'Tree', color: 'bg-pink-500' },
  ];

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/95 backdrop-blur-md px-4 py-3 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-center">Discover</h1>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto pb-32">
        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input 
            type="text" 
            placeholder="Search records, places, or stories..." 
            className="w-full bg-white border-none rounded-xl py-3 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
          />
        </div>

        {/* Daily Heritage */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Daily Heritage</h2>
                <span className="text-xs font-semibold text-primary">View All</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="size-20 rounded-xl bg-slate-200 bg-cover bg-center shrink-0 border border-slate-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2PtVEad10c4J_EkwJM1WJ_uYtyc7TBDmYXRnsKuVjk76HzMImPw1TCwV6DVFl26wsuLCnstE1XqzK-ezgNh_25Wka-8V6FmxTG1ghHhmniuIoJ8MgaRUIBnHjjW282nXt51AKUWZCNSl9sBUL_dOsx-GoHdtWCo23yqqiepBtz2hF7DPyaIzTNGO4MkTjiK5_CaXhrAJNLR1_-vJqQZjVmHluRDtzdpeR2xiMIXceCl3qHpoDL_FhUqURfw0GB2JLaFw_d9hWXUQ')"}}></div>
            <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase mb-1">On This Day</span>
                <h3 className="font-bold text-slate-900 leading-snug">Arthur & Martha's 80th Anniversary</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">Today marks 80 years since they were married in Brooklyn at St. Jude's Chapel.</p>
            </div>
            </div>
        </div>

        {/* Research Tools Grid */}
        <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Research Tools</h2>
            <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => (
                <button
                key={tool.title}
                onClick={() => onNavigate(tool.screen)}
                className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 hover:shadow-md transition-all active:scale-[0.98] text-left"
                >
                <div className={`size-10 rounded-lg ${tool.color} flex items-center justify-center text-white shrink-0`}>
                    <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                </div>
                <div className="min-w-0">
                    <span className="block text-sm font-bold text-slate-800 truncate">{tool.title}</span>
                    <span className="block text-[10px] text-slate-400 truncate">{tool.subtitle}</span>
                </div>
                </button>
            ))}
            </div>
        </div>

        {/* Hints Section */}
        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hints & Tasks</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3 New</span>
            </div>
            <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined text-sm">description</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">1950 Census Record Found</p>
                        <p className="text-xs text-slate-500">Likely match for <span className="font-semibold">Sarah Miller</span></p>
                    </div>
                    <button className="text-primary font-bold text-xs bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10">Review</button>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <span className="material-symbols-outlined text-sm">lightbulb</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">Missing Mother</p>
                        <p className="text-xs text-slate-500">Add details for <span className="font-semibold">Robert Doe's</span> mother</p>
                    </div>
                    <button className="text-primary font-bold text-xs bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10">Add</button>
                </div>
            </div>
        </div>

      </main>

      <BottomNav current="Discover" onNavigate={onNavigate} />
    </div>
  );
};

export default DiscoverView;