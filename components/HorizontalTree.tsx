import React, { useEffect, useState } from 'react';
import { TreeService, AncestryData, DescendantData } from '../services/TreeService';
import { FamilyMember } from '../types/family';
import { validateImageUrl } from '../src/utils/security';

interface Props {
  onNavigate: (screen: string, memberId?: string) => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

const Node: React.FC<{ 
  member?: FamilyMember; 
  role?: string; 
  isFocus?: boolean;
  onClick: () => void;
  onProfile: () => void;
}> = ({ member, role, isFocus, onClick, onProfile }) => {
  if (!member) return (
    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-dashed border-gray-200 w-64 h-[74px] justify-center">
      <p className="text-xs text-gray-400 italic">Unknown {role}</p>
    </div>
  );

  return (
    <div 
      className={`flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border ${isFocus ? 'border-2 border-primary' : 'border-gray-100'} w-64 z-10 group cursor-pointer hover:border-primary/50 transition-all`}
      onClick={onClick}
    >
      <div 
        className={`h-12 w-12 rounded-full bg-center bg-cover border-2 ${member.gender === 'female' ? 'border-pink-200' : 'border-primary/30'}`} 
        style={{backgroundImage: `url('${validateImageUrl(member.photoUrl)}')` || undefined}}
      >
        {!member.photoUrl && (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-full">
            <span className={`material-symbols-outlined text-lg ${member.gender === 'female' ? 'text-pink-400' : 'text-primary/50'}`}>person</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-bold text-[#0d121b] truncate">{member.firstName} {member.lastName}</p>
        <p className="text-[11px] text-primary font-medium">
          {member.birthDate ? new Date(member.birthDate).getFullYear() : '?'} — {member.deathDate ? new Date(member.deathDate).getFullYear() : 'Present'}
        </p>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onProfile(); }}
        className="bg-primary/5 text-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
      >
        <span className="material-symbols-outlined text-[16px]">visibility</span>
      </button>
    </div>
  );
};

const HorizontalTree: React.FC<Props> = ({ onNavigate, selectedId, onSelect }) => {
  const [ancestryData, setAncestryData] = useState<AncestryData | null>(null);
  const [descendantData, setDescendantData] = useState<DescendantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'ancestors' | 'descendants'>('ancestors');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (viewType === 'ancestors') {
          const ancestry = await TreeService.getAncestors(selectedId);
          setAncestryData(ancestry);
        } else {
          const descendants = await TreeService.getDescendants(selectedId);
          setDescendantData(descendants);
        }
      } catch (err) {
        console.error('Failed to fetch tree data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedId, viewType]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fc] min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 bg-primary/20 rounded-full mb-3"></div>
          <p className="text-slate-400 text-sm font-medium">Loading lineage...</p>
        </div>
      </div>
    );
  }

  if (viewType === 'ancestors' && !ancestryData) return null;
  if (viewType === 'descendants' && !descendantData) return null;

  return (
    <div className="bg-background-light font-display text-[#0d121b] antialiased overflow-hidden min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center bg-white/80 backdrop-blur-md p-4 border-b border-gray-200 justify-between">
        <div className="flex items-center gap-3">
           <div 
             onClick={() => onNavigate('Discover')}
             className="text-[#0d121b] cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
           >
              <span className="material-symbols-outlined">arrow_back</span>
           </div>
           <div>
              <h2 className="text-[#0d121b] text-lg font-bold leading-tight tracking-[-0.015em]">Horizontal Lineage</h2>
              <p className="text-xs text-gray-500">
                {viewType === 'ancestors' 
                  ? `${ancestryData?.focusPerson.firstName} ${ancestryData?.focusPerson.lastName}'s Ancestry`
                  : `${descendantData?.focusPerson.firstName} ${descendantData?.focusPerson.lastName}'s Descendants`
                }
              </p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
              <button 
                onClick={() => setViewType('ancestors')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewType === 'ancestors' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                Ancestors
              </button>
              <button 
                onClick={() => setViewType('descendants')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewType === 'descendants' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                Descendants
              </button>
           </div>
           <button 
            onClick={() => onNavigate('Directory')}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
           >
              <span className="material-symbols-outlined text-gray-600">search</span>
           </button>
           <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined">share</span>
           </button>
        </div>
      </div>

      <div className="fixed top-[73px] left-0 right-0 z-40 bg-white/50 backdrop-blur-sm border-b border-gray-100">
         <div className="flex gap-3 p-3 overflow-x-auto no-scrollbar">
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 border border-primary/20 pl-4 pr-3 hover:bg-primary/20 transition-colors">
               <p className="text-primary text-sm font-medium leading-normal">Full Lineage</p>
               <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 pl-4 pr-3 hover:bg-gray-50 transition-colors">
               <p className="text-[#0d121b] text-sm font-medium leading-normal">Paternal</p>
               <span className="material-symbols-outlined text-gray-400 text-[18px]">keyboard_arrow_down</span>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 pl-4 pr-3 hover:bg-gray-50 transition-colors">
               <p className="text-[#0d121b] text-sm font-medium leading-normal">Maternal</p>
               <span className="material-symbols-outlined text-gray-400 text-[18px]">keyboard_arrow_down</span>
            </button>
         </div>
      </div>

      <div className="relative w-full h-screen overflow-auto custom-scrollbar pt-32 bg-[#f8f9fc]">
         <div className="min-w-[1600px] h-[800px] p-20 relative">
            {viewType === 'ancestors' ? (
              <AncestorsView 
                data={ancestryData!} 
                onSelect={onSelect} 
                onNavigate={onNavigate} 
              />
            ) : (
              <DescendantsView 
                data={descendantData!} 
                onSelect={onSelect} 
                onNavigate={onNavigate} 
              />
            )}
         </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
         <div className="flex flex-col gap-2 bg-white p-1.5 rounded-2xl shadow-2xl border border-gray-100">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 transition-colors">
               <span className="material-symbols-outlined">add</span>
            </button>
            <div className="h-[1px] mx-2 bg-gray-100"></div>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 transition-colors">
               <span className="material-symbols-outlined">remove</span>
            </button>
            <div className="h-[1px] mx-2 bg-gray-100"></div>
            <button 
              onClick={() => onSelect(selectedId)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors"
            >
               <span className="material-symbols-outlined">center_focus_weak</span>
            </button>
         </div>
      </div>
    </div>
  );
};

const AncestorsView: React.FC<{ 
  data: AncestryData; 
  onSelect: (id: string) => void; 
  onNavigate: (screen: string, id: string) => void;
}> = ({ data, onSelect, onNavigate }) => {
  const { focusPerson, parents, grandparents, greatGrandparents, siblings } = data;

  const father = parents.find(p => p.gender === 'male');
  const mother = parents.find(p => p.gender === 'female');

  const paternalGF = grandparents.find(gp => father?.parents.includes(gp.id) && gp.gender === 'male');
  const paternalGM = grandparents.find(gp => father?.parents.includes(gp.id) && gp.gender === 'female');
  const maternalGF = grandparents.find(gp => mother?.parents.includes(gp.id) && gp.gender === 'male');
  const maternalGM = grandparents.find(gp => mother?.parents.includes(gp.id) && gp.gender === 'female');

  const getParentsOf = (personId?: string) => {
    if (!personId) return [undefined, undefined];
    const member = grandparents.concat(parents).find(m => m.id === personId);
    if (!member) return [undefined, undefined];
    const f = greatGrandparents.concat(grandparents).find(p => member.parents.includes(p.id) && p.gender === 'male');
    const m = greatGrandparents.concat(grandparents).find(p => member.parents.includes(p.id) && p.gender === 'female');
    return [f, m];
  };

  const [patGF_F, patGF_M] = getParentsOf(paternalGF?.id);
  const [patGM_F, patGM_M] = getParentsOf(paternalGM?.id);
  const [matGF_F, matGF_M] = getParentsOf(maternalGF?.id);
  const [matGM_F, matGM_M] = getParentsOf(maternalGM?.id);

  const ggps = [patGF_F, patGF_M, patGM_F, patGM_M, matGF_F, matGF_M, matGM_F, matGM_M];

  return (
    <div className="flex items-center gap-16 min-h-[600px] justify-center">
      <div className="flex flex-col gap-4">
        {ggps.map((ggp, i) => (
          <div key={i} className="relative">
            <Node 
              member={ggp} 
              role={i % 2 === 0 ? "Great Grandfather" : "Great Grandmother"} 
              onClick={() => ggp && onSelect(ggp.id)}
              onProfile={() => ggp && onNavigate('Biography', ggp.id)}
            />
            {ggp && <div className="absolute w-16 h-[1px] bg-gray-200 left-64 top-1/2 -z-10"></div>}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-28">
        {[paternalGF, paternalGM, maternalGF, maternalGM].map((gp, i) => (
          <div key={i} className="relative">
             <Node 
              member={gp} 
              role={i % 2 === 0 ? "Grandfather" : "Grandmother"} 
              onClick={() => gp && onSelect(gp.id)}
              onProfile={() => gp && onNavigate('Biography', gp.id)}
            />
            {gp && <div className="absolute w-16 h-[1px] bg-gray-200 -left-16 top-1/2 -z-10"></div>}
            {gp && <div className="absolute w-16 h-[1px] bg-gray-200 left-64 top-1/2 -z-10"></div>}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-64">
        {[father, mother].map((p, i) => (
          <div key={i} className="relative">
             <Node 
              member={p} 
              role={i === 0 ? "Father" : "Mother"} 
              onClick={() => p && onSelect(p.id)}
              onProfile={() => p && onNavigate('Biography', p.id)}
            />
            {p && <div className="absolute w-16 h-[1px] bg-gray-200 -left-16 top-1/2 -z-10"></div>}
            {p && <div className="absolute w-16 h-[1px] bg-gray-200 left-64 top-1/2 -z-10"></div>}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Node 
            member={focusPerson} 
            isFocus 
            onClick={() => {}}
            onProfile={() => onNavigate('Biography', focusPerson.id)}
          />
          <div className="absolute w-16 h-[1px] bg-primary/30 -left-16 top-1/2 -z-10"></div>
        </div>

        {siblings.map((sibling) => (
          <div key={sibling.id} className="relative opacity-80">
            <Node 
              member={sibling} 
              role="Sibling" 
              onClick={() => onSelect(sibling.id)}
              onProfile={() => onNavigate('Biography', sibling.id)}
            />
            <div className="absolute w-16 h-[1px] bg-gray-200 -left-16 top-1/2 -z-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DescendantsView: React.FC<{ 
  data: DescendantData; 
  onSelect: (id: string) => void; 
  onNavigate: (screen: string, id: string) => void;
}> = ({ data, onSelect, onNavigate }) => {
  const { focusPerson, children, grandchildren, greatGrandchildren, siblings } = data;

  return (
    <div className="flex items-center gap-16 min-h-[600px] justify-center">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Node 
            member={focusPerson} 
            isFocus 
            onClick={() => {}}
            onProfile={() => onNavigate('Biography', focusPerson.id)}
          />
          {children.length > 0 && <div className="absolute w-16 h-[1px] bg-primary/30 left-64 top-1/2 -z-10"></div>}
        </div>

        {siblings.map((sibling) => (
          <div key={sibling.id} className="relative opacity-80">
            <Node 
              member={sibling} 
              role="Sibling" 
              onClick={() => onSelect(sibling.id)}
              onProfile={() => onNavigate('Biography', sibling.id)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-32">
        {children.map((child, i) => (
          <div key={i} className="relative">
             <Node 
              member={child} 
              role="Child" 
              onClick={() => onSelect(child.id)}
              onProfile={() => onNavigate('Biography', child.id)}
            />
            <div className="absolute w-16 h-[1px] bg-gray-200 -left-16 top-1/2 -z-10"></div>
            {grandchildren.some(gc => child.children.includes(gc.id)) && (
              <div className="absolute w-16 h-[1px] bg-gray-200 left-64 top-1/2 -z-10"></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-16">
        {grandchildren.map((gc, i) => (
          <div key={i} className="relative">
             <Node 
              member={gc} 
              role="Grandchild" 
              onClick={() => onSelect(gc.id)}
              onProfile={() => onNavigate('Biography', gc.id)}
            />
            <div className="absolute w-16 h-[1px] bg-gray-200 -left-16 top-1/2 -z-10"></div>
            {greatGrandchildren.some(ggc => gc.children.includes(ggc.id)) && (
              <div className="absolute w-16 h-[1px] bg-gray-200 left-64 top-1/2 -z-10"></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {greatGrandchildren.map((ggc, i) => (
          <div key={i} className="relative">
             <Node 
              member={ggc} 
              role="Great Grandchild" 
              onClick={() => onSelect(ggc.id)}
              onProfile={() => onNavigate('Biography', ggc.id)}
            />
            <div className="absolute w-16 h-[1px] bg-gray-200 -left-16 top-1/2 -z-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalTree;
