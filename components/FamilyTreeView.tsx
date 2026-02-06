import React, { useState, useMemo, useEffect } from 'react';
import BottomNav from './BottomNav';
import { TreeService } from '../services/TreeService';
import { FamilyMember } from '../types/family';
import AddMemberModal from './AddMemberModal';
import { validateImageUrl } from '../src/utils/security';

interface Props {
  onNavigate: (screen: string, memberId?: string, params?: any) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  onLogout?: () => void;
}

const MemberNode: React.FC<{
  member: FamilyMember;
  label?: string;
  isFocus?: boolean;
  isSibling?: boolean;
  siblingType?: 'full' | 'half' | 'step' | 'adopted';
  onClick: () => void;
  onViewBio: (id: string, params?: any) => void;
}> = ({ member, label, isFocus, isSibling, siblingType, onClick, onViewBio }) => (
  <div className="flex flex-col items-center gap-2 group">
    <div 
      className={`
        ${isFocus ? 'w-24 h-24 border-4 border-primary shadow-xl' : isSibling ? 'w-16 h-16 border-2 border-primary/30 shadow-md' : 'w-20 h-20 border-2 border-slate-100 shadow-lg'}
        rounded-full bg-white p-1 relative group-hover:scale-105 transition-transform cursor-pointer
      `}
      onClick={onClick}
    >
      <div 
        className="w-full h-full rounded-full bg-cover bg-center" 
        style={{ backgroundImage: `url(${validateImageUrl(member.photoUrl)})` }}
      ></div>
      
      {/* Edit Button Overlay */}
      <div 
        className="absolute -top-1 -right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onViewBio(member.id, { edit: true });
        }}
      >
        <button className="bg-white text-slate-700 hover:text-primary rounded-full p-1 border border-slate-200 shadow-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
        </button>
      </div>

      {isFocus && (
        <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
          <span className="material-symbols-outlined text-xs">star</span>
        </div>
      )}
      {isSibling && siblingType && (
        <div className={`absolute -bottom-1 -right-1 rounded-full p-0.5 border-2 border-white flex items-center justify-center ${
          siblingType === 'full' ? 'bg-green-500' : 
          siblingType === 'half' ? 'bg-yellow-500' : 
          siblingType === 'step' ? 'bg-orange-500' : 'bg-purple-500'
        }`}>
          <span className="material-symbols-outlined text-[8px] text-white">
            {siblingType === 'full' ? 'family_restroom' : 
             siblingType === 'half' ? 'half' : 
             siblingType === 'step' ? 'swap_horiz' : 'child_care'}
          </span>
        </div>
      )}
    </div>
    <div className="text-center">
      <button 
        className={`${isFocus ? 'text-sm' : 'text-xs'} font-bold hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0`}
        onClick={() => onViewBio(member.id)}
      >
        {member.firstName} {member.lastName}
      </button>
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

