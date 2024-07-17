import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUnique, setIsUnique] = useState({
    username: true,
    email: true,
    phone: true
  });

  useEffect(() => {
    const { fullName, username, email, phone, password } = formData;
    const allFieldsFilled = fullName && username && email && phone && password;
    const allUnique = isUnique.username && isUnique.email && isUnique.phone;
    setIsFormValid(allFieldsFilled && allUnique);
  }, [formData, isUnique]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (['username', 'email', 'phone'].includes(name)) {
      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
      const isUnique = !existingUsers.some(user => user[name] === value);
      setIsUnique(prevState => ({ ...prevState, [name]: isUnique }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    localStorage.setItem('users', JSON.stringify([...existingUsers, formData]));
    navigate('/dashboard');
    try {
      const response = await axios.post('/api/register', formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-createBg">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-confirmBtn">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 mb-4 border border-gray-300 rounded" />
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 mb-4 border border-gray-300 rounded" />
          {!isUnique.username && <p className="text-red-500 mb-4">Username already taken</p>}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 mb-4 border border-gray-300 rounded" />
          {!isUnique.email && <p className="text-red-500 mb-4">Email already registered</p>}
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 mb-4 border border-gray-300 rounded" />
          {!isUnique.phone && <p className="text-red-500 mb-4">Phone number already registered</p>}
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 mb-4 border border-gray-300 rounded" />
          <button type="submit" className={`w-full ${isFormValid ? 'bg-confirmBtn' : 'bg-gray-400'} text-white p-2 rounded`} disabled={!isFormValid}>Confirm</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;