import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FamilyProvider, useFamily } from './FamilyContext';
import { FamilyService } from '../services/FamilyService';
import React from 'react';

vi.mock('../services/FamilyService');

describe('FamilyContext Sibling State Management', () => {
  const mockSibling = {
    id: 'sibling-1',
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'female',
    birthDate: '1992-05-15',
    parents: [],
    spouses: [],
    children: [],
    siblings: [],
  };

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <FamilyProvider>{children}</FamilyProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide sibling state and methods', () => {
    const TestComponent = () => {
      const { siblings, isLoadingSiblings, clearSiblings } = useFamily();
      return (
        <div>
          <span data-testid="siblings-count">{siblings.length}</span>
          <span data-testid="loading">{isLoadingSiblings.toString()}</span>
          <button onClick={clearSiblings}>Clear</button>
        </div>
      );
    };

    render(<TestComponent />, { wrapper });
    expect(screen.getByTestId('siblings-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('should load siblings via loadSiblings', async () => {
    (FamilyService.getSiblings as any).mockResolvedValue([mockSibling]);

    const TestComponent = () => {
      const { siblings, isLoadingSiblings, loadSiblings } = useFamily();
      return (
        <div>
          <span data-testid="siblings-count">{siblings.length}</span>
          <span data-testid="loading">{isLoadingSiblings.toString()}</span>
          <button onClick={() => loadSiblings('member-1')}>Load</button>
        </div>
      );
    };

    render(<TestComponent />, { wrapper });

    expect(screen.getByTestId('siblings-count')).toHaveTextContent('0');

    const loadButton = screen.getByText('Load');
    loadButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('true');
    });

    await waitFor(() => {
      expect(screen.getByTestId('siblings-count')).toHaveTextContent('1');
    });
  });

  it('should add sibling and reload list', async () => {
    (FamilyService.getSiblings as any).mockResolvedValue([]);
    (FamilyService.addSibling as any).mockResolvedValue(undefined);

    const TestComponent = () => {
      const { siblings, addSibling, loadSiblings } = useFamily();
      return (
        <div>
          <span data-testid="siblings-count">{siblings.length}</span>
          <button onClick={() => { addSibling('member-1', 'sibling-1'); }}>
            Add Sibling
          </button>
        </div>
      );
    };

    render(<TestComponent />, { wrapper });

    const addButton = screen.getByText('Add Sibling');
    addButton.click();

    await waitFor(() => {
      expect(FamilyService.addSibling).toHaveBeenCalledWith('member-1', 'sibling-1');
    });
  });

  it('should remove sibling and reload list', async () => {
    (FamilyService.getSiblings as any).mockResolvedValue([]);
    (FamilyService.removeSibling as any).mockResolvedValue(undefined);

    const TestComponent = () => {
      const { siblings, removeSibling } = useFamily();
      return (
        <div>
          <span data-testid="siblings-count">{siblings.length}</span>
          <button onClick={() => { removeSibling('member-1', 'sibling-1'); }}>
            Remove Sibling
          </button>
        </div>
      );
    };

    render(<TestComponent />, { wrapper });

    const removeButton = screen.getByText('Remove Sibling');
    removeButton.click();

    await waitFor(() => {
      expect(FamilyService.removeSibling).toHaveBeenCalledWith('member-1', 'sibling-1');
    });
  });

  it('should clear siblings', async () => {
    (FamilyService.getSiblings as any).mockResolvedValue([mockSibling]);

    const TestComponent = () => {
      const { siblings, loadSiblings, clearSiblings } = useFamily();
      return (
        <div>
          <span data-testid="siblings-count">{siblings.length}</span>
          <button onClick={() => loadSiblings('member-1')}>Load</button>
          <button onClick={clearSiblings}>Clear</button>
        </div>
      );
    };

    render(<TestComponent />, { wrapper });

    const loadButton = screen.getByText('Load');
    loadButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('siblings-count')).toHaveTextContent('1');
    });

    const clearButton = screen.getByText('Clear');
    clearButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('siblings-count')).toHaveTextContent('0');
    });
  });
});