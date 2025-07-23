# Resource Tracking Dashboard - React Version

A modern, full-stack resource tracking application built with React, Netlify Functions, and Neon PostgreSQL.

## Features

- **Modern React Architecture**: Built with React 19 and Vite for optimal performance
- **PostgreSQL Database**: Powered by Neon with Drizzle ORM for type-safe database operations
- **Serverless Functions**: Netlify Functions for scalable API endpoints
- **Real-time Updates**: Live project and engineer management
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, Vite, CSS3
- **Backend**: Netlify Functions, Node.js
- **Database**: Neon PostgreSQL, Drizzle ORM
- **Hosting**: Netlify
- **Development**: ESLint, Hot Module Replacement

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- Netlify account
- Neon database account

### 2. Installation
```bash
npm install
```

### 3. Database Setup

#### Option A: Automatic Setup (Recommended)
```bash
# This should work once Netlify CLI is fixed
npx netlify db init
```

#### Option B: Manual Setup
1. Create a Neon database at [neon.tech](https://neon.tech)
2. Copy your database URL
3. Update `.env` file:
```env
DATABASE_URL=your_neon_database_url_here
```

### 4. Database Migration & Seeding
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 5. Development
```bash
# Start development server with Netlify Functions
npm run netlify:dev

# Or start just the frontend (functions won't work)
npm run dev
```

### 6. Deployment
```bash
# Build and deploy to Netlify
npm run netlify:deploy
```

## Project Structure

```
resource-tracking/           # Root directory
├── src/
│   ├── components/          # React components
│   │   ├── ProjectCard.jsx
│   │   ├── EngineerCard.jsx
│   │   ├── ProjectModal.jsx
│   │   ├── EngineerModal.jsx
│   │   └── ConfirmModal.jsx
│   ├── db/                  # Database configuration
│   │   ├── schema.js        # Drizzle schema definitions
│   │   ├── index.js         # Database connection
│   │   └── seed.js          # Database seeding script
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   └── main.jsx             # Application entry point
├── netlify/
│   └── functions/           # Serverless API endpoints
│       ├── projects.js      # Projects CRUD operations
│       ├── engineers.js     # Engineers CRUD operations
│       └── assignments.js   # Project assignments CRUD
├── vanilla-js-backup/       # Original vanilla JS version (backup)
├── drizzle.config.js        # Drizzle ORM configuration
├── netlify.toml             # Netlify configuration
└── package.json
```

## API Endpoints

### Projects
- `GET /.netlify/functions/projects` - Get all projects
- `POST /.netlify/functions/projects` - Create project
- `PUT /.netlify/functions/projects` - Update project
- `DELETE /.netlify/functions/projects?id=<id>` - Delete project

### Engineers
- `GET /.netlify/functions/engineers` - Get all engineers
- `POST /.netlify/functions/engineers` - Create engineer
- `PUT /.netlify/functions/engineers` - Update engineer
- `DELETE /.netlify/functions/engineers?id=<id>` - Delete engineer

### Assignments
- `GET /.netlify/functions/assignments` - Get all assignments
- `POST /.netlify/functions/assignments` - Create assignment
- `DELETE /.netlify/functions/assignments?id=<id>` - Delete assignment

## Database Schema

### Projects Table
- `id` - UUID primary key
- `name` - Project name
- `status` - Active, Planning, or On Hold
- `description` - Project description
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Engineers Table
- `id` - UUID primary key
- `name` - Engineer name
- `role` - Job title/role
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Project Assignments Table
- `id` - UUID primary key
- `projectId` - Foreign key to projects
- `engineerId` - Foreign key to engineers
- `createdAt` - Assignment creation timestamp

## Development Scripts

```bash
npm run dev                 # Start Vite dev server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run ESLint
npm run db:generate        # Generate database migrations
npm run db:migrate         # Run database migrations
npm run db:studio          # Open Drizzle Studio (database GUI)
npm run db:seed            # Seed database with sample data
npm run netlify:dev        # Start Netlify dev environment
npm run netlify:build      # Build with Netlify
npm run netlify:deploy     # Deploy to Netlify
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_neon_postgresql_connection_string
```

## Troubleshooting

### Database Connection Issues
1. Verify your `DATABASE_URL` is correct
2. Ensure your Neon database is running
3. Check firewall settings

### Netlify Functions Not Working Locally
1. Make sure you're using `npm run netlify:dev` instead of `npm run dev`
2. Verify functions are in the `netlify/functions` directory
3. Check function logs in Netlify dashboard

### CORS Issues
All API functions include proper CORS headers, but if you encounter issues:
1. Verify the frontend is making requests to the correct endpoints
2. Check that the Netlify dev server is running on the expected port

## Production Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure environment variables in Netlify dashboard
4. Deploy!

The application will automatically build and deploy when you push changes to your main branch.

## Migration from Vanilla JS Version

This React version provides several improvements over the original vanilla JS version:

- **Database Persistence**: Real PostgreSQL database instead of JSON file
- **Scalable Architecture**: Serverless functions for API endpoints
- **Better State Management**: React hooks for predictable state updates
- **Type Safety**: Better error handling and data validation
- **Production Ready**: Built for scale with proper deployment pipeline

## License

This project is licensed under the MIT License.