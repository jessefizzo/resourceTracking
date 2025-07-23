# Resource Tracking Dashboard

A simple, visual web application for tracking project assignments and engineer availability.

## Features

- **Project Overview**: View all active projects with their current team members
- **Engineer Dashboard**: See all engineers and their current assignments
- **Availability Filter**: Filter engineers by availability status (All, Available, Assigned)
- **Real-time Stats**: Quick summary of total, available, and assigned engineers
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. Open `index.html` in your web browser
2. The application will automatically load data from `data.json`

## File Structure

- `index.html` - Main application page
- `styles.css` - All styling and visual design
- `script.js` - Application logic and interactivity
- `data.json` - Project and engineer data storage
- `README.md` - This file

## Data Structure

### Projects
```json
{
  "id": "unique-project-id",
  "name": "Project Name",
  "status": "Active|Planning|On Hold",
  "description": "Project description"
}
```

### Engineers
```json
{
  "id": "unique-engineer-id", 
  "name": "Engineer Name",
  "role": "Job Title",
  "currentProjects": ["project-id-1", "project-id-2"]
}
```

## Customization

- Edit `data.json` to add/modify projects and engineers
- Modify `styles.css` to change the visual appearance
- Update `script.js` to add new features or functionality

## Browser Compatibility

Works with all modern browsers that support ES6+ JavaScript features.