import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import api from './api'; // Make sure this path is correct
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify the token with the backend
          await api.get('/users/verify-token'); // Adjust this endpoint as needed
          setLoggedIn(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={loggedIn ? <Navigate to="/dashboard" /> : <Login setLoggedIn={setLoggedIn} />}
          />
          <Route 
            path="/login" 
            element={loggedIn ? <Navigate to="/dashboard" /> : <Login setLoggedIn={setLoggedIn} />} 
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route
            path="/dashboard"
            element={loggedIn ? <Dashboard setLoggedIn={setLoggedIn} /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;