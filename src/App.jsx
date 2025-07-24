import { useState, useEffect } from 'react';
import './App.css';
import ProjectCard from './components/ProjectCard';
import EngineerCard from './components/EngineerCard';
import ProjectModal from './components/ProjectModal';
import EngineerModal from './components/EngineerModal';
import ConfirmModal from './components/ConfirmModal';

function App() {
  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeView, setActiveView] = useState('projects');

  // Modal states
  const [projectModal, setProjectModal] = useState({ show: false, project: null });
  const [engineerModal, setEngineerModal] = useState({ show: false, engineer: null });
  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', item: null, message: '' });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsRes, engineersRes, assignmentsRes] = await Promise.all([
        fetch('/.netlify/functions/projects'),
        fetch('/.netlify/functions/engineers'),
        fetch('/.netlify/functions/assignments')
      ]);

      if (!projectsRes.ok || !engineersRes.ok || !assignmentsRes.ok) {
        throw new Error('Failed to load data');
      }

      const [projectsData, engineersData, assignmentsData] = await Promise.all([
        projectsRes.json(),
        engineersRes.json(), 
        assignmentsRes.json()
      ]);

      setProjects(projectsData);
      setEngineers(engineersData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get engineers assigned to a project
  const getProjectEngineers = (projectId) => {
    const projectAssignments = assignments.filter(a => a.projectId === projectId);
    return engineers.filter(e => projectAssignments.some(a => a.engineerId === e.id));
  };

  // Get projects assigned to an engineer
  const getEngineerProjects = (engineerId) => {
    const engineerAssignments = assignments.filter(a => a.engineerId === engineerId);
    return projects.filter(p => engineerAssignments.some(a => a.projectId === p.id));
  };

  // Filter engineers based on current filter
  const getFilteredEngineers = () => {
    if (filter === 'available') {
      return engineers.filter(engineer => 
        !assignments.some(a => a.engineerId === engineer.id)
      );
    } else if (filter === 'assigned') {
      return engineers.filter(engineer => 
        assignments.some(a => a.engineerId === engineer.id)
      );
    }
    return engineers;
  };

  // Statistics
  const getStats = () => {
    const total = engineers.length;
    const assigned = new Set(assignments.map(a => a.engineerId)).size;
    const available = total - assigned;
    return { total, assigned, available };
  };

  // Sort projects by priority
  const getSortedProjects = () => {
    const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3, 'Unprioritized': 4 };
    return [...projects].sort((a, b) => {
      const aPriority = priorityOrder[a.priority] || 4;
      const bPriority = priorityOrder[b.priority] || 4;
      return aPriority - bPriority;
    });
  };

  // Project CRUD operations
  const handleCreateProject = async (projectData) => {
    try {
      const response = await fetch('/.netlify/functions/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) throw new Error('Failed to create project');
      
      const newProject = await response.json();
      setProjects([...projects, newProject]);
      
      // Handle engineer assignments if any are selected
      if (projectData.engineerIds && projectData.engineerIds.length > 0) {
        const newAssignments = projectData.engineerIds.map(engineerId => ({
          projectId: newProject.id,
          engineerId
        }));
        
        const assignmentPromises = newAssignments.map(assignment =>
          fetch('/.netlify/functions/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assignment)
          })
        );
        
        const assignmentResults = await Promise.all(assignmentPromises);
        const createdAssignments = await Promise.all(
          assignmentResults.map(res => res.json())
        );
        
        setAssignments([...assignments, ...createdAssignments]);
      }
      
      setProjectModal({ show: false, project: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const projectId = projectModal.project.id;
      
      // Update project
      const response = await fetch(`/.netlify/functions/projects`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId, ...projectData })
      });
      
      if (!response.ok) throw new Error('Failed to update project');
      
      const updatedProject = await response.json();
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      
      // Update engineer assignments
      const currentAssignments = assignments.filter(a => a.projectId === projectId);
      const newEngineerIds = projectData.engineerIds || [];
      
      // Remove old assignments that are no longer selected
      const assignmentsToRemove = currentAssignments.filter(a => 
        !newEngineerIds.includes(a.engineerId)
      );
      
      // Add new assignments for newly selected engineers
      const assignmentsToAdd = newEngineerIds.filter(engineerId =>
        !currentAssignments.some(a => a.engineerId === engineerId)
      ).map(engineerId => ({ projectId, engineerId }));
      
      // Delete old assignments
      await Promise.all(assignmentsToRemove.map(assignment =>
        fetch(`/.netlify/functions/assignments?id=${assignment.id}`, {
          method: 'DELETE'
        })
      ));
      
      // Create new assignments
      const newAssignmentResults = await Promise.all(assignmentsToAdd.map(assignment =>
        fetch('/.netlify/functions/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assignment)
        })
      ));
      
      const createdAssignments = await Promise.all(
        newAssignmentResults.map(res => res.json())
      );
      
      // Update assignments state
      const updatedAssignments = assignments
        .filter(a => a.projectId !== projectId)
        .concat(createdAssignments);
      
      setAssignments(updatedAssignments);
      setProjectModal({ show: false, project: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const projectId = confirmModal.item.id;
      const response = await fetch(`/.netlify/functions/projects?id=${projectId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete project');
      
      setProjects(projects.filter(p => p.id !== projectId));
      setAssignments(assignments.filter(a => a.projectId !== projectId));
      setConfirmModal({ show: false, type: '', item: null, message: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Engineer CRUD operations
  const handleCreateEngineer = async (engineerData) => {
    try {
      const response = await fetch('/.netlify/functions/engineers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(engineerData)
      });
      
      if (!response.ok) throw new Error('Failed to create engineer');
      
      const newEngineer = await response.json();
      setEngineers([...engineers, newEngineer]);
      setEngineerModal({ show: false, engineer: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateEngineer = async (engineerData) => {
    try {
      const engineerId = engineerModal.engineer.id;
      
      // Update engineer
      const response = await fetch(`/.netlify/functions/engineers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: engineerId, ...engineerData })
      });
      
      if (!response.ok) throw new Error('Failed to update engineer');
      
      const updatedEngineer = await response.json();
      setEngineers(engineers.map(e => e.id === updatedEngineer.id ? updatedEngineer : e));
      setEngineerModal({ show: false, engineer: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEngineer = async () => {
    try {
      const engineerId = confirmModal.item.id;
      const response = await fetch(`/.netlify/functions/engineers?id=${engineerId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete engineer');
      
      setEngineers(engineers.filter(e => e.id !== engineerId));
      setAssignments(assignments.filter(a => a.engineerId !== engineerId));
      setConfirmModal({ show: false, type: '', item: null, message: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Modal handlers
  const openProjectModal = (project = null) => {
    setProjectModal({ show: true, project });
  };

  const openEngineerModal = (engineer = null) => {
    setEngineerModal({ show: true, engineer });
  };

  const openDeleteConfirm = (type, item) => {
    const message = type === 'project' 
      ? `Are you sure you want to delete the project "${item.name}"? This will also remove it from all assigned engineers.`
      : `Are you sure you want to delete the engineer "${item.name}"?`;
    
    setConfirmModal({ show: true, type, item, message });
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === 'project') {
      handleDeleteProject();
    } else if (confirmModal.type === 'engineer') {
      handleDeleteEngineer();
    }
  };

  const stats = getStats();
  const filteredEngineers = getFilteredEngineers();
  const sortedProjects = getSortedProjects();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>Resource Tracking Dashboard</h1>
        <p>Visualize project staffing and available engineers</p>
        <div className="header-controls">
          <button className="add-btn" onClick={() => openProjectModal()}>
            + Add Project
          </button>
          <button className="add-btn" onClick={() => openEngineerModal()}>
            + Add Engineer
          </button>
        </div>
      </header>

      <main>
        {/* Tab Navigation */}
        <div className="view-tabs">
          <button 
            className={`tab-btn ${activeView === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveView('projects')}
          >
            Projects Overview ({projects.length})
          </button>
          <button 
            className={`tab-btn ${activeView === 'engineers' ? 'active' : ''}`}
            onClick={() => setActiveView('engineers')}
          >
            Engineering Team ({engineers.length})
          </button>
        </div>

        <div className="dashboard">
          {/* Projects View */}
          {activeView === 'projects' && (
            <section className="projects-section">
              <div className="section-header">
                <h2>Projects Overview</h2>
                <div className="section-controls">
                  <span className="priority-legend">
                    <span className="legend-item p1">P1</span>
                    <span className="legend-item p2">P2</span>
                    <span className="legend-item p3">P3</span>
                    <span className="legend-item unprioritized">Unprioritized</span>
                  </span>
                  <button className="add-section-btn" onClick={() => openProjectModal()}>
                    + Add Project
                  </button>
                </div>
              </div>
              <div className="projects-grid compact">
                {sortedProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    engineers={getProjectEngineers(project.id)}
                    onEdit={() => openProjectModal(project)}
                    onDelete={() => openDeleteConfirm('project', project)}
                    compact={true}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Engineers View */}
          {activeView === 'engineers' && (
            <section className="engineers-section">
              <div className="section-header">
                <h2>Engineering Team</h2>
                <button className="add-section-btn" onClick={() => openEngineerModal()}>
                  + Add Engineer
                </button>
              </div>
              <div className="section-controls">
                <div className="engineers-filter">
                  {['all', 'available', 'assigned'].map(filterType => (
                    <button
                      key={filterType}
                      className={`filter-btn ${filter === filterType ? 'active' : ''}`}
                      onClick={() => setFilter(filterType)}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)} Engineers
                    </button>
                  ))}
                </div>
                <div className="summary-stats">
                  <span>Total: {stats.total}</span>
                  <span className="stats-available">Available: {stats.available}</span>
                  <span className="stats-assigned">Assigned: {stats.assigned}</span>
                </div>
              </div>
              <div className="engineers-grid">
                {filteredEngineers.map(engineer => (
                  <EngineerCard
                    key={engineer.id}
                    engineer={engineer}
                    projects={getEngineerProjects(engineer.id)}
                    onEdit={() => openEngineerModal(engineer)}
                    onDelete={() => openDeleteConfirm('engineer', engineer)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProjectModal
        show={projectModal.show}
        project={projectModal.project}
        engineers={engineers}
        currentAssignments={projectModal.project ? getProjectEngineers(projectModal.project.id) : []}
        onSave={projectModal.project ? handleUpdateProject : handleCreateProject}
        onClose={() => setProjectModal({ show: false, project: null })}
      />

      <EngineerModal
        show={engineerModal.show}
        engineer={engineerModal.engineer}
        onSave={engineerModal.engineer ? handleUpdateEngineer : handleCreateEngineer}
        onClose={() => setEngineerModal({ show: false, engineer: null })}
      />

      <ConfirmModal
        show={confirmModal.show}
        message={confirmModal.message}
        onConfirm={handleConfirmAction}
        onClose={() => setConfirmModal({ show: false, type: '', item: null, message: '' })}
      />
    </div>
  );
}

export default App;