import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    study: ["Task 1", "Task 2", "Task 3"],
    work: ["Task 1", "Task 2", "Task 3"],
    hobbies: ["Task 1", "Task 2", "Task 3"]
  });
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('study');
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [selectedWeek, setSelectedWeek] = useState(1);

  const handleTaskChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  const addTask = async () => {
    try {
      const response = await axios.post('/tasks', { task: newTask, category: selectedCategory });
      setTasks(prevTasks => ({
        ...prevTasks,
        [selectedCategory]: [...prevTasks[selectedCategory], newTask]
      }));
      setNewTask('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl mb-2">Weekly Progress: 82%</h3>
            <div className="w-20 h-20">
              <svg viewBox="0 0 36 36" className="circular-chart pink">
                <path className="circle-bg" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" stroke-dasharray="82, 100" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">82%</text>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-xl mb-2">Daily Progress: 100%</h3>
            <div className="w-20 h-20">
              <svg viewBox="0 0 36 36" className="circular-chart green">
                <path className="circle-bg" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" stroke-dasharray="100, 100" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">100%</text>
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-around">
            {['Day', 'Week', 'Month', 'Year'].map(period => (
              <button
                key={period}
                className={`px-4 py-2 ${selectedPeriod === period ? 'bg-pink-500 text-white' : 'bg-pink-200'}`}
                onClick={() => handlePeriodChange(period)}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-pink-300 px-4 py-2 rounded">{new Date().toLocaleString('default', { month: 'long' })}</button>
            <button className="bg-pink-300 px-4 py-2 rounded ml-4">{new Date().getFullYear()}</button>
          </div>
          <div className="flex justify-center mt-4">
            {[15, 16, 17, 18, 19, 20, 21].map(day => (
              <button
                key={day}
                className="bg-pink-300 px-4 py-2 rounded ml-2"
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4].map(week => (
              <button
                key={week}
                className={`bg-pink-300 w-10 h-10 rounded-full ${selectedWeek === week ? 'bg-pink-500 text-white' : ''}`}
                onClick={() => handleWeekChange(week)}
              >
                {week}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['study', 'work', 'hobbies'].map(category => (
            <div key={category}>
              <h3 className="text-xl mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <ul className="list-disc pl-5 mb-4">
                {tasks[category].map((task, index) => (
                  <li key={index} className="mb-2 bg-gray-200 p-2 rounded">{task}</li>
                ))}
              </ul>
              <button 
                onClick={() => handleTaskChange(category)} 
                className={`w-full ${selectedCategory === category ? 'bg-blue-500' : 'bg-gray-300'} text-white p-2 rounded hover:bg-blue-600`}
              >
                Add a Task...
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-pink-500 p-4 rounded-full" onClick={() => setSelectedCategory('')}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
        {selectedCategory && (
          <div className="mt-4">
            <input 
              type="text" 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder="New Task" 
              className="w-full p-2 mb-4 border border-gray-300 rounded" 
            />
            <button onClick={addTask} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Confirm Task</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;