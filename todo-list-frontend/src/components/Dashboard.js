
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
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="progress">
        <div>Weekly Progress: 82%</div>
        <div>Daily Progress: 100%</div>
      </div>
      <div className="tasks">
        <h3>Tasks</h3>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>{task.content}</li>
          ))}
        </ul>
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New Task" />
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
};

export default Dashboard;
