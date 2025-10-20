import React, { useState, useEffect, useCallback } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

// --- CSS STYLES ---
const StyleTag = () => (
  <style>{`
    :root {
      --primary-bg: #f4f7fa; --content-bg: #ffffff; --border-color: #e5e7eb; --text-primary: #111827;
      --text-secondary: #6b7280; --button-primary-bg: #3498db; --button-primary-hover: #2980b9;
      --button-danger-bg: #e74c3c; --button-danger-hover: #c0392b;
      --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .user-page-container {  margin: 2rem auto; padding: 2rem; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; color: var(--text-primary); }
    .add-user-button { padding: 0.6rem 1.2rem; border: none; border-radius: 6px; background-color: var(--button-primary-bg); color: white; font-size: 0.9rem; font-weight: bold; cursor: pointer; transition: background-color 0.2s; }
    .add-user-button:hover { background-color: var(--button-primary-hover); }
    .user-list-container { background-color: var(--content-bg); border-radius: 8px; box-shadow: var(--shadow); overflow: hidden; }
    .custom-table { width: 100%; border-collapse: collapse; }
    .custom-table th, .custom-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    .custom-table thead th { background-color: #f9fafb; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .actions-cell { display: flex; align-items: center; gap: 10px; }
    
    .icon-btn { background: none; border: none; cursor: pointer; padding: 5px; margin: 0; font-size: 16px; color: var(--text-secondary); transition: color 0.2s, transform 0.2s; }
    .icon-btn:hover { transform: scale(1.2); color: var(--button-primary-bg); }
    .icon-btn.delete:hover { color: var(--button-danger-bg); }
    
    .toggle-switch { position: relative; display: inline-block; width: 50px; height: 28px; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 28px; }
    .toggle-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .toggle-slider { background-color: var(--button-primary-bg); }
    input:checked + .toggle-slider:before { transform: translateX(22px); }

    .status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
    .status-badge-active { background-color: #dcfce7; color: #16a34a; }
    .status-badge-inactive { background-color: #f3f4f6; color: #6b7280; }

    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
    .modal-content { background: var(--content-bg); padding: 2rem; border-radius: 8px; width: 450px; max-width: 90%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); position: relative; }
    .modal-close-button { position: absolute; top: 10px; right: 15px; background: transparent; border: none; font-size: 1.8rem; color: var(--text-secondary); cursor: pointer; }
    .form-container h2 { margin-top: 0; margin-bottom: 1.5rem; color: var(--text-primary); text-align: center; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; font-size: 0.9rem; }
    .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 6px; font-size: 1rem; box-sizing: border-box; }
    .submit-button { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; background-color: var(--button-primary-bg); color: white; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background-color 0.2s; width: 100%; margin-top: 1rem; }
    .submit-button:hover { background-color: var(--button-primary-hover); }
    .message { margin-top: 1rem; padding: 0.75rem; border-radius: 6px; text-align: center; font-weight: 500; }
    .message.success { background-color: #d1fae5; color: #065f46; }
    .message.error { background-color: #fee2e2; color: #991b1b; }
    .confirm-dialog { text-align: center; }
    .confirm-dialog p { margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--text-secondary); }
    .confirm-dialog-actions button { padding: 0.6rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin: 0 0.5rem; transition: background-color 0.2s; }
    .confirm-btn { background-color: var(--button-danger-bg); color: white; }
    .confirm-btn:hover { background-color: var(--button-danger-hover); }
    .cancel-btn { background-color: #e5e7eb; color: #4b5563; }
    .spinner { border: 4px solid #f3f4f6; border-top: 4px solid #3498db; border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite; margin: 2rem auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `}</style>
);

// --- Child Component: Toggle Switch ---
const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isOn} onChange={handleToggle} />
      <span className="toggle-slider" />
    </label>
  );
};

// --- Child Component: Add User Modal ---
const AddUserModal = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost/BugTracker/api/user/get_roles.php");
        if (!response.ok) {
          throw new Error('Could not fetch roles.');
        }
        const data = await response.json();
        setRoles(data);
        if (data.length > 0) {
            setFormData(prev => ({ ...prev, role: data[0].role_name }));
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch("http://localhost/BugTracker/api/user/create_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create user.");
      }

      setMessage('User created successfully!');
      setMessageType('success');
      setTimeout(() => {
        onUserAdded();
      }, 1500);

    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="form-container">
          <h2>Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="username">Username</label><input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /></div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange}>
                {roles.length === 0 ? (
                  <option>Loading roles...</option>
                ) : (
                  roles.map(role => (
                    <option key={role.id} value={role.role_name}>
                      {role.role_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <button type="submit" className="submit-button">Create User</button>
            {message && <p className={`message ${messageType}`}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Child Component: Edit User Modal ---
const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({ id: user.id, username: user.username, email: user.email, role: user.role });
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost/BugTracker/api/user/get_roles.php");
        if (!response.ok) throw new Error('Could not fetch roles.');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/BugTracker/api/user/update_user.php", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      onUserUpdated();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="form-container">
          <h2>Edit User: {user.username}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="username">Username</label><input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange}>
                {roles.map(role => (
                  <option key={role.id} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button">Save Changes</button>
            {message && <p className="message error">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Child Component: Confirm Delete Modal ---
const ConfirmDeleteModal = ({ user, onClose, onUserDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("http://localhost/BugTracker/api/user/delete_user.php", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      onUserDeleted();
    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete user <strong>{user.username}</strong>? This action cannot be undone.</p>
          <div className="confirm-dialog-actions">
            <button className="cancel-btn" onClick={onClose} disabled={isDeleting}>Cancel</button>
            <button className="confirm-btn" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, user: null });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost/BugTracker/api/user/get_all_users.php");
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || response.statusText);
      }
      
      const data = await response.json();
      setUsers(data || []); 
    } catch (e) {
      setError(`Failed to fetch users: ${e.message}`);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refreshAndClose = () => {
    setModal({ type: null, user: null });
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch("http://localhost/BugTracker/api/user/update_user.php", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      fetchUsers();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const renderModal = () => {
    const { type, user } = modal;
    if (!type) return null;
    
    switch (type) {
      case 'add':
        return <AddUserModal onClose={() => setModal({ type: null, user: null })} onUserAdded={refreshAndClose} />;
      case 'edit':
        return <EditUserModal user={user} onClose={() => setModal({ type: null, user: null })} onUserUpdated={refreshAndClose} />;
      case 'delete':
        return <ConfirmDeleteModal user={user} onClose={() => setModal({ type: null, user: null })} onUserDeleted={refreshAndClose} />;
      default:
        return null;
    }
  };

  return (
    <>
      <StyleTag />
      <div className="user-page-container">
        <div className="page-header">
          <h1>User Management</h1>
          <button className="add-user-button" onClick={() => setModal({ type: 'add', user: null })}>+ Add New User</button>
        </div>
        
        {renderModal()}

        <div className="user-list-container">
          {isLoading && <div className="spinner"></div>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && (
            <table className="custom-table">
              <thead>
                <tr>
                
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user.id}>
                    
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge status-badge-${user.status}`}>{user.status}</span>
                      </td>
                      <td className="actions-cell">
                        <ToggleSwitch 
                          isOn={user.status === 'active'} 
                          handleToggle={() => handleToggleStatus(user)} 
                        />
                        <button className="icon-btn" title="Edit" onClick={() => setModal({ type: 'edit', user })}>
                          <FaPencilAlt />
                        </button>
                        <button className="icon-btn delete" title="Delete" onClick={() => setModal({ type: 'delete', user })}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default UserManagementPage;