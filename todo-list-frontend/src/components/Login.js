import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { username, password } = formData;
    setIsFormValid(username && password);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', formData);
      localStorage.setItem('token', response.data.token);
      setLoggedIn(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-loginBg">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-loginBtn">Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={formData.username} 
            onChange={handleChange} 
            className="w-full p-2 mb-4 border border-gray-300 rounded" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full p-2 mb-4 border border-gray-300 rounded" 
          />
          <button 
            type="submit" 
            className={`w-full ${isFormValid ? 'bg-loginBtn' : 'bg-gray-400'} text-white p-2 rounded`} 
            disabled={!isFormValid}
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Not registered? <Link to="/create-account" className="text-loginBtn">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;