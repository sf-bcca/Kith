import React, { useState, useMemo } from 'react';
import BottomNav from './BottomNav';
import { TreeService } from '../services/TreeService';
import { FamilyMember } from '../types/family';

interface Props {
  onNavigate: (screen: string) => void;
}

const MemberNode: React.FC<{
  member: FamilyMember;
  label?: string;
  isFocus?: boolean;
  onClick: () => void;
}> = ({ member, label, isFocus, onClick }) => (
  <div 
    className="flex flex-col items-center gap-2 group cursor-pointer"
    onClick={onClick}
  >
    <div className={`
      ${isFocus ? 'w-24 h-24 border-4 border-primary shadow-xl' : 'w-20 h-20 border-2 border-slate-100 shadow-lg'}
      rounded-full bg-white p-1 relative group-hover:scale-105 transition-transform
    `}>
      <div 
        className="w-full h-full rounded-full bg-cover bg-center" 
        style={{ backgroundImage: `url(${member.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'})` }}
      ></div>
      {isFocus && (
        <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
          <span className="material-symbols-outlined text-xs">star</span>
        </div>
      )}
    </div>
    <div className="text-center">
      <p className={`${isFocus ? 'text-sm' : 'text-xs'} font-bold`}>{member.firstName} {member.lastName}</p>
      {label ? (
        <p className="text-[10px] uppercase tracking-wider font-semibold text-primary">{label}</p>
      ) : (
        <p className="text-[10px] text-slate-500">
          {member.birthDate ? new Date(member.birthDate).getFullYear() : ''} 
          {member.deathDate ? ` - ${new Date(member.deathDate).getFullYear()}` : ' - Present'}
        </p>
      )}
    </div>
  </div>
);

const FamilyTreeView: React.FC<Props> = ({ onNavigate }) => {
  const [focusId, setFocusId] = useState('7'); // Default to Merlin
  
  const treeData = useMemo(() => TreeService.getTreeFor(focusId), [focusId]);

  if (!treeData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light">
        <p className="text-slate-500">Member not found.</p>
      </div>
    );
  }

  const { focus, parents, spouses, children } = treeData;

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col overflow-hidden relative">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light p-4 pb-2 justify-between z-20 shadow-sm border-b border-slate-100">
        <div className="text-[#0d121b] flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-gray-100 rounded-full pl-2 transition-colors">
          <span className="material-symbols-outlined">search</span>
        </div>
        <h2 className="text-[#0d121b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Family Tree</h2>
        <div className="flex w-12 items-center justify-end">
          <button 
            onClick={() => onNavigate('Settings')}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-gray-100 text-[#0d121b] hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <main className="flex-1 relative overflow-auto bg-[#f8f9fc] flex items-center justify-center p-8 pb-32">
        {/* Connecting Lines SVG (Static for now, will refine in Phase 3) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
          <path d="M 50% 120 L 50% 200 M 20% 200 L 80% 200 M 20% 200 L 20% 280 M 80% 200 L 80% 280 M 50% 450 L 50% 530" fill="none" stroke="#cbd5e1" strokeWidth="2"></path>
        </svg>

        <div className="relative flex flex-col items-center gap-16 w-full max-w-4xl pt-10">
          {/* Gen 1: Parents */}
          <div className="flex gap-8 md:gap-24 relative z-10">
            {parents.map(parent => (
              <MemberNode 
                key={parent.id} 
                member={parent} 
                onClick={() => setFocusId(parent.id)} 
              />
            ))}
          </div>

          {/* Gen 2: Focus & Spouses */}
          <div className="flex gap-8 md:gap-32 relative z-10">
            <MemberNode 
              member={focus} 
              isFocus 
              label={focusId === '7' ? 'Me (User)' : undefined}
              onClick={() => {}} // Already focus
            />
            {spouses.map(spouse => (
              <MemberNode 
                key={spouse.id} 
                member={spouse} 
                onClick={() => setFocusId(spouse.id)} 
              />
            ))}
          </div>

          {/* Gen 3: Children */}
          <div className="flex gap-12 relative z-10">
            {children.map(child => (
              <MemberNode 
                key={child.id} 
                member={child} 
                onClick={() => setFocusId(child.id)} 
              />
            ))}
            {/* Add Child */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <button className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white group-hover:border-primary group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">add</span>
              </button>
              <div className="text-center">
                <p className="text-[11px] text-slate-400 italic group-hover:text-primary transition-colors">Add Child</p>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-10">
          <button className="p-2 bg-white shadow-lg rounded-lg text-slate-600 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">zoom_in</span>
          </button>
          <button className="p-2 bg-white shadow-lg rounded-lg text-slate-600 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">zoom_out</span>
          </button>
          <button className="p-2 bg-white shadow-lg rounded-lg text-primary hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-30">
        <button className="flex items-center justify-center rounded-full w-14 h-14 bg-primary text-white shadow-xl hover:scale-105 transition-transform hover:shadow-2xl hover:shadow-primary/30">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>

      <BottomNav current="Tree" onNavigate={onNavigate} />
    </div>
  );
};

export default FamilyTreeView;
