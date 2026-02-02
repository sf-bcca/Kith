import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types/family';
import { FamilyService } from '../services/FamilyService';

interface Props {
  member: FamilyMember;
}

const FamilyManagement: React.FC<Props> = ({ member }) => {
  const [familyDetails, setFamilyDetails] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamily = async () => {
      const allIds = [
        ...(member.parents || []),
        ...(member.spouses || []),
        ...(member.children || [])
      ];

      if (allIds.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const details = await Promise.all(
          allIds.map(id => FamilyService.getById(id))
        );
        setFamilyDetails(details.filter((d): d is FamilyMember => !!d));
      } catch (err) {
        console.error('Failed to fetch family details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [member]);

  const renderSection = (title: string, ids: string[], icon: string) => {
    if (!ids || ids.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">{icon}</span>
          {title}
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
          {ids.map(id => {
            const detail = familyDetails.find(d => d.id === id);
            return (
              <div key={id} className="p-4 flex items-center gap-4">
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                  {detail?.photoUrl ? (
                    <img src={detail.photoUrl} alt={detail.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400">person</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">
                    {detail ? `${detail.firstName} ${detail.lastName}` : 'Unknown Member'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Verified Family Member</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100">
                  Member
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="size-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-medium">Loading family details...</p>
      </div>
    );
  }

  const hasFamily = (member.parents?.length || 0) + (member.spouses?.length || 0) + (member.children?.length || 0) > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
      <header>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">groups</span>
          Family Management
        </h2>
        <p className="text-xs text-slate-400 mt-1">View and manage your family associations and roles.</p>
      </header>

      {!hasFamily ? (
        <div className="bg-slate-50 rounded-3xl p-12 border-2 border-dashed border-slate-200 text-center">
          <div className="size-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
            <span className="material-symbols-outlined text-4xl">family_restroom</span>
          </div>
          <h3 className="font-bold text-slate-900">No family associations found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Start building your tree to see your family members here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSection('Parents', member.parents || [], 'family_history')}
          {renderSection('Spouses', member.spouses || [], 'favorite')}
          {renderSection('Children', member.children || [], 'child_care')}
        </div>
      )}

      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-500">info</span>
          <div>
            <h4 className="text-sm font-bold text-blue-900">Member Roles</h4>
            <p className="text-xs text-blue-700 mt-0.5">Roles and permissions can be managed by the Family Head. Contact your administrator to request role changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyManagement;
