import React, { useState, useEffect } from 'react';
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState({  daily: { percentage: 0, completed: 0, total: 0 },
    weekly: { percentage: 0, completed: 0, total: 0 }
  });
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

  const handleLogout = () => {
    console.log('Logout function called');
    
    // Clear JWT token from cookies
    document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear token from localStorage (if you're using it)
    localStorage.removeItem('jwt_token');
    
    // Clear token from sessionStorage (if you're using it)
    sessionStorage.removeItem('jwt_token');
  
    // Redirect user to login page
    window.location.href = '/login';
  
    // Show success message
    toast.success('Logged out successfully', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/tasks', {
      title: newTask.title,
      description: newTask.description,
      due_date: newTask.due_date,
      priority: Number(newTask.priority),
      category_id: newTask.category_id ? Number(newTask.category_id) : null
    });

    if (response.status === 201) {
      // Add the new task to the existing tasks array
      setTasks(prevTasks => [...prevTasks, response.data.task]);
      
      // Update progress if the response includes it
      if (response.data.progress) {
        setProgress(response.data.progress);
      }

      // Reset the newTask form
      setNewTask({ title: '', description: '', due_date: '', priority: 2, category_id: '' });
      
      // Show success message
      toast.success('Task added successfully!');
    }
  } catch (error) {
    console.error('Error adding task:', error.response?.data || error.message);
    toast.error(`Failed to add task: ${error.response?.data?.message || error.message}`);
  }
};

  const handleDeleteTask = async (taskId) => {
  try {
    if (!taskId) {
      throw new Error('Invalid task ID');
    }
    const response = await api.delete(`/tasks/${taskId}`);
    console.log('Delete task response:', response.data);
    if (response.status === 200) {
      setTasks(prevTasks => prevTasks.filter(task => task.task_id !== taskId));
      if (response.data.progress) {
        setProgress(response.data.progress);
      }
      toast.success('Task deleted successfully!');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error(`Failed to delete task: ${error.response?.data?.message || error.message}`);
  }
};

  const handleUpdateTask = async (taskId, updatedTask) => {
  try {
    const payload = {
      title: updatedTask.title,
      description: updatedTask.description,
      due_date: updatedTask.due_date,
      priority: Number(updatedTask.priority) || null,
      category_id: updatedTask.category_id ? Number(updatedTask.category_id) : null
    };

    console.log('Sending update payload:', payload);

    const response = await api.put(`/tasks/${taskId}`, payload);
    
    if (response.status === 200) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.task_id === taskId ? response.data.task : task
      ));
      if (response.data.progress) {
        setProgress(response.data.progress);
      }
      setEditingTask(null);
      toast.success('Task updated successfully!');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    toast.error(`Failed to update task: ${error.response?.data?.message || error.message}`);
  }
};

 const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      console.log('Toggling task completion:', { taskId, currentStatus });
      const response = await api.put(`/tasks/${taskId}/complete`, {
        is_completed: !currentStatus
      });
      console.log('Server response:', response.data);
      if (response.status === 200) {
        setTasks(prevTasks => prevTasks.map(task =>
          task.task_id === taskId ? { ...task, is_completed: !currentStatus } : task
        ));
        // Update progress with the new data from the server
        setProgress(response.data.progress);
      }
    } catch (error) {
      console.error('Error toggling task status:', error.response?.data || error.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/categories', { name: newCategory });
      setCategories(prevCategories => [...prevCategories, response.data]);
      setNewCategory('');
      toast.success('Category added successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
      toast.error('Failed to add category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prevCategories => prevCategories.filter(category => category.category_id !== id));
      toast.success('Category deleted successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if (error.response && error.response.data.message === 'Cannot delete category with associated tasks') {
        toast.error('Cannot delete this category. Please delete all associated tasks first.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error('Error deleting category:', error.response?.data || error.message);
        toast.error('An error occurred while deleting the category');
      }
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
   setEditingTaskData({
    title: task.title,
    description: task.description || '',
    due_date: task.due_date || '',
    priority: task.priority || 2,
    category_id: task.category_id || ''
  });
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
      <ToastContainer />
      <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      LogOut
    </button>
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
    <li key={`task-${task.task_id}`} className="bg-gray-50 rounded-lg p-4 shadow flex justify-between items-center">
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
                        checked={task.is_completed}
                      onChange={() => toggleTaskCompletion(task.task_id, task.is_completed)}
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
                  <option key="default" value="">Select Category</option>
  {categories.map(category => (
    <option key={`select-category-${category.category_id}`} value={category.category_id.toString()}>
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
    <li key={`category-${category.category_id}`} className="bg-gray-50 rounded-lg p-4 shadow flex justify-between items-center">
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
                style={{ width: `${progress.weekly.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {progress.weekly.percentage}% ({progress.weekly.completed}/{progress.weekly.total} tasks)
            </span>
          </div>
          <div>
            <span className="font-semibold">Daily Progress:</span>
            <div className="bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-yellow-500 h-4 rounded-full"
                style={{ width: `${progress.daily.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {progress.daily.percentage}% ({progress.daily.completed}/{progress.daily.total} tasks)
            </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;