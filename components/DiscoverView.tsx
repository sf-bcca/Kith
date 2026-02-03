import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { DiscoverService, DiscoverySummary } from '../services/DiscoverService';

interface Props {
  onNavigate: (screen: string, memberId?: string) => void;
}

const DiscoverView: React.FC<Props> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<DiscoverySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DiscoverService.getSummary();
      setSummary(data);
    } catch (err) {
      setError('Unable to load discovery data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const tools = [
    { title: 'Directory', subtitle: 'Browse all relatives', icon: 'group', screen: 'Directory', color: 'bg-blue-500' },
    { title: 'Pedigree', subtitle: 'Vertical lineage', icon: 'account_tree', screen: 'Pedigree', color: 'bg-emerald-500' },
    { title: 'Fan Chart', subtitle: 'Circular view', icon: 'blur_on', screen: 'Fan Chart', color: 'bg-purple-500' },
    { title: 'Horizontal', subtitle: 'Wide family view', icon: 'linear_scale', screen: 'Horizontal Tree', color: 'bg-orange-500' },
    { title: 'Admin', subtitle: 'Manage content', icon: 'dashboard', screen: 'Admin', color: 'bg-slate-700' },
    { title: 'DNA Map', subtitle: 'Origins & migrations', icon: 'public', screen: 'DNA Map', color: 'bg-pink-500' },
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
            </div>
            
            {loading ? (
              <div className="animate-pulse bg-white rounded-2xl p-4 h-24 border border-slate-100"></div>
            ) : error ? (
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
                <button
                  onClick={fetchSummary}
                  className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-100 px-3 py-1.5 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : summary?.onThisDay && summary.onThisDay.length > 0 ? (
              <div className="space-y-3">
                {summary.onThisDay.map((event) => {
                  const isBirthday = !event.death_date;
                  return (
                    <div 
                      key={event.id}
                      onClick={() => onNavigate('Biography', event.id)}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="size-20 rounded-xl bg-slate-200 bg-cover bg-center shrink-0 border border-slate-100" style={{backgroundImage: `url('${event.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}')`}}></div>
                      <div>
                          <span className={`inline-block px-2 py-0.5 rounded-full ${isBirthday ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'} text-[10px] font-bold uppercase mb-1`}>
                            {isBirthday ? 'Birthday Today' : 'Death Anniversary'}
                          </span>
                          <h3 className="font-bold text-slate-900 leading-snug">{event.first_name} {event.last_name}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {isBirthday ? `Celebrating another year of ${event.first_name}'s legacy.` : `Remembering ${event.first_name} on this day.`}
                          </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-medium">No family milestones today.</p>
              </div>
            )}
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
                {!loading && summary?.hints && summary.hints.length > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{summary.hints.length} New</span>
                )}
            </div>
            
            <div className="space-y-3">
                {loading ? (
                  <>
                    <div className="animate-pulse bg-white rounded-xl h-16 border border-slate-100"></div>
                    <div className="animate-pulse bg-white rounded-xl h-16 border border-slate-100"></div>
                  </>
                ) : summary?.hints && summary.hints.length > 0 ? (
                  summary.hints.map((hint, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                        <div className={`size-8 rounded-full ${hint.subtype === 'photo' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-sm">
                              {hint.subtype === 'photo' ? 'photo_camera' : 'description'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{hint.message}</p>
                            <p className="text-xs text-slate-500">{hint.name}</p>
                        </div>
                        <button 
                          onClick={() => onNavigate('Biography', hint.memberId)}
                          className="text-primary font-bold text-xs bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10"
                        >
                          Resolve
                        </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs font-medium">All data looks great! No hints at the moment.</p>
                  </div>
                )}
            </div>
        </div>

      </main>

      <BottomNav current="Discover" onNavigate={onNavigate} />
    </div>
  );
};

export default DiscoverView;
