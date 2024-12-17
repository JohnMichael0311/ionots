import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProject = async (projectId) => {
    try {
      await axios.post('http://localhost:5000/api/assignments/accept', {
        projectId,
        candidateId: '123', // This would come from an authenticated user in a real app
      });
      // Display success message in a better way (Toast, etc.)
      alert('Project accepted successfully!');
      fetchProjects(); // Refresh the project list
    } catch (error) {
      alert('Failed to accept project');
      console.error(error);
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Available Projects</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Tasks:</h4>
              <ul className="list-disc pl-5">
                {project.tasks ? (
                  project.tasks.map((task) => (
                    <li key={task._id} className="text-sm text-gray-600">
                      {task.title} ({task.weightage}%)
                    </li>
                  ))
                ) : (
                  <li>No tasks available for this project</li>
                )}
              </ul>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-blue-600">
                Difficulty: {project.difficulty}
              </span>
              {/* You may want to show if the project has already been accepted */}
              <button
                onClick={() => handleAcceptProject(project._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Accept Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