const FamilyTreeView: React.FC<Props> = ({ onNavigate, selectedId, onSelect, onLogout }) => {
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addRelationshipType, setAddRelationshipType] = useState<'child' | 'parent' | 'spouse' | undefined>(undefined);

  const fetchTreeAndSetLoading = async (id: string) => {
    console.log(`DEBUG: fetchTreeAndSetLoading called with id: ${id}`);
    if (!id) {
      console.log('DEBUG: id is empty, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      const data = await TreeService.getTreeFor(id);
      console.log(`DEBUG: TreeService.getTreeFor result for ${id}:`, data ? 'Found' : 'Not Found');
      setTreeData(data || null);
    } catch (err) {
      console.error('DEBUG: Failed to fetch tree data:', err);
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTreeAndSetLoading(selectedId);
  }, [selectedId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 bg-primary/20 rounded-full mb-3"></div>
          <p className="text-slate-400 text-sm font-medium">Loading tree...</p>
        </div>
      </div>
    );
  }

  console.log(`DEBUG: Rendering FamilyTreeView. selectedId: ${selectedId}, treeData: ${treeData ? 'Present' : 'Null'}`);
  if (!treeData || !selectedId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background-light min-h-screen p-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <span className="material-symbols-outlined text-3xl">person_off</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Member not found</h3>
        <p className="text-slate-500 max-w-xs mb-6">We couldn't find the family member you're looking for.</p>
        <button 
          onClick={() => {
            setAddRelationshipType(undefined);
            setIsAddModalOpen(true);
          }}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Add New Member
        </button>
      </div>
    );
  }

  const { focus, parents, spouses, children, siblings } = treeData;

  const handleViewBio = (id: string, params?: any) => {
    // Find member in the tree data to pass along
    const member = 
      (treeData.focus.id === id ? treeData.focus : null) ||
      treeData.parents.find((m: FamilyMember) => m.id === id) ||
      treeData.spouses.find((m: FamilyMember) => m.id === id) ||
      treeData.children.find((m: FamilyMember) => m.id === id) ||
      treeData.siblings.find((m: FamilyMember) => m.id === id);

    onNavigate('Biography', id, { ...params, memberData: member });
  };

  const handleAddSuccess = (newMember: FamilyMember) => {
    fetchTreeAndSetLoading(selectedId); // Refresh the current view
    if (!addRelationshipType) {
      onSelect(newMember.id); // If adding a standalone member, focus them
    }
  };

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col overflow-hidden relative">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light p-4 pb-2 justify-between z-20 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
            <div className="text-[#0d121b] flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-gray-100 rounded-full pl-2 transition-colors">
            <span className="material-symbols-outlined">search</span>
            </div>
            {onLogout && (
            <button 
                onClick={onLogout}
                className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors text-slate-500"
                title="Sign Out"
            >
                <span className="material-symbols-outlined">logout</span>
            </button>
            )}
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <img src="/logo.png" alt="Kith" className="w-8 h-8 object-contain" />
          <h2 className="text-[#0d121b] text-lg font-bold leading-tight tracking-[-0.015em]">Kith</h2>
        </div>
        <div className="flex w-12 items-center justify-end">
          <button 
            onClick={() => onNavigate('Biography', selectedId)}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-gray-100 text-[#0d121b] hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <main className="flex-1 relative overflow-auto bg-[#f8f9fc] flex items-center justify-center p-8 pb-32">
        {/* Connecting Lines SVG */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40" 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="none"
        >
          {/* Line from Parents to Focus */}
          {parents.length > 0 && (
            <path d="M 500 120 L 500 220" fill="none" stroke="#94a3b8" strokeWidth="2" />
          )}
          
          {/* Line from Focus to Children */}
          {children.length > 0 && (
            <>
              <path d="M 500 380 L 500 460" fill="none" stroke="#94a3b8" strokeWidth="2" />
              {/* Horizontal bar for multiple children */}
              {children.length > 1 && (
                <path d="M 250 460 L 750 460" fill="none" stroke="#94a3b8" strokeWidth="2" />
              )}
            </>
          )}

          {/* Sibling connecting lines */}
          {siblings.length > 0 && (
            <>
              {/* Vertical line from parents area to sibling level */}
              <path d="M 500 220 L 500 280" fill="none" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Horizontal bracket for siblings (including focus member implicitly) */}
              <path d="M 300 280 L 700 280" fill="none" stroke="#94a3b8" strokeWidth="2" />
            </>
          )}
        </svg>

        <div className="relative flex flex-col items-center gap-16 w-full max-w-4xl pt-10">
          {/* Gen 1: Parents */}
          <div className="flex gap-8 md:gap-24 relative z-10">
            {parents.map(parent => (
              <MemberNode 
                key={parent.id} 
                member={parent} 
                onClick={() => onSelect(parent.id)} 
                onViewBio={handleViewBio}
              />
            ))}
            {/* Add Parent */}
            {parents.length < 2 && (
              <div 
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => {
                  setAddRelationshipType('parent');
                  setIsAddModalOpen(true);
                }}
              >
                <button className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white group-hover:border-primary group-hover:text-primary transition-colors shadow-sm">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <div className="text-center">
                  <p className="text-[11px] text-slate-400 italic group-hover:text-primary transition-colors">Add Parent</p>
                </div>
              </div>
            )}
          </div>

          {/* Gen 2: Siblings */}
          {siblings.length > 0 && (
            <div className="flex gap-6 relative z-10">
              {siblings.map(sibling => (
                <MemberNode 
                  key={sibling.id} 
                  member={sibling}
                  isSibling
                  siblingType={TreeService.getSiblingType(focus, sibling)}
                  onClick={() => onSelect(sibling.id)} 
                  onViewBio={handleViewBio}
                />
              ))}
            </div>
          )}

          {/* Gen 3: Focus & Spouses */}
          <div className="flex gap-8 md:gap-32 relative z-10">
            <MemberNode 
              member={focus} 
              isFocus 
              onClick={() => {}} // Already focus
              onViewBio={handleViewBio}
            />
            {spouses.map(spouse => (
              <MemberNode 
                key={spouse.id} 
                member={spouse} 
                onClick={() => onSelect(spouse.id)} 
                onViewBio={handleViewBio}
              />
            ))}
            {/* Add Spouse */}
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => {
                setAddRelationshipType('spouse');
                setIsAddModalOpen(true);
              }}
            >
              <button className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white group-hover:border-primary group-hover:text-primary transition-colors shadow-sm">
                <span className="material-symbols-outlined">add</span>
              </button>
              <div className="text-center">
                <p className="text-[11px] text-slate-400 italic group-hover:text-primary transition-colors">Add Spouse</p>
              </div>
            </div>
          </div>

          {/* Gen 3: Children */}
          <div className="flex gap-12 relative z-10">
            {children.map(child => (
              <MemberNode 
                key={child.id} 
                member={child} 
                onClick={() => onSelect(child.id)} 
                onViewBio={handleViewBio}
              />
            ))}
            {/* Add Child */}
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => {
                setAddRelationshipType('child');
                setIsAddModalOpen(true);
              }}
            >
              <button className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white group-hover:border-primary group-hover:text-primary transition-colors shadow-sm">
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
        <button 
          onClick={() => {
            setAddRelationshipType(undefined);
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center rounded-full w-14 h-14 bg-primary text-white shadow-xl hover:scale-105 transition-transform hover:shadow-2xl hover:shadow-primary/30"
        >
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>

      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={handleAddSuccess}
        relationshipType={addRelationshipType}
        relativeId={selectedId}
        initialData={{ lastName: focus?.lastName }}
      />

      <BottomNav current="Tree" onNavigate={onNavigate} />
    </div>
  );
};

export default FamilyTreeView;