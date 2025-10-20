import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Import the useAuth hook

// --- STYLES ---
const StyleTag = () => (
  <style>{`
    .register-container {
      max-width: 450px;
      margin: 4rem auto;
      padding: 2rem;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .register-container h2 {
      text-align: center;
      color: #111827;
      margin-bottom: 1.5rem;
    }
    .register-form .form-group {
      margin-bottom: 1rem;
    }
    .register-form label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }
    .register-form input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .submit-button {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      background-color: #3498db;
      color: white;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      margin-top: 1rem;
      transition: background-color 0.2s;
    }
    .submit-button:hover {
      background-color: #2980b9;
    }
    .message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 6px;
      text-align: center;
      font-weight: 500;
    }
    .message.success {
      background-color: #d1fae5;
      color: #065f46;
    }
    .message.error {
      background-color: #fee2e2;
      color: #991b1b;
    }
  `}</style>
);


function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const navigate = useNavigate();
  const { setCurrentUser, setPermissions } = useAuth(); // ✅ Get context setters

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('http://localhost/BugTracker/api/user/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (response.ok && result.user) {
        setMessage(result.message);
        setMessageType('success');
        
        const loggedInUser = result.user;

        // 1. Save user to session storage
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        // 2. ✅ Immediately set the current user in the context
        setCurrentUser(loggedInUser);

        // 3. ✅ Fetch and set permissions right after login
        if (loggedInUser.role) {
            const permissionsResponse = await fetch(`http://localhost/BugTracker/api/permissions/get_by_role.php?role=${loggedInUser.role}`);
            const permissionsData = await permissionsResponse.json();
            setPermissions(permissionsData); // Update context with permissions
        }
        
        // Navigate after a short delay
        setTimeout(() => {
          navigate('/dashboard'); 
        }, 1000);
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
    <>
      <StyleTag />
      <div className="register-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Username or Email:</label>
            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        
        {message && <p className={`message ${messageType}`}>{message}</p>}

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </>
  );
}

export default Login;
