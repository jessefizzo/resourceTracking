import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EngineerCard from '../EngineerCard';

describe('EngineerCard', () => {
  const mockEngineer = {
    id: '1',
    name: 'John Doe',
    role: 'Senior Developer'
  };

  const mockProjects = [
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Project Beta' }
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultProps = {
    engineer: mockEngineer,
    projects: mockProjects,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders engineer information correctly', () => {
    render(<EngineerCard {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
  });

  it('displays assigned status when engineer has projects', () => {
    render(<EngineerCard {...defaultProps} />);
    
    expect(screen.getByText('Assigned to 2 projects')).toBeInTheDocument();
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    
    const card = screen.getByText('John Doe').closest('.engineer-card');
    expect(card).toHaveClass('engineer-card', 'assigned');
  });

  it('displays available status when engineer has no projects', () => {
    render(<EngineerCard {...defaultProps} projects={[]} />);
    
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Available for assignment')).toBeInTheDocument();
    
    const card = screen.getByText('John Doe').closest('.engineer-card');
    expect(card).toHaveClass('engineer-card', 'available');
  });

  it('applies correct CSS classes for availability status', () => {
    render(<EngineerCard {...defaultProps} />);
    
    const statusElement = screen.getByText('Assigned to 2 projects');
    expect(statusElement).toHaveClass('availability-status', 'status-assigned');
  });

  it('applies correct CSS classes for available status', () => {
    render(<EngineerCard {...defaultProps} projects={[]} />);
    
    const statusElement = screen.getByText('Available');
    expect(statusElement).toHaveClass('availability-status', 'status-available');
  });

  it('handles single project correctly', () => {
    const singleProject = [{ id: '1', name: 'Solo Project' }];
    render(<EngineerCard {...defaultProps} projects={singleProject} />);
    
    expect(screen.getByText('Solo Project')).toBeInTheDocument();
    expect(screen.getByText('Assigned to 1 project')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<EngineerCard {...defaultProps} />);
    
    const editButton = screen.getByText('Edit Info');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<EngineerCard {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('handles projects with empty names gracefully', () => {
    const projectsWithEmptyNames = [
      { id: '1', name: '' },
      { id: '2', name: 'Valid Project' }
    ];
    
    render(<EngineerCard {...defaultProps} projects={projectsWithEmptyNames} />);
    
    expect(screen.getByText('Valid Project')).toBeInTheDocument();
    expect(screen.getByText('Assigned to 2 projects')).toBeInTheDocument();
  });

  it('displays current projects section correctly', () => {
    render(<EngineerCard {...defaultProps} />);
    
    expect(screen.getByText('Current Projects (2):')).toBeInTheDocument();
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    
    const projectList = document.querySelector('.project-list');
    expect(projectList).toBeInTheDocument();
  });

  it('renders with minimal engineer data', () => {
    const minimalEngineer = {
      id: '1',
      name: 'Jane Doe',
      role: 'Developer'
    };
    
    render(<EngineerCard {...defaultProps} engineer={minimalEngineer} projects={[]} />);
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });
});