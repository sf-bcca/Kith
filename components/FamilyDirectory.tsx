import React, { useState, useMemo, useEffect } from 'react';
import BottomNav from './BottomNav';
import DirectorySearch from './DirectorySearch';
import { FamilyService } from '../services/FamilyService';
import { FamilyMember } from '../types/family';

interface Props {
  onNavigate: (screen: string, memberId?: string) => void;
}

const FamilyDirectory: React.FC<Props> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const results = await FamilyService.search(searchQuery);
        setMembers(results);
      } catch (err) {
        console.error('Failed to search members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [searchQuery]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  // Group members by the first letter of their first name (since the search matches first/last)
  // For the directory, usually it's by first name or last name. 
  // The existing UI showed "A" then "Arthur J. Sterling", "Alice Montgomery", then "B" "Benjamin Sterling".
  // So it's by first name.
  const groupedMembers = useMemo(() => {
    const groups: Record<string, FamilyMember[]> = {};
    members.forEach(member => {
      const firstLetter = member.firstName[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(member);
    });
    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key].sort((a, b) => a.firstName.localeCompare(b.firstName));
      return acc;
    }, {} as Record<string, FamilyMember[]>);
  }, [members]);

  return (
    <div className="bg-background-light font-display text-slate-900 antialiased min-h-screen flex flex-col">
      <DirectorySearch onSearch={setSearchQuery} onBack={() => onNavigate('Discover')} />

      {/* Alphabet Sidebar */}
      <div className="fixed right-1 top-40 z-40 flex flex-col gap-0.5 text-[10px] font-bold text-primary px-1 py-4 h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
         {alphabet.map(letter => (
           <span key={letter} className="cursor-pointer hover:scale-125 transition-transform">{letter}</span>
         ))}
      </div>

      {/* Content */}
      <main className="pb-20 flex-1">
        {Object.entries(groupedMembers).map(([letter, group]) => (
          <React.Fragment key={letter}>
            <div className="sticky top-[156px] z-30 bg-background-light px-4 py-1">
               <h3 className="text-primary text-sm font-bold">{letter}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {group.map(member => (
                <div 
                  key={member.id} 
                  onClick={() => onNavigate('Biography', member.id)}
                  className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                     <div 
                       className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border border-slate-200 group-hover:border-primary transition-colors" 
                       style={{backgroundImage: `url(${member.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'})`}}
                     ></div>
                     <div className="flex flex-col">
                        <p className="text-slate-900 text-sm font-semibold leading-snug">{member.firstName} {member.lastName}</p>
                        <p className="text-slate-500 text-xs font-normal">
                          {member.birthDate ? new Date(member.birthDate).getFullYear() : ''}
                          –
                          {member.deathDate ? new Date(member.deathDate).getFullYear() : 'Present'}
                        </p>
                     </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                     <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Family</span>
                     <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 text-[18px]">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
        
        {members.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No family members found matching "{searchQuery}"
          </div>
        )}
      </main>

      <BottomNav current="Discover" onNavigate={onNavigate} />
    </div>
  );
};

export default FamilyDirectory;
