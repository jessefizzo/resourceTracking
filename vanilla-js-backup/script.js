class ResourceTracker {
    constructor() {
        this.data = null;
        this.currentFilter = 'all';
        this.editingItem = null;
        this.editingType = null;
        this.hasChanges = false;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data. Please ensure data.json exists.');
        }
    }

    setupEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderEngineers();
                this.updateStats();
            });
        });

        // Add button listeners
        document.getElementById('add-project-btn')?.addEventListener('click', () => this.openProjectModal());
        document.getElementById('add-engineer-btn')?.addEventListener('click', () => this.openEngineerModal());
        document.querySelectorAll('.add-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                if (type === 'project') this.openProjectModal();
                if (type === 'engineer') this.openEngineerModal();
            });
        });

        // Save button
        document.getElementById('save-data-btn')?.addEventListener('click', () => this.saveData());

        // Modal event listeners
        this.setupModalListeners();

        // Event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target);
            console.log('Dataset:', e.target.dataset);
            
            const action = e.target.dataset.action;
            const id = e.target.dataset.id;
            
            if (!action || !id) return;
            
            console.log('Action:', action, 'ID:', id);
            
            switch (action) {
                case 'edit-project':
                    this.editProject(id);
                    break;
                case 'delete-project':
                    this.deleteProject(id);
                    break;
                case 'edit-engineer':
                    this.editEngineer(id);
                    break;
                case 'delete-engineer':
                    this.deleteEngineer(id);
                    break;
            }
        });
    }

    render() {
        if (!this.data) return;
        this.renderProjects();
        this.renderEngineers();
        this.updateStats();
    }

    renderProjects() {
        const container = document.getElementById('projects-container');
        if (!this.data.projects) {
            container.innerHTML = '<p class="error">No projects data found</p>';
            return;
        }

        container.innerHTML = this.data.projects.map(project => {
            const assignedEngineers = this.data.engineers.filter(engineer => 
                engineer.currentProjects.includes(project.id)
            );

            return `
                <div class="project-card">
                    <div class="project-name">${project.name}</div>
                    <div class="project-status status-${project.status.toLowerCase().replace(' ', '-')}">${project.status}</div>
                    <p>${project.description}</p>
                    <div class="project-team">
                        <h4>Team (${assignedEngineers.length})</h4>
                        <div class="engineer-chips">
                            ${assignedEngineers.map(engineer => 
                                `<span class="engineer-chip">${engineer.name}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn" data-action="edit-project" data-id="${project.id}" style="pointer-events: auto;">Edit</button>
                        <button class="delete-btn" data-action="delete-project" data-id="${project.id}" style="pointer-events: auto;">Delete</button>
                        <button onclick="alert('Test button works!')" style="background: green; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">Test</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderEngineers() {
        const container = document.getElementById('engineers-container');
        if (!this.data.engineers) {
            container.innerHTML = '<p class="error">No engineers data found</p>';
            return;
        }

        let filteredEngineers = this.data.engineers;

        if (this.currentFilter === 'available') {
            filteredEngineers = this.data.engineers.filter(engineer => 
                engineer.currentProjects.length === 0
            );
        } else if (this.currentFilter === 'assigned') {
            filteredEngineers = this.data.engineers.filter(engineer => 
                engineer.currentProjects.length > 0
            );
        }

        container.innerHTML = filteredEngineers.map(engineer => {
            const isAvailable = engineer.currentProjects.length === 0;
            const currentProjectsInfo = engineer.currentProjects.map(projectId => {
                const project = this.data.projects.find(p => p.id === projectId);
                return project ? project.name : 'Unknown Project';
            }).join(', ');

            return `
                <div class="engineer-card ${isAvailable ? 'available' : 'assigned'}">
                    <div class="engineer-name">${engineer.name}</div>
                    <div class="engineer-role">${engineer.role}</div>
                    <div class="availability-status status-${isAvailable ? 'available' : 'assigned'}">
                        ${isAvailable ? 'Available' : 'Assigned'}
                    </div>
                    <div class="current-projects">
                        <h5>Current Projects:</h5>
                        <div class="project-list">
                            ${isAvailable ? 'None - Available for assignment' : currentProjectsInfo}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn" data-action="edit-engineer" data-id="${engineer.id}">Edit</button>
                        <button class="delete-btn" data-action="delete-engineer" data-id="${engineer.id}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        if (!this.data || !this.data.engineers) return;
        
        const totalEngineers = this.data.engineers.length;
        const availableEngineers = this.data.engineers.filter(engineer => 
            engineer.currentProjects.length === 0
        ).length;
        const assignedEngineers = totalEngineers - availableEngineers;

        document.getElementById('stats-total').textContent = `Total: ${totalEngineers}`;
        document.getElementById('stats-available').textContent = `Available: ${availableEngineers}`;
        document.getElementById('stats-assigned').textContent = `Assigned: ${assignedEngineers}`;
    }

    // Modal Management
    setupModalListeners() {
        // Project modal
        const projectModal = document.getElementById('project-modal');
        const engineerModal = document.getElementById('engineer-modal');
        const confirmModal = document.getElementById('confirm-modal');

        // Close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeAllModals());
        });

        // Cancel buttons
        document.getElementById('cancel-project')?.addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-engineer')?.addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-confirm')?.addEventListener('click', () => this.closeAllModals());

        // Form submissions
        document.getElementById('project-form')?.addEventListener('submit', (e) => this.handleProjectSubmit(e));
        document.getElementById('engineer-form')?.addEventListener('submit', (e) => this.handleEngineerSubmit(e));

        // Click outside to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }

    openProjectModal(projectId = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-form');
        const title = document.getElementById('project-modal-title');
        
        this.editingItem = projectId;
        this.editingType = 'project';
        
        if (projectId) {
            const project = this.data.projects.find(p => p.id === projectId);
            title.textContent = 'Edit Project';
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-status').value = project.status;
            document.getElementById('project-description').value = project.description || '';
        } else {
            title.textContent = 'Add New Project';
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    openEngineerModal(engineerId = null) {
        const modal = document.getElementById('engineer-modal');
        const form = document.getElementById('engineer-form');
        const title = document.getElementById('engineer-modal-title');
        const projectsContainer = document.getElementById('engineer-projects');
        
        this.editingItem = engineerId;
        this.editingType = 'engineer';
        
        // Generate project checkboxes
        projectsContainer.innerHTML = this.data.projects.map(project => `
            <div class="checkbox-item">
                <input type="checkbox" id="project-${project.id}" value="${project.id}">
                <label for="project-${project.id}">${project.name}</label>
            </div>
        `).join('');
        
        if (engineerId) {
            const engineer = this.data.engineers.find(e => e.id === engineerId);
            title.textContent = 'Edit Engineer';
            document.getElementById('engineer-name').value = engineer.name;
            document.getElementById('engineer-role').value = engineer.role;
            
            // Check current projects
            engineer.currentProjects.forEach(projectId => {
                const checkbox = document.getElementById(`project-${projectId}`);
                if (checkbox) checkbox.checked = true;
            });
        } else {
            title.textContent = 'Add New Engineer';
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        this.editingItem = null;
        this.editingType = null;
    }

    handleProjectSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectData = {
            name: formData.get('name'),
            status: formData.get('status'),
            description: formData.get('description') || ''
        };

        if (this.editingItem) {
            // Edit existing project
            const project = this.data.projects.find(p => p.id === this.editingItem);
            Object.assign(project, projectData);
        } else {
            // Add new project
            const newProject = {
                id: `proj-${Date.now()}`,
                ...projectData
            };
            this.data.projects.push(newProject);
        }

        this.hasChanges = true;
        this.render();
        this.closeAllModals();
    }

    handleEngineerSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const checkedProjects = Array.from(document.querySelectorAll('#engineer-projects input:checked'))
            .map(input => input.value);

        const engineerData = {
            name: formData.get('name'),
            role: formData.get('role'),
            currentProjects: checkedProjects
        };

        if (this.editingItem) {
            // Edit existing engineer
            const engineer = this.data.engineers.find(e => e.id === this.editingItem);
            Object.assign(engineer, engineerData);
        } else {
            // Add new engineer
            const newEngineer = {
                id: `eng-${Date.now()}`,
                ...engineerData
            };
            this.data.engineers.push(newEngineer);
        }

        this.hasChanges = true;
        this.render();
        this.closeAllModals();
    }

    editProject(projectId) {
        this.openProjectModal(projectId);
    }

    editEngineer(engineerId) {
        this.openEngineerModal(engineerId);
    }

    deleteProject(projectId) {
        const project = this.data.projects.find(p => p.id === projectId);
        const modal = document.getElementById('confirm-modal');
        const message = document.getElementById('confirm-message');
        const confirmBtn = document.getElementById('confirm-action');
        
        message.textContent = `Are you sure you want to delete the project "${project.name}"? This will also remove it from all assigned engineers.`;
        confirmBtn.onclick = () => {
            // Remove project from data
            this.data.projects = this.data.projects.filter(p => p.id !== projectId);
            
            // Remove project from all engineers
            this.data.engineers.forEach(engineer => {
                engineer.currentProjects = engineer.currentProjects.filter(id => id !== projectId);
            });
            
            this.hasChanges = true;
            this.render();
            this.closeAllModals();
        };
        
        modal.style.display = 'block';
    }

    deleteEngineer(engineerId) {
        const engineer = this.data.engineers.find(e => e.id === engineerId);
        const modal = document.getElementById('confirm-modal');
        const message = document.getElementById('confirm-message');
        const confirmBtn = document.getElementById('confirm-action');
        
        message.textContent = `Are you sure you want to delete the engineer "${engineer.name}"?`;
        confirmBtn.onclick = () => {
            this.data.engineers = this.data.engineers.filter(e => e.id !== engineerId);
            this.hasChanges = true;
            this.render();
            this.closeAllModals();
        };
        
        modal.style.display = 'block';
    }

    saveData() {
        if (!this.hasChanges) {
            alert('No changes to save.');
            return;
        }

        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.hasChanges = false;
        alert('Data exported as data.json. Replace the original file with this downloaded version.');
    }

    showError(message) {
        const container = document.querySelector('.dashboard');
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

let resourceTracker;

document.addEventListener('DOMContentLoaded', () => {
    resourceTracker = new ResourceTracker();
});