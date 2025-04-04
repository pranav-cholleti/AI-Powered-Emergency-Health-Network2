import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './css/login.css'; // Import login CSS

const Login = ({ onLoginSuccess }) => {
  const [role, setRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();  // Initialize the navigate function

  const login = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    if (!username || !password) {
      setErrorMessage('Username and Password are required!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        setErrorMessage('Failed to login. Please try again.');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role); // Save role to localStorage

        if (onLoginSuccess) {
          onLoginSuccess(username, role); // Pass both username and role
        }

        // Navigate to the home page after successful login
        navigate('/');  // Redirect to the home page (or whatever page you want)
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login / Sign up</h2>
        <div className="input-group">
          <label htmlFor="role">Select Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="hospital">Hospital</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button onClick={login}>Login / Sign up</button>

        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </div>
    </div>
  );
};

export default Login;
