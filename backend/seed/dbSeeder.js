import { connect, set } from 'mongoose';
import Project from '../models/Project.js';
import Assignment from '../models/Assignment.js';
import dotenv from 'dotenv';
import { sample_projects, sample_assignments } from './data.js';

dotenv.config();

set('strictQuery', true);


export const dbconnect = async () => {
  try {
   
    await connect(process.env.MONGO_URI);
    await seedProjects();
    await seedAssignments();
    console.log("Database connected and data seeded successfully.");
  } catch (err) {
    console.log('Error connecting to the database or seeding data:', err);
  }
};

// Function to seed projects
async function seedProjects() {
  const projectCount = await Project.countDocuments();
  if (projectCount > 0) {
    console.log("Projects data already seeded.");
    return;
  }

  for (let project of sample_projects) {
    const newProject = await Project.create(project);
    console.log(`Project ${newProject.title} has been created.`);
  }
}

// Function to seed assignments
async function seedAssignments() {
  const assignmentCount = await Assignment.countDocuments();
  if (assignmentCount > 0) {
    console.log("Assignments data already seeded.");
    return;
  }

  for (let assignment of sample_assignments) {
    
    const project = await Project.findOne({ title: assignment.projectId }); 
    if (project) {
      assignment.projectId = project._id; 
      await Assignment.create(assignment);
      console.log(`Assignment for project ${project.title} has been created.`);
    }
  }
}
