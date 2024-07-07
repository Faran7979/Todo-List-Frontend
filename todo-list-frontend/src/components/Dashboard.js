

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    try {
      const response = await axios.post('/tasks', { task: newTask });
      setTasks([...tasks, { id: response.data.id, content: newTask }]);
      setNewTask('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="mb-4">
          <h3 className="text-xl mb-2">Weekly Progress: 82%</h3>
          <h3 className="text-xl mb-2">Daily Progress: 100%</h3>
        </div>
        <div className="tasks mb-4">
          <h3 className="text-xl mb-2">Tasks</h3>
          <ul className="list-disc pl-5 mb-4">
            {tasks.map(task => (
              <li key={task.id} className="mb-2 bg-gray-200 p-2 rounded">{task.content}</li>
            ))}
          </ul>
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New Task" className="w-full p-2 mb-4 border border-gray-300 rounded" />
          <button onClick={addTask} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Task</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
