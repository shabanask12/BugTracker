import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ToggleSwitch = ({ isOn, handleToggle, disabled = false }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={isOn} onChange={handleToggle} disabled={disabled} />
    <span className="slider" />
  </label>
);

function PermissionsPage() {
  const { setPermissions: setGlobalPermissions, currentUser } = useAuth();
  
  const [permissions, setPermissionsList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setMessage({ text: '', type: '' }); // Clear previous messages
      try {
        // Fetch the complete permissions state from the new API endpoint
        const response = await fetch('http://localhost/BugTracker/api/permissions/get_all_role_permissions.php');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }
        
        const data = await response.json();

        // Use the data from the API instead of the old mock data
        setPermissionsList(data.permissions || []);
        setRoles(data.roles || []);
        setRolePermissions(data.role_permissions || {});

      } catch (error) {
        setMessage({ text: error.message || 'Failed to load initial permissions data.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array is correct; this should only run on mount

 const handleToggle = (role, permission) => {
    // This function receives the role and permission of the switch that was clicked.
    
    // We use the functional form of setState to get the most recent state (prevState).
    setRolePermissions(prevState => {
      
      // CRITICAL STEP: Create a deep copy of the state object.
      // JSON.parse(JSON.stringify()) is a simple way to create a brand new object
      // with no references to the old one. This is key to making React re-render.
      const newState = JSON.parse(JSON.stringify(prevState));
      
      // Flip the boolean value for the specific permission.
      newState[role][permission] = !newState[role][permission];
      
      // Return the new state object. React will see it's a new object and update the UI.
      return newState;
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Save permissions to DB
      const response = await fetch('http://localhost/BugTracker/api/permissions/update_permissions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rolePermissions),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Server responded with an error.');
      }

      // Fetch updated permissions for the current user's role from DB
      if (currentUser && currentUser.role) {
        const permResponse = await fetch(
          `http://localhost/BugTracker/api/permissions/get_by_role.php?role=${encodeURIComponent(currentUser.role.toLowerCase())}`
        );
        if (!permResponse.ok) {
          throw new Error('Failed to fetch updated permissions.');
        }
        const updatedPermissions = await permResponse.json();
        setGlobalPermissions(updatedPermissions); // Update context with fresh DB data
      }

      setMessage({ text: 'Permissions updated successfully!', type: 'success' });

    } catch (error) {
      setMessage({ text: `Failed to save permissions: ${error.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const formatPermissionName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  if (isLoading) {
    return <div className="permissions-container"><div className="spinner" /></div>;
  }

  return (
    <>
      <style>{`
        :root {
          --primary-bg: #f4f7fa; --content-bg: #ffffff; --border-color: #e5e7eb;
          --text-primary: #111827; --text-secondary: #6b7280;
          --button-primary-bg: #3498db; --button-primary-hover: #2980b9;
          --toggle-bg-off: #ccc; --toggle-bg-on: #3498db; --shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .permissions-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 2rem auto; padding: 2rem; max-width: 900px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
        .page-header h1 { margin: 0; color: var(--text-primary); font-size: 1.75rem; }
        .save-button { padding: 0.6rem 1.5rem; border: none; border-radius: 6px; background-color: var(--button-primary-bg); color: white; font-size: 0.9rem; font-weight: bold; cursor: pointer; transition: background-color 0.2s, opacity 0.2s; }
        .save-button:hover:not(:disabled) { background-color: var(--button-primary-hover); }
        .save-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .permissions-grid-container { background-color: var(--content-bg); border-radius: 8px; box-shadow: var(--shadow); overflow-x: auto; }
        .permissions-table { width: 100%; border-collapse: collapse; }
        .permissions-table th, .permissions-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
        .permissions-table thead th { background-color: #f9fafb; color: #6b7280; font-weight: bold; text-transform: uppercase; font-size: 12px; text-align: center; }
        .permissions-table tbody td:first-child { font-weight: 500; color: var(--text-primary); text-align: left;}
        .permissions-table td { text-align: center; }
        .permissions-table tr:last-child td { border-bottom: none; }
        .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--toggle-bg-off); transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--toggle-bg-on); }
        input:checked + .slider:before { transform: translateX(20px); }
        .spinner { border: 4px solid #f3f4f6; border-top: 4px solid var(--button-primary-bg); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 2rem auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .message { margin-top: 1.5rem; padding: 0.75rem; border-radius: 6px; text-align: center; font-weight: 500; }
        .message.success { background-color: #d1fae5; color: #065f46; }
        .message.error { background-color: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="permissions-container">
        <div className="page-header">
          <h1>Role Permissions</h1>
          <button className="save-button" onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="permissions-grid-container">
          <table className="permissions-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Permission</th>
                {roles.map(role => <th key={role}>{role}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissions.map(permission => (
                <tr key={permission}>
                  <td>{formatPermissionName(permission)}</td>
                  {roles.map(role => (
                    <td key={`${role}-${permission}`}>
                      <ToggleSwitch
                        isOn={!!rolePermissions[role]?.[permission]}
                        handleToggle={() => handleToggle(role, permission)}
                        disabled={isSaving}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PermissionsPage;