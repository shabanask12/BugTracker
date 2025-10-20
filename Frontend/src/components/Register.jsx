// src/components/Register.jsx

import React, { useState } from 'react';
// STEP 1: IMPORT THE LINK COMPONENT
import { Link } from 'react-router-dom'; 
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('http://localhost/BugTracker/api/user/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setMessageType('success');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(`Error: ${result.message}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
        </div>
        <button type="submit" className="submit-button">Register</button>
      </form>
      
      {message && <p className={`message ${messageType}`}>{message}</p>}

      {/* STEP 2: ADD THE LINK TO THE LOGIN PAGE */}
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;