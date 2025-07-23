import { db, schema } from './index.js';

const seedData = {
  projects: [
    {
      name: "E-commerce Platform Redesign",
      status: "Active",
      description: "Complete redesign of the main e-commerce platform with modern UI/UX"
    },
    {
      name: "Mobile App Development",
      status: "Active", 
      description: "Native iOS and Android app for customer engagement"
    },
    {
      name: "Data Analytics Dashboard",
      status: "Planning",
      description: "Real-time analytics dashboard for business intelligence"
    },
    {
      name: "API Gateway Migration",
      status: "Active",
      description: "Migration from legacy API infrastructure to cloud-native gateway"
    },
    {
      name: "Security Audit & Compliance",
      status: "On Hold",
      description: "Comprehensive security audit and GDPR compliance implementation"
    },
    {
      name: "Customer Support Portal",
      status: "Active",
      description: "Self-service portal for customer ticket management and FAQ system"
    },
    {
      name: "Machine Learning Pipeline",
      status: "Planning",
      description: "Automated ML pipeline for product recommendations and user behavior analysis"
    },
    {
      name: "Legacy System Modernization",
      status: "Active",
      description: "Migrate legacy Java monolith to microservices architecture"
    },
    {
      name: "Performance Optimization",
      status: "Planning",
      description: "Database optimization and caching implementation for improved response times"
    },
    {
      name: "Multi-tenant Architecture",
      status: "On Hold",
      description: "Implement multi-tenant support for enterprise clients"
    }
  ],
  
  engineers: [
    { name: "Sarah Johnson", role: "Senior Frontend Developer" },
    { name: "Mike Chen", role: "Full Stack Engineer" },
    { name: "Emily Rodriguez", role: "Mobile Developer" },
    { name: "David Kim", role: "Backend Engineer" },
    { name: "Jessica Wu", role: "Data Engineer" },
    { name: "Alex Thompson", role: "DevOps Engineer" },
    { name: "Maria Gonzalez", role: "UI/UX Designer" },
    { name: "James Wilson", role: "Senior Backend Developer" },
    { name: "Lisa Chang", role: "Frontend Developer" },
    { name: "Robert Davis", role: "Security Engineer" },
    { name: "Amanda Foster", role: "Machine Learning Engineer" },
    { name: "Carlos Martinez", role: "Database Administrator" },
    { name: "Nina Patel", role: "QA Engineer" },
    { name: "Thomas Anderson", role: "Senior Full Stack Developer" },
    { name: "Rachel Green", role: "Frontend Developer" },
    { name: "Kevin Liu", role: "Cloud Architect" },
    { name: "Sophie Turner", role: "Product Manager" },
    { name: "Marcus Johnson", role: "Backend Engineer" },
    { name: "Isabella Chen", role: "Data Scientist" },
    { name: "Jordan Wright", role: "Site Reliability Engineer" }
  ]
};

// Define project assignments based on original data
const projectAssignments = [
  // E-commerce Platform Redesign (proj-001)
  { engineerName: "Sarah Johnson", projectName: "E-commerce Platform Redesign" },
  { engineerName: "Mike Chen", projectName: "E-commerce Platform Redesign" },
  { engineerName: "Maria Gonzalez", projectName: "E-commerce Platform Redesign" },
  { engineerName: "Nina Patel", projectName: "E-commerce Platform Redesign" },
  
  // Mobile App Development (proj-002)
  { engineerName: "Emily Rodriguez", projectName: "Mobile App Development" },
  { engineerName: "Lisa Chang", projectName: "Mobile App Development" },
  { engineerName: "Sophie Turner", projectName: "Mobile App Development" },
  { engineerName: "Nina Patel", projectName: "Mobile App Development" },
  
  // API Gateway Migration (proj-004)
  { engineerName: "Mike Chen", projectName: "API Gateway Migration" },
  { engineerName: "David Kim", projectName: "API Gateway Migration" },
  { engineerName: "Alex Thompson", projectName: "API Gateway Migration" },
  { engineerName: "Kevin Liu", projectName: "API Gateway Migration" },
  
  // Customer Support Portal (proj-006)
  { engineerName: "Sarah Johnson", projectName: "Customer Support Portal" },
  { engineerName: "Maria Gonzalez", projectName: "Customer Support Portal" },
  { engineerName: "Lisa Chang", projectName: "Customer Support Portal" },
  { engineerName: "Sophie Turner", projectName: "Customer Support Portal" },
  
  // Machine Learning Pipeline (proj-007)
  { engineerName: "Jessica Wu", projectName: "Machine Learning Pipeline" },
  { engineerName: "Amanda Foster", projectName: "Machine Learning Pipeline" },
  { engineerName: "Isabella Chen", projectName: "Machine Learning Pipeline" },
  
  // Legacy System Modernization (proj-008)
  { engineerName: "David Kim", projectName: "Legacy System Modernization" },
  { engineerName: "Alex Thompson", projectName: "Legacy System Modernization" },
  { engineerName: "Carlos Martinez", projectName: "Legacy System Modernization" },
  { engineerName: "Thomas Anderson", projectName: "Legacy System Modernization" }
];

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await db.delete(schema.projectAssignments);
    await db.delete(schema.engineers);
    await db.delete(schema.projects);
    
    console.log('Cleared existing data');
    
    // Insert projects
    const insertedProjects = await db
      .insert(schema.projects)
      .values(seedData.projects)
      .returning();
      
    console.log(`Inserted ${insertedProjects.length} projects`);
    
    // Insert engineers  
    const insertedEngineers = await db
      .insert(schema.engineers)
      .values(seedData.engineers)
      .returning();
      
    console.log(`Inserted ${insertedEngineers.length} engineers`);
    
    // Create project assignments
    const assignments = projectAssignments.map(assignment => {
      const project = insertedProjects.find(p => p.name === assignment.projectName);
      const engineer = insertedEngineers.find(e => e.name === assignment.engineerName);
      
      if (project && engineer) {
        return {
          projectId: project.id,
          engineerId: engineer.id
        };
      }
      return null;
    }).filter(Boolean);
    
    if (assignments.length > 0) {
      await db
        .insert(schema.projectAssignments)
        .values(assignments);
        
      console.log(`Inserted ${assignments.length} project assignments`);
    }
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedDatabase();
  process.exit(0);
}