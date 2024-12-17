import express from 'express';
import Project from '../models/Project.js';
import projectData from '../seed/data.js';  // Import default data

const router = express.Router();

// GET: Fetch all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch a project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Create a new project (Accepts req.body or pre-defined projectData)
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body || projectData);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST: Prepopulate default projectData
router.post("/populate-default", async (req, res) => {
  try {
    const defaultProject = new Project(projectData);
    const savedProject = await defaultProject.save();
    res.status(201).json({ message: "Default project added", savedProject });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update a project by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove a project by ID
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 
