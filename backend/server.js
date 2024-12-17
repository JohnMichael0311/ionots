import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';  
import http from 'http';

import dotenv from 'dotenv';
dotenv.config();


import projectRoutes from './routes/projectRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

// Import database connection and seeding function
import { dbconnect } from './seed/dbSeeder.js';  

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PATCH"],
  },
});  

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH'], 
}));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('task_completed', (data) => {
    console.log('Task completed received', data);

   
    io.emit('score_update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Assignment route with real-time score update
app.patch('/update-score/:assignmentId', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

   
    const totalTasks = assignment.taskProgress.length;
    const completedTasks = assignment.taskProgress.filter((task) => task.completed).length;

   
    assignment.score = (completedTasks / totalTasks) * 100;

    // Save updated assignment with the new score
    const updatedAssignment = await assignment.save();

    // Emit the updated score to all connected clients
    io.emit('score_update', {
      assignmentId: assignment._id,
      score: updatedAssignment.score,
    });

    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use(express.json());  

// MongoDB Connection & Seeding
dbconnect(); 

// Use Routes
app.use('/api/projects', projectRoutes);  
app.use('/api/assignments', assignmentRoutes);  

// Port Setup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));