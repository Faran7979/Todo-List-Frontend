import React, { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState({ weekly: 0, daily: 0 });
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', priority: 2, category_id: '' });
  const [newCategory, setNewCategory] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('due_date');
  const [editingTask, setEditingTask] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTaskData, setEditingTaskData] = useState({});
  const [editingCategoryData, setEditingCategoryData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, categoriesRes, progressRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/categories'),
        api.get('/progress')
      ]);
      setTasks(tasksRes.data);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
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
      const response = await api.post('/tasks', newTask);
      setTasks(prevTasks => [...prevTasks, response.data]);
      setNewTask({ title: '', description: '', due_date: '', priority: 2, category_id: '' });
    } catch (error) {
      console.error('Error adding task:', error.response?.data || error.message);
      alert(`Failed to add task: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task.task_id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const { task_id, user_id, created_at, updated_at, status, ...taskWithoutExcludedFields } = updatedTask;
      const response = await api.put(`/tasks/${taskId}`, taskWithoutExcludedFields);
      setTasks(prevTasks => prevTasks.map(task => (task.task_id === taskId ? response.data : task)));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert(`Failed to update task: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_completed: true })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Task status updated:', result);
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };
      
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/categories', { name: newCategory });
      setCategories(prevCategories => [...prevCategories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prevCategories => prevCategories.filter(category => category.category_id !== id));
    } catch (error) {
      console.error('Error deleting category:', error.response?.data || error.message);
    }
  };

  const handleUpdateCategory = async (id, updatedCategory) => {
    try {
      const response = await api.put(`/categories/${id}`, updatedCategory);
      setCategories(prevCategories => prevCategories.map(category => (category.category_id === id ? response.data : category)));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error.response?.data || error.message);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => filter === 'all' || task.category_id.toString() === filter)
    .sort((a, b) => {
      if (sort === 'due_date') return new Date(a.due_date) - new Date(b.due_date);
      if (sort === 'priority') return a.priority - b.priority;
      return 0;
    });

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1: return 'bg-red-500 text-white';
      case 2: return 'bg-yellow-500 text-black';
      case 3: return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.task_id);
    setEditingTaskData(task);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.category_id);
    setEditingCategoryData(category);
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCategoryData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
     <h1 className="text-4xl font-bold mb-8 text-center text-confirmBtn">Todo List Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-loginBtn">Tasks</h2>
              <div className="space-x-2">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="p-2 border rounded">
                  <option value="due_date">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>
            <ul className="space-y-4">
              {filteredAndSortedTasks.map(task => (
                <li key={task.task_id} className="bg-gray-50 rounded-lg p-4 shadow flex justify-between items-center">
                  {editingTask === task.task_id ? (
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        name="title"
                        value={editingTaskData.title}
                        onChange={handleTaskInputChange}
                        className="p-2 border rounded"
                      />
                      <input
                        type="text"
                        name="description"
                        value={editingTaskData.description}
                        onChange={handleTaskInputChange}
                        className="p-2 border rounded"
                      />
                      <input
                        type="date"
                        name="due_date"
                        value={editingTaskData.due_date}
                        onChange={handleTaskInputChange}
                        className="p-2 border rounded"
                      />
                      <select
                        name="priority"
                        value={editingTaskData.priority}
                        onChange={handleTaskInputChange}
                        className="p-2 border rounded"
                      >
                        <option value="1">High</option>
                        <option value="2">Medium</option>
                        <option value="3">Low</option>
                      </select>
                      <select
                        name="category_id"
                        value={editingTaskData.category_id}
                        onChange={handleTaskInputChange}
                        className="p-2 border rounded"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.category_id} value={category.category_id.toString()}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="flex space-x-2 mt-2">
                        <button onClick={() => handleUpdateTask(task.task_id, editingTaskData)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                          Save
                        </button>
                        <button onClick={() => setEditingTask(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={task.status}
                          onChange={() => toggleTaskCompletion(task.task_id, task.status)}
                          className="form-checkbox"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <p>{task.description}</p>
                          <p>Due Date: {task.due_date}</p>
                          <p className={getPriorityClass(task.priority)}>Priority: {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditTask(task)} className="text-blue-500 hover:text-blue-700">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTask(task.task_id)} className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddTask} className="mt-4">
              <div className="space-y-2">
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  name="due_date"
                  value={newTask.due_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </select>
                <select
                  name="category_id"
                  value={newTask.category_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-confirmBtn text-white px-4 py-2 rounded mt-4 hover:bg-loginBtn">
                Add Task
              </button>
            </form>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-confirmBtn">Categories</h2>
            <ul className="space-y-4">
              {categories.map(category => (
                <li key={category.category_id} className="bg-gray-50 rounded-lg p-4 shadow flex justify-between items-center">
                  {editingCategory === category.category_id ? (
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        name="name"
                        value={editingCategoryData.name}
                        onChange={handleCategoryInputChange}
                        className="p-2 border rounded"
                      />
                      <div className="flex space-x-2">
                        <button onClick={() => handleUpdateCategory(category.category_id, editingCategoryData)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                          Save
                        </button>
                        <button onClick={() => setEditingCategory(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>{category.name}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditCategory(category)} className="text-blue-500 hover:text-blue-700">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCategory(category.category_id)} className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddCategory} className="mt-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category"
                className="w-full p-2 border rounded mb-2"
              />
              <button type="submit" className="bg-loginBtn text-white px-4 py-2 rounded hover:bg-confirmBtn">
                Add Category
              </button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-loginBtn">Progress</h2>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Weekly Progress:</span>
                <div className="bg-gray-200 rounded-full h-4 mt-1">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${progress.weekly}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{progress.weekly}%</span>
              </div>
              <div>
                <span className="font-semibold">Daily Progress:</span>
                <div className="bg-gray-200 rounded-full h-4 mt-1">
                  <div
                    className="bg-yellow-500 h-4 rounded-full"
                    style={{ width: `${progress.daily}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{progress.daily}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;