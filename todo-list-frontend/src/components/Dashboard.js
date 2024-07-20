// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState({
    weekly: 0,
    daily: 0,
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 2,
    category_id: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('due_date');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, categoriesRes, progressRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/categories'),
        axios.get('/api/progress')
      ]);
      setTasks(tasksRes.data);
      setCategories(categoriesRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', newTask);
      setNewTask({ title: '', description: '', due_date: '', priority: 2, category_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/categories', { name: newCategory });
      setNewCategory('');
      fetchData();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 1: return 'bg-red-500 text-white';
      case 2: return 'bg-yellow-500 text-black';
      case 3: return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => filter === 'all' || task.category_id.toString() === filter)
    .sort((a, b) => {
      if (sort === 'due_date') return new Date(a.due_date) - new Date(b.due_date);
      if (sort === 'priority') return a.priority - b.priority;
      return 0;
    });

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-confirmBtn">Todo List Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-confirmBtn">Tasks</h2>
              <div className="space-x-2">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="due_date">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>
            <ul className="space-y-4">
              {filteredAndSortedTasks.map(task => (
                <li key={task.task_id} className="bg-gray-50 rounded-lg p-4 shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityClass(task.priority)}`}>
                        {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}
                      </span>
                      <span className="text-sm text-gray-500">Due: {task.due_date}</span>
                      <span className="text-sm text-gray-500">
                        Category: {categories.find(c => c.category_id === task.category_id)?.name}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteTask(task.task_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-loginBtn">Add New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Task Title"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task Description"
                className="w-full p-2 border rounded"
                rows="3"
              ></textarea>
              <input
                type="date"
                name="due_date"
                value={newTask.due_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
              <select
                name="category_id"
                value={newTask.category_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="w-full bg-loginBtn hover:bg-loginBtn-dark text-white font-bold py-2 px-4 rounded transition duration-300">
                Add Task
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-confirmBtn">Progress</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Weekly Progress</h3>
                <div className="bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-confirmBtn h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress.weekly_progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{progress.weekly_progress}% completed</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Daily Tasks Completed</h3>
                <p className="text-3xl font-bold text-loginBtn">{progress.daily_progress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-confirmBtn">Categories</h2>
            <ul className="space-y-2 mb-4">
              {categories.map(category => (
                <li key={category.category_id} className="bg-gray-100 p-2 rounded-lg text-confirmBtn flex justify-between items-center">
                  {category.name}
                  <button 
                    onClick={() => handleDeleteCategory(category.category_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddCategory} className="flex space-x-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category Name"
                className="flex-grow p-2 border rounded"
                required
              />
              <button type="submit" className="bg-confirmBtn hover:bg-confirmBtn-dark text-white font-bold py-2 px-4 rounded transition duration-300">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;