import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { FamilyMember } from '../types/family';
import { FamilyService } from '../services/FamilyService';

interface SiblingContextType {
  siblings: FamilyMember[];
  isLoadingSiblings: boolean;
  loadSiblings: (memberId: string) => Promise<void>;
  addSibling: (memberId: string, siblingId: string) => Promise<void>;
  removeSibling: (memberId: string, siblingId: string) => Promise<void>;
  clearSiblings: () => void;
}

interface FamilyContextType extends SiblingContextType {
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to user '00000000-0000-0000-0000-000000000001' (Arthur Pendragon)
  const [selectedMemberId, setSelectedMemberId] = useState<string>('00000000-0000-0000-0000-000000000001');
  const [siblings, setSiblings] = useState<FamilyMember[]>([]);
  const [isLoadingSiblings, setIsLoadingSiblings] = useState(false);

  const loadSiblings = useCallback(async (memberId: string) => {
    setIsLoadingSiblings(true);
    try {
      const siblingList = await FamilyService.getSiblings(memberId);
      setSiblings(siblingList);
    } catch (error) {
      console.error('Failed to load siblings:', error);
      throw error;
    } finally {
      setIsLoadingSiblings(false);
    }
  }, []);

  const addSibling = useCallback(async (memberId: string, siblingId: string) => {
    await FamilyService.addSibling(memberId, siblingId);
    // Reload siblings to get updated list
    await loadSiblings(memberId);
  }, [loadSiblings]);

  const removeSibling = useCallback(async (memberId: string, siblingId: string) => {
    await FamilyService.removeSibling(memberId, siblingId);
    // Reload siblings to get updated list
    await loadSiblings(memberId);
  }, [loadSiblings]);

  const clearSiblings = useCallback(() => {
    setSiblings([]);
  }, []);

  return (
    <FamilyContext.Provider value={{ 
      selectedMemberId, 
      setSelectedMemberId,
      siblings,
      isLoadingSiblings,
      loadSiblings,
      addSibling,
      removeSibling,
      clearSiblings
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = (): FamilyContextType => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
