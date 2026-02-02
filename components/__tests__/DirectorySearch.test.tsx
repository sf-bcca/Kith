import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DirectorySearch from '../DirectorySearch';

describe('DirectorySearch', () => {
  it('renders search input', () => {
    render(<DirectorySearch onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search family members/i)).toBeInTheDocument();
  });

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn();
    render(<DirectorySearch onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search family members/i);
    
    fireEvent.change(input, { target: { value: 'Merlin' } });
    
    expect(onSearch).toHaveBeenCalledWith('Merlin');
  });

  it('renders filters', () => {
    render(<DirectorySearch onSearch={vi.fn()} />);
    expect(screen.getByText('Living')).toBeInTheDocument();
    expect(screen.getByText('Deceased')).toBeInTheDocument();
    expect(screen.getByText('By Branch')).toBeInTheDocument();
  });
});
