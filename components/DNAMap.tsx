import React, { useState, useEffect } from 'react';
import { FamilyService } from '../services/FamilyService';
import { LocationService, LocationPoint, MigrationPath } from '../services/LocationService';
import { FamilyMember } from '../types/family';
import BottomNav from './BottomNav';
import WorldMap from './WorldMap';

interface Props {
  onNavigate: (screen: string) => void;
}

const DNAMap: React.FC<Props> = ({ onNavigate }) => {
  const [origins, setOrigins] = useState<LocationPoint[]>([]);
  const [migrations, setMigrations] = useState<MigrationPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [originPoints, migrationPaths] = await Promise.all([
          LocationService.getAllOrigins(),
          LocationService.getMigrationPaths()
        ]);
        setOrigins(originPoints);
        setMigrations(migrationPaths);
      } catch (err) {
        console.error('Failed to fetch DNA Map data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const project = (lat: number, lng: number) => {
    const width = 800;
    const height = 400;
    const x = (lng + 180) * (width / 360);
    const y = (90 - lat) * (height / 180);
    return { x, y };
  };

  const points = origins.map(p => ({
    ...project(p.coords.lat, p.coords.lng),
    label: p.name,
    id: p.memberId,
    color: '#ec4899'
  }));

  const paths = migrations.map((m, i) => ({
    from: project(m.from.coords.lat, m.from.coords.lng),
    to: project(m.to.coords.lat, m.to.coords.lng),
    id: `path-${i}`,
    color: '#f472b6'
  }));

  const handlePointClick = async (memberId: string) => {
    const member = await FamilyService.getById(memberId);
    setSelectedMember(member);
  };

  return (
    <div className="bg-[#f8fafc] font-display text-slate-900 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('Discover')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">DNA Map</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-32">
        <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Origins & Migrations</h2>
            <p className="text-slate-500 text-sm">Tracing your family's journey across the world.</p>
        </div>

        {loading ? (
            <div className="w-full aspect-[2/1] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Geographic Data...</span>
            </div>
        ) : (
            <WorldMap 
              points={points} 
              paths={paths} 
              onPointClick={handlePointClick}
            />
        )}

        {/* Selected Member Detail */}
        {selectedMember && (
            <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4">
                    <div 
                        className="size-12 rounded-full bg-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: selectedMember.photoUrl ? `url(${selectedMember.photoUrl})` : undefined }}
                    >
                        {!selectedMember.photoUrl && <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-slate-400">person</span></div>}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{selectedMember.firstName} {selectedMember.lastName}</h3>
                        <p className="text-xs text-slate-500">Born in <span className="font-semibold text-slate-700">{selectedMember.birthPlace}</span></p>
                    </div>
                    <button 
                        onClick={() => onNavigate('Biography')}
                        className="text-primary font-bold text-xs bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                        View Profile
                    </button>
                </div>
            </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined">analytics</span>
                </div>
                <h4 className="font-bold text-sm mb-1">Top Region</h4>
                <p className="text-xl font-black text-slate-900">Europe</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">60% of Origins</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="size-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined">trending_up</span>
                </div>
                <h4 className="font-bold text-sm mb-1">Migrations</h4>
                <p className="text-xl font-black text-slate-900">{migrations.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Across Generations</p>
            </div>
        </div>
      </main>

      <BottomNav current="Discover" onNavigate={onNavigate} />
    </div>
  );
};

export default DNAMap;