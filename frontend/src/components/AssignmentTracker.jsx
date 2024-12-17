import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

function AssignmentTracker() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
    
   
    socket.on('score_update', (updatedAssignment) => {
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment._id === updatedAssignment._id ? updatedAssignment : assignment
        )
      );
    });

    return () => {
      socket.off('score_update'); // Cleanup listener on component unmount
    };
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/assignments/candidate/123');
      setAssignments(response.data);
    } catch (err) {
      setError('Failed to fetch assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskProgress = async (assignmentId, taskId, completed) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/assignments/${assignmentId}/task/${taskId}`,
        { completed }
      );

      // Emit the updated score to all connected clients
      socket.emit('task_completed', response.data);

      // Directly update state
      const updatedAssignments = assignments.map(assignment => {
        if (assignment._id === assignmentId) {
          const updatedTaskProgress = assignment.taskProgress.map(task =>
            task.taskId === taskId ? { ...task, completed } : task
          );
          return { ...assignment, taskProgress: updatedTaskProgress };
        }
        return assignment;
      });

      setAssignments(updatedAssignments); // Update state locally
    } catch (error) {
      alert('Failed to update task progress');
      console.error(error);
    }
  };

  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Assignments</h2>
      {assignments.map((assignment) => (
        <div key={assignment._id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {assignment.projectId.title}
            </h3>
            <span className={`px-3 py-1 rounded ${assignment.status === 'Completed' ? 'bg-green-100 text-green-800' : assignment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
              {assignment.status}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Overall Progress</span>
              <span>{assignment.progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${assignment.progress}%` }}></div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Tasks:</h4>
            {assignment.taskProgress.map((task) => {
              const taskDetails = assignment.projectId.tasks.find(t => t._id === task.taskId);
              return (
                <div key={task._id} className="flex items-center justify-between py-2 border-b">
                  <span className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => updateTaskProgress(assignment._id, task.taskId, e.target.checked)}
                      className="mr-3"
                    />
                    {taskDetails ? taskDetails.title : 'Task not found'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {taskDetails ? taskDetails.weightage : 0}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="font-semibold">Current Score: </span>
              <span className="text-lg text-blue-600">{assignment.score.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-600">
              Last updated: {new Date(assignment.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssignmentTracker;
