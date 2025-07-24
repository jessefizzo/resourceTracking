import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectCard from '../ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    status: 'Active',
    priority: 'P1',
    description: 'Test project description'
  };

  const mockEngineers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' }
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultProps = {
    project: mockProject,
    engineers: mockEngineers,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders project information correctly', () => {
    render(<ProjectCard {...defaultProps} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('Test project description')).toBeInTheDocument();
  });

  it('displays correct number of engineers', () => {
    render(<ProjectCard {...defaultProps} />);
    
    expect(screen.getByText('Team (2)')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles empty engineers list', () => {
    render(<ProjectCard {...defaultProps} engineers={[]} />);
    
    expect(screen.getByText('Team (0)')).toBeInTheDocument();
  });

  it('applies correct CSS classes for status', () => {
    render(<ProjectCard {...defaultProps} />);
    
    const statusElement = screen.getByText('Active');
    expect(statusElement).toHaveClass('project-status', 'status-active');
  });

  it('applies correct CSS classes for priority', () => {
    render(<ProjectCard {...defaultProps} />);
    
    const priorityElement = screen.getByText('P1');
    expect(priorityElement).toHaveClass('project-priority', 'priority-p1');
  });

  it('handles status with spaces correctly', () => {
    const projectWithSpacedStatus = {
      ...mockProject,
      status: 'On Hold'
    };
    
    render(<ProjectCard {...defaultProps} project={projectWithSpacedStatus} />);
    
    const statusElement = screen.getByText('On Hold');
    expect(statusElement).toHaveClass('status-on-hold');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ProjectCard {...defaultProps} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ProjectCard {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renders with missing optional fields', () => {
    const minimalProject = {
      id: '1',
      name: 'Minimal Project',
      status: 'Active',
      priority: 'Unprioritized'
    };
    
    render(<ProjectCard {...defaultProps} project={minimalProject} />);
    
    expect(screen.getByText('Minimal Project')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Unprioritized')).toBeInTheDocument();
  });
});