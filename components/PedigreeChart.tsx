import React, { useEffect, useState } from 'react';
import { TreeService, AncestryData } from '../services/TreeService';
import { FamilyMember } from '../types/family';
import { formatDate } from '../src/utils/dateUtils';

interface Props {
  onNavigate: (screen: string) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  loggedInId?: string;
}

const PedigreeChart: React.FC<Props> = ({ onNavigate, selectedId, onSelect, loggedInId }) => {
  const [treeData, setTreeData] = useState<AncestryData | null>(null);

  useEffect(() => {
    const fetchAncestors = async () => {
      try {
        const data = await TreeService.getAncestors(selectedId);
        setTreeData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAncestors();
  }, [selectedId]);

  if (!treeData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const { focusPerson, parents, grandparents, greatGrandparents } = treeData;

  const father = parents.find(p => p.gender === 'male');
  const mother = parents.find(p => p.gender === 'female');

  // Helper to safely get grandparents
  const paternalGF = grandparents.find(gp => father?.parents.includes(gp.id) && gp.gender === 'male');
  const paternalGM = grandparents.find(gp => father?.parents.includes(gp.id) && gp.gender === 'female');
  const maternalGF = grandparents.find(gp => mother?.parents.includes(gp.id) && gp.gender === 'male');
  const maternalGM = grandparents.find(gp => mother?.parents.includes(gp.id) && gp.gender === 'female');

  // Helper for Great Grandparents
  const getParentsOf = (person: FamilyMember | undefined) => {
      if (!person) return [undefined, undefined];
      const f = greatGrandparents.find(p => person.parents.includes(p.id) && p.gender === 'male');
      const m = greatGrandparents.find(p => person.parents.includes(p.id) && p.gender === 'female');
      return [f, m];
  };

  const [patGF_F, patGF_M] = getParentsOf(paternalGF);
  const [patGM_F, patGM_M] = getParentsOf(paternalGM);
  const [matGF_F, matGF_M] = getParentsOf(maternalGF);
  const [matGM_F, matGM_M] = getParentsOf(maternalGM);

  const ggpList = [patGF_F, patGF_M, patGM_F, patGM_M, matGF_F, matGF_M, matGM_F, matGM_M];

  const renderGreatGrandparents = () => {
    return (
        <div className="flex gap-2">
            <div className="grid grid-cols-8 gap-1">
                {ggpList.map((ggp, i) => {
                    return (
                        <div key={i} className="flex flex-col items-center">
                            {ggp ? (
                                <div
                                    className="size-12 rounded bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onSelect(ggp.id)}
                                    title={`${ggp.firstName} ${ggp.lastName}`}
                                >
                                    <span className="material-symbols-outlined text-slate-600">person</span>
                                </div>
                            ) : (
                                <div className="size-12 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200">
                                    <span className="material-symbols-outlined text-slate-400 text-sm">add</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
  };

  const renderPersonCard = (person: FamilyMember | undefined, role: string, showPhoto: boolean = true) => {
    if (!person) return (
       <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl shadow-sm border border-slate-100 border-dashed w-56 h-16 justify-center">
            <span className="text-xs text-slate-400">Unknown {role}</span>
       </div>
    );

    return (
        <div
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-md border border-slate-100 w-56 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onSelect(person.id)}
        >
            <div className={`size-${showPhoto ? '10' : '8'} rounded-full overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center`}>
              {person.photoUrl ? (
                <img alt={person.firstName} className="w-full h-full object-cover" src={person.photoUrl} />
              ) : (
                <span className={`material-symbols-outlined text-xs ${person.gender === 'female' ? 'text-pink-500' : 'text-primary'}`}>person</span>
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">{person.firstName} {person.lastName}</span>
                <span className="text-[10px] text-slate-500">
                    {formatDate(person.birthDate)} - {person.deathDate ? formatDate(person.deathDate) : 'Present'}
                </span>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col overflow-hidden">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200">
        <button 
          onClick={() => onNavigate('Discover')}
          className="flex items-center justify-center p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Pedigree Chart</h1>
        <div className="flex gap-2">
          <button className="flex items-center justify-center p-2 hover:bg-slate-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      {/* Tree Area */}
      <main className="flex-1 overflow-auto relative p-6 pb-32 flex flex-col items-center justify-end">
        <div className="flex flex-col-reverse items-center min-w-max mx-auto space-y-reverse space-y-8">
          {/* Level 0: Focus Person */}
          <div className="flex flex-col items-center z-10">
            <div className="relative group cursor-pointer hover:scale-105 transition-transform">
              {/* Connector up */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-primary"></div>

              <div
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-lg border-2 border-primary w-64"
                onClick={() => { /* Already selected */ }}
              >
                <div className="size-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                  {focusPerson.photoUrl ? (
                    <img alt="User" className="w-full h-full object-cover" src={focusPerson.photoUrl} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{focusPerson.firstName} {focusPerson.lastName}</span>
                  <span className="text-xs text-slate-500">{formatDate(focusPerson.birthDate)} - {focusPerson.deathDate ? formatDate(focusPerson.deathDate) : 'Present'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 1: Parents */}
          <div className="relative flex flex-col items-center">
            {/* Horizontal Connector */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-[320px] h-0.5 bg-slate-200 -z-10"></div>
            
            <div className="flex gap-16">
               {/* Father */}
               <div className="flex flex-col items-center relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-primary"></div>
                  {renderPersonCard(father, 'Father')}
               </div>

               {/* Mother */}
               <div className="flex flex-col items-center relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  {renderPersonCard(mother, 'Mother')}
               </div>
            </div>
          </div>

          {/* Level 2: Grandparents */}
          <div className="relative flex flex-col items-center">
            <div className="flex gap-4">
              {/* Paternal Side */}
              <div className="flex flex-col items-center relative">
                 <div className="absolute top-1/2 -translate-y-1/2 w-[240px] left-[5%] h-0.5 bg-slate-200 -z-10"></div>
                 <div className="flex gap-4">
                    {/* GP 1 */}
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                      {/* Using slightly smaller card logic for GPs inside renderPersonCard if needed, but keeping same for now or adjusting styles inline */}
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44 cursor-pointer hover:scale-105 transition-transform" onClick={() => paternalGF && onSelect(paternalGF.id)}>
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                           <span className="material-symbols-outlined text-xs text-primary">person</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                           <span className="text-xs font-semibold truncate">{paternalGF ? `${paternalGF.firstName} ${paternalGF.lastName}` : 'Unknown'}</span>
                           <span className="text-[9px] text-slate-500">{paternalGF ? `${formatDate(paternalGF.birthDate)} - ${paternalGF.deathDate ? formatDate(paternalGF.deathDate) : ''}` : ''}</span>
                        </div>
                      </div>
                    </div>
                    {/* GP 2 */}
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44 cursor-pointer hover:scale-105 transition-transform" onClick={() => paternalGM && onSelect(paternalGM.id)}>
                        <div className="size-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                           <span className="material-symbols-outlined text-xs text-pink-500">person</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                           <span className="text-xs font-semibold truncate">{paternalGM ? `${paternalGM.firstName} ${paternalGM.lastName}` : 'Unknown'}</span>
                           <span className="text-[9px] text-slate-500">{paternalGM ? `${formatDate(paternalGM.birthDate)} - ${paternalGM.deathDate ? formatDate(paternalGM.deathDate) : ''}` : ''}</span>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

               {/* Maternal Side */}
               <div className="flex flex-col items-center relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-[240px] right-[5%] h-0.5 bg-slate-200 -z-10"></div>
                  <div className="flex gap-4">
                     {/* GP 3 */}
                     <div className="relative">
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                       <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44 cursor-pointer hover:scale-105 transition-transform" onClick={() => maternalGF && onSelect(maternalGF.id)}>
                         <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-xs text-primary">person</span>
                         </div>
                         <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-semibold truncate">{maternalGF ? `${maternalGF.firstName} ${maternalGF.lastName}` : 'Unknown'}</span>
                            <span className="text-[9px] text-slate-500">{maternalGF ? `${formatDate(maternalGF.birthDate)} - ${maternalGF.deathDate ? formatDate(maternalGF.deathDate) : ''}` : ''}</span>
                         </div>
                       </div>
                     </div>
                     {/* GP 4 */}
                     <div className="relative">
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                       <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44 cursor-pointer hover:scale-105 transition-transform" onClick={() => maternalGM && onSelect(maternalGM.id)}>
                         <div className="size-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-xs text-pink-500">person</span>
                         </div>
                         <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-semibold truncate">{maternalGM ? `${maternalGM.firstName} ${maternalGM.lastName}` : 'Unknown'}</span>
                            <span className="text-[9px] text-slate-500">{maternalGM ? `${formatDate(maternalGM.birthDate)} - ${maternalGM.deathDate ? formatDate(maternalGM.deathDate) : ''}` : ''}</span>
                         </div>
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Level 3: Great Grandparents */}
          {renderGreatGrandparents()}

        </div>
      </main>

      {/* Zoom Controls */}
      <div className="fixed right-4 bottom-28 flex flex-col gap-2 z-10">
        <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200 hover:bg-gray-50 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-slate-600">add</span>
        </button>
        <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200 hover:bg-gray-50 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-slate-600">remove</span>
        </button>
      </div>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 inset-x-0 p-4 bg-white/60 backdrop-blur-xl border-t border-slate-200 pb-8 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold transition-transform active:scale-95 hover:bg-slate-200">
            <span className="material-symbols-outlined">tune</span>
            Filter
          </button>
          <button
             className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 transition-transform active:scale-95 hover:bg-blue-600 disabled:opacity-50"
             onClick={() => loggedInId && onSelect(loggedInId)}
             disabled={!loggedInId}
          >
            <span className="material-symbols-outlined">my_location</span>
            Focus
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PedigreeChart;