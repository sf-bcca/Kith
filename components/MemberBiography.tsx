import React, { useMemo } from 'react';
import { FamilyService } from '../services/FamilyService';

interface Props {
  onNavigate: (screen: string) => void;
  memberId?: string;
}

const MemberBiography: React.FC<Props> = ({ onNavigate, memberId }) => {
  const member = useMemo(() => {
    return memberId ? FamilyService.getById(memberId) : null;
  }, [memberId]);

  if (!member) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light min-h-screen">
        <p className="text-slate-500">Member not found.</p>
      </div>
    );
  }

  const years = `${member.birthDate ? new Date(member.birthDate).getFullYear() : ''}–${member.deathDate ? new Date(member.deathDate).getFullYear() : 'Present'}`;

  return (
    <div className="bg-background-light font-display text-[#0d121b] antialiased overflow-x-hidden min-h-screen">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 flex items-center bg-background-light/80 backdrop-blur-md p-4 justify-between border-b border-gray-200">
        <button 
          onClick={() => onNavigate('Tree')}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[#0d121b]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-sm font-bold leading-tight tracking-tight flex-1 text-center truncate px-2">{member.firstName} {member.lastName} ({years})</h2>
        <div className="flex items-center justify-end">
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined text-[#0d121b]">ios_share</span>
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto min-h-screen pb-20">
        {/* Hero Section */}
        <section className="relative">
          <div 
            className="w-full h-64 bg-cover bg-center opacity-50" 
            style={{ 
              backgroundImage: `url(${member.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'})`,
              filter: "sepia(0.6) contrast(1.1) brightness(0.9)"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-light via-transparent to-transparent"></div>
          
          <div className="relative -mt-20 px-4 flex flex-col items-center">
            <div className="size-32 rounded-full border-4 border-background-light overflow-hidden shadow-xl">
              <img 
                alt={`${member.firstName} ${member.lastName}`} 
                className="w-full h-full object-cover" 
                style={{ filter: "sepia(0.2) contrast(1.05) brightness(1)" }}
                src={member.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
              />
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight">{member.firstName} {member.lastName}</h1>
              <p className="text-primary font-medium text-sm mt-1">{years}</p>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-sm">family_history</span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Family Member</span>
              </div>
            </div>
          </div>
        </section>

        {/* Life Events Timeline */}
        <section className="mt-8 px-4">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold tracking-tight">Life Events</h2>
            <button className="text-primary text-sm font-semibold hover:underline">View map</button>
          </div>
          
          <div className="grid grid-cols-[40px_1fr] gap-x-3 mt-2">
            {[
              { icon: 'child_care', title: `Born in ${member.birthPlace || 'Unknown'}`, date: member.birthDate || 'Unknown Date', isLast: !member.deathDate },
              ...(member.deathDate ? [{ icon: 'church', title: `Deceased in ${member.deathPlace || 'Unknown'}`, date: member.deathDate, isLast: true }] : []),
            ].map((event, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[22px]">{event.icon}</span>
                  </div>
                  {!event.isLast && <div className="w-[2px] bg-gray-200 h-full grow my-1"></div>}
                </div>
                <div className={`pt-1 ${!event.isLast ? 'pb-8' : ''}`}>
                  <p className="text-base font-bold leading-none">{event.title}</p>
                  <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{event.date}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Biography Summary */}
        <section className="mt-12 px-4 pb-20">
          <h2 className="text-xl font-bold tracking-tight mb-3">Biography</h2>
          <p className="text-gray-600 text-sm leading-relaxed italic">
              {member.biography || "No biography available for this family member yet."}
          </p>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <button className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Add Memory
          </button>
          <button className="size-[52px] bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-gray-700">edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberBiography;