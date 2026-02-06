import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RelationshipWizard from '../RelationshipWizard';
import React from 'react';

describe('RelationshipWizard', () => {
  const defaultProps = {
    existingSiblings: [],
    onUpdate: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sibling type options', () => {
    render(<RelationshipWizard {...defaultProps} />);

    expect(screen.getByText('Full Sibling')).toBeInTheDocument();
    expect(screen.getByText('Half Sibling')).toBeInTheDocument();
    expect(screen.getByText('Step Sibling')).toBeInTheDocument();
    expect(screen.getByText('Adopted Sibling')).toBeInTheDocument();
    expect(screen.getByText('Link Existing Family Member')).toBeInTheDocument();
    expect(screen.getByText('Or Create New Placeholder')).toBeInTheDocument();
  });

  it('should create new placeholder sibling', async () => {
    const user = userEvent.setup();
    render(<RelationshipWizard {...defaultProps} />);

    const firstNameInput = screen.getByPlaceholderText('First name');
    const lastNameInput = screen.getByPlaceholderText('Last name');

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Smith');

    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<RelationshipWizard {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should save selected siblings', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<RelationshipWizard {...defaultProps} onUpdate={onUpdate} />);

    const firstNameInput = screen.getByPlaceholderText('First name');
    const lastNameInput = screen.getByPlaceholderText('Last name');

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Smith');
    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Save Siblings'));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith([], expect.any(Array));
    });
  });

  it('should show selected siblings count', async () => {
    const user = userEvent.setup();
    render(<RelationshipWizard {...defaultProps} />);

    const firstNameInput = screen.getByPlaceholderText('First name');
    const lastNameInput = screen.getByPlaceholderText('Last name');

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Smith');
    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Selected Siblings (1)')).toBeInTheDocument();
    });
  });
});
