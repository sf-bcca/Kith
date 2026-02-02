import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FamilyContextType {
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to user '00000000-0000-0000-0000-000000000001' (Arthur Pendragon)
  const [selectedMemberId, setSelectedMemberId] = useState<string>('00000000-0000-0000-0000-000000000001');

  return (
    <FamilyContext.Provider value={{ selectedMemberId, setSelectedMemberId }}>
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
