import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProjectModal from '../ProjectModal';

describe('ProjectModal', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    show: true,
    project: null,
    onSave: mockOnSave,
    onClose: mockOnClose
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when show is false', () => {
    render(<ProjectModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Add New Project')).not.toBeInTheDocument();
  });

  it('renders add mode correctly', () => {
    render(<ProjectModal {...defaultProps} />);
    
    expect(screen.getByText('Add New Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Unprioritized')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });

  it('renders edit mode correctly', () => {
    const existingProject = {
      id: '1',
      name: 'Existing Project',
      status: 'Planning',
      priority: 'P1',
      description: 'Existing description'
    };

    render(<ProjectModal {...defaultProps} project={existingProject} />);
    
    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Planning')).toBeInTheDocument();
    expect(screen.getByDisplayValue('P1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
  });

  it('handles form input changes', async () => {
    const user = userEvent.setup();
    render(<ProjectModal {...defaultProps} />);
    
    const nameInput = screen.getByLabelText(/project name/i);
    const statusSelect = screen.getByLabelText(/status/i);
    const prioritySelect = screen.getByLabelText(/priority/i);
    const descriptionTextarea = screen.getByLabelText(/description/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'New Project Name');
    await user.selectOptions(statusSelect, 'On Hold');
    await user.selectOptions(prioritySelect, 'P2');
    await user.clear(descriptionTextarea);
    await user.type(descriptionTextarea, 'New description');

    expect(nameInput).toHaveValue('New Project Name');
    expect(statusSelect).toHaveValue('On Hold');
    expect(prioritySelect).toHaveValue('P2');
    expect(descriptionTextarea).toHaveValue('New description');
  });

  it('calls onSave with form data when submitted', async () => {
    const user = userEvent.setup();
    render(<ProjectModal {...defaultProps} />);
    
    const nameInput = screen.getByLabelText(/project name/i);

    await user.type(nameInput, 'Test Project');
    await user.click(screen.getByText('Create Project'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Test Project',
        status: 'Active',
        priority: 'Unprioritized',
        description: '',
        engineerIds: []
      });
    });
  });

  it('prevents submission with empty required fields', async () => {
    const user = userEvent.setup();
    render(<ProjectModal {...defaultProps} />);
    
    const submitButton = screen.getByText('Create Project');
    await user.click(submitButton);

    // Form should prevent submission due to required field validation
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectModal {...defaultProps} />);
    
    await user.click(screen.getByText('Cancel'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectModal {...defaultProps} />);
    
    await user.click(screen.getByText('×'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    render(<ProjectModal {...defaultProps} />);
    
    // Since backdrop click is complex to test, we'll test by clicking the modal backdrop
    const modalElement = document.querySelector('.modal');
    if (modalElement) {
      fireEvent.click(modalElement);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('resets form when switching from edit to add mode', () => {
    const existingProject = {
      id: '1',
      name: 'Existing Project',
      status: 'Planning',
      priority: 'P1',
      description: 'Existing description'
    };

    const { rerender } = render(<ProjectModal {...defaultProps} project={existingProject} />);
    
    expect(screen.getByDisplayValue('Existing Project')).toBeInTheDocument();
    
    // Switch to add mode
    rerender(<ProjectModal {...defaultProps} project={null} />);
    
    const nameInput = screen.getByLabelText(/project name/i);
    expect(nameInput).toHaveValue(''); // name field should be empty
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument(); // status should reset to default
    expect(screen.getByDisplayValue('Unprioritized')).toBeInTheDocument(); // priority should reset to default
  });

  it('handles projects with missing optional fields', () => {
    const minimalProject = {
      id: '1',
      name: 'Minimal Project'
    };

    render(<ProjectModal {...defaultProps} project={minimalProject} />);
    
    expect(screen.getByDisplayValue('Minimal Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument(); // should use default
    expect(screen.getByDisplayValue('Unprioritized')).toBeInTheDocument(); // should use default
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // description should be empty
  });
});