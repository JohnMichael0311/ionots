// Sample projects data
export const sample_projects = [
  {
    title: "Data Science Basics",
    description: "Learn fundamental concepts of data science",
    deadline: "2024-12-31",
    skillsRequired: ["Python", "Statistics"],
    difficulty: "Beginner",
    tasks: [
      { title: "Setup Python Environment", weightage: 10, description: "Install Python and required libraries" },
      { title: "Data Collection", weightage: 20, description: "Gather and clean dataset" },
      { title: "Data Analysis", weightage: 30, description: "Perform EDA" },
      { title: "Visualization", weightage: 40, description: "Create meaningful visualizations" }
    ],
    maxScore: 100,
  },
  {
    title: "Advanced Web Development",
    description: "Learn to build full-stack web applications using Node.js and React",
    deadline: "2025-01-15",
    skillsRequired: ["JavaScript", "React", "Node.js", "MongoDB"],
    difficulty: "Advanced",
    tasks: [
      { title: "Set Up Backend", weightage: 25, description: "Set up the backend using Node.js and Express" },
      { title: "Frontend with React", weightage: 25, description: "Build the UI with React.js" },
      { title: "Database Setup", weightage: 25, description: "Set up MongoDB database" },
      { title: "Deployment", weightage: 25, description: "Deploy the application to Heroku" },
    ],
    maxScore: 100,
  },
];

// Sample assignments data
export const sample_assignments = [
  {
    projectId: "Project ID of Data Science Basics",
    candidateId: "candidate123",
    status: "Assigned",
    progress: 0,
    score: 0,
    startDate: "2024-11-01T00:00:00Z",
    lastUpdated: "2024-11-01T00:00:00Z",
  },
  {
    projectId: "Project ID of Advanced Web Development",
    candidateId: "candidate124",
    status: "In Progress",
    progress: 40,
    score: 40,
    startDate: "2024-11-05T00:00:00Z",
    lastUpdated: "2024-12-10T00:00:00Z",
  },
];
const projectData = { sample_projects, sample_assignments };
export default projectData;
