import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types/family';
import { FamilyService } from '../services/FamilyService';

export type SiblingType = 'full' | 'half' | 'step' | 'adopted';

export interface SiblingEntry {
  id?: string;
  firstName?: string;
  lastName?: string;
  siblingType: SiblingType;
  isNew: boolean;
}

interface Props {
  existingSiblings: string[];
  onUpdate: (siblings: string[], entries: SiblingEntry[]) => void;
  onCancel: () => void;
}

const SIBLING_TYPES: { value: SiblingType; label: string; description: string }[] = [
  { value: 'full', label: 'Full Sibling', description: 'Share both parents' },
  { value: 'half', label: 'Half Sibling', description: 'Share one parent' },
  { value: 'step', label: 'Step Sibling', description: 'Parents were married to different people' },
  { value: 'adopted', label: 'Adopted Sibling', description: 'Legally or socially adopted' },
];

export default function RelationshipWizard({ existingSiblings, onUpdate, onCancel }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);
  const [searching, setSearching] = useState(false);
  const [siblingEntries, setSiblingEntries] = useState<SiblingEntry[]>([]);
  const [selectedType, setSelectedType] = useState<SiblingType>('full');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  // Load existing siblings when modal opens
  useEffect(() => {
    if (existingSiblings.length > 0) {
      loadExistingSiblings();
    }
  }, [existingSiblings]);

  const loadExistingSiblings = async () => {
    try {
      const siblings = await FamilyService.getByIds(existingSiblings);
      const entries: SiblingEntry[] = siblings.map((s) => ({
        id: s.id,
        siblingType: 'full',
        isNew: false,
      }));
      setSiblingEntries(entries);
    } catch (error) {
      console.error('Failed to load existing siblings:', error);
    }
  };

  // Search for existing family members
  useEffect(() => {
    const searchMembers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        const results = await FamilyService.search(searchQuery);
        const addedIds = siblingEntries.filter((e) => e.id).map((e) => e.id);
        const filtered = results.filter((m) => !addedIds.includes(m.id));
        setSearchResults(filtered);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(searchMembers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, siblingEntries]);

  const addExistingSibling = (member: FamilyMember) => {
    const newEntry: SiblingEntry = {
      id: member.id,
      siblingType: selectedType,
      isNew: false,
    };
    const updatedEntries = [...siblingEntries, newEntry];
    setSiblingEntries(updatedEntries);
    setSearchQuery('');
    setSearchResults([]);
  };

  const addNewSibling = () => {
    if (!newFirstName.trim() || !newLastName.trim()) return;

    const newEntry: SiblingEntry = {
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      siblingType: selectedType,
      isNew: true,
    };
    const updatedEntries = [...siblingEntries, newEntry];
    setSiblingEntries(updatedEntries);
    setNewFirstName('');
    setNewLastName('');
  };

  const removeSibling = (index: number) => {
    const updatedEntries = siblingEntries.filter((_, i) => i !== index);
    setSiblingEntries(updatedEntries);
  };

  const updateSiblingType = (index: number, type: SiblingType) => {
    const updatedEntries = siblingEntries.map((entry, i) =>
      i === index ? { ...entry, siblingType: type } : entry
    );
    setSiblingEntries(updatedEntries);
  };

  const handleSave = () => {
    const siblingIds = siblingEntries.filter((e) => e.id).map((e) => e.id!);
    onUpdate(siblingIds, siblingEntries);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Sibling Relationships</h2>
            <button onClick={onCancel} className="p-2 hover:bg-white rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1">Add siblings by linking existing family members or creating placeholders.</p>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sibling Type</label>
            <div className="grid grid-cols-2 gap-2">
              {SIBLING_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedType === type.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 hover:border-primary/30'
                  }`}
                >
                  <span className="font-semibold text-sm">{type.label}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Link Existing Family Member</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="Search by name..."
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
            </div>

            {searching && (
              <div className="text-center py-4 text-slate-400 text-sm">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => addExistingSibling(member)}
                  >
                    <div className="size-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Born: {member.birthDate ? new Date(member.birthDate).getFullYear() : 'Unknown'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-sm">add</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Or Create New Placeholder</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="First name"
              />
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="Last name"
              />
              <button
                onClick={addNewSibling}
                disabled={!newFirstName.trim() || !newLastName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {siblingEntries.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Selected Siblings ({siblingEntries.length})
              </label>
              <div className="space-y-2">
                {siblingEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="size-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                      {entry.id ? (
                        <span className="material-symbols-outlined text-slate-400">person</span>
                      ) : (
                        <span className="material-symbols-outlined text-primary">person_add</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {entry.firstName} {entry.lastName}
                        {entry.id && <span className="text-slate-400 font-normal"> (Existing)</span>}
                      </p>
                      <select
                        value={entry.siblingType}
                        onChange={(e) => updateSiblingType(index, e.target.value as SiblingType)}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white mt-1"
                      >
                        {SIBLING_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeSibling(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            Save Siblings
          </button>
        </div>
      </div>
    </div>
  );
}
