import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    let errors = {};
    if (formData.fullname.length < 5) {
      errors.username = 'fullname must be at least 5 characters long';
    }
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }
    if (formData.password.length < 5) {
      errors.password = 'Password must be at least 5 characters long';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email must be valid';
    }
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await api.post('/users/register', formData);
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        alert('Registration failed: ' + (error.response?.data?.message || 'An error occurred'));
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-createBg">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-confirmBtn">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full p-2 mb-1 border border-gray-300 rounded"
          />
          {errors.fullname && <p className="text-red-500 text-sm mb-2">{errors.fullname}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 mb-1 border border-gray-300 rounded"
          />
          {errors.username && <p className="text-red-500 text-sm mb-2">{errors.username}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-1 border border-gray-300 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-1 border border-gray-300 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
          <button
            type="submit"
            className={`w-full ${isFormValid ? 'bg-confirmBtn' : 'bg-gray-400'} text-white p-2 rounded mt-4`}
            disabled={!isFormValid}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;