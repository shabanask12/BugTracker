import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- STYLES ---
const StyleTag = () => (
  <style>{`
    :root {
      --primary-bg: #f4f7fa; --content-bg: #ffffff; --border-color: #e5e7eb; --text-primary: #111827;
      --text-secondary: #6b7280; --button-primary-bg: #3498db; --button-primary-hover: #2980b9;
      --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .bugs-page-container { padding: 2rem; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { margin-top: 0; }
    
    .admin-filters {
        display: flex;
        align-items: flex-end;
        gap: 1.5rem;
        padding: 1rem;
        background-color: var(--content-bg);
        border-radius: 8px;
        margin-bottom: 1.5rem;
        box-shadow: var(--shadow);
    }
    .filter-group { display: flex; flex-direction: column; }
    .filter-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem; }
    .filter-group select { padding: 0.6rem; border: 1px solid var(--border-color); border-radius: 6px; width: 250px; background-color: #fff; }

    .refresh-button {
        background-color: transparent; border: 1px solid var(--border-color); padding: 0.5rem;
        border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        height: 38px; width: 38px; transition: background-color 0.2s, border-color 0.2s;
    }
    .refresh-button:hover { background-color: #f9fafb; border-color: #d1d5db; }
    .refresh-button svg { width: 18px; height: 18px; color: var(--text-secondary); transition: transform 0.5s; }
    .refresh-button.refreshing svg { animation: spin 1s linear infinite; }

    .custom-table { width: 100%; border-collapse: collapse; background: var(--content-bg); border-radius: 8px; box-shadow: var(--shadow); overflow: hidden; }
    .custom-table th, .custom-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    .custom-table thead th { background-color: #f9fafb; font-size: 12px; color: var(--text-secondary); font-weight: bold; text-transform: uppercase; }
    .spinner { border: 4px solid rgba(0, 0, 0, 0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: var(--button-primary-bg); animation: spin 1s linear infinite; margin: 2rem auto; }
    .error-message { color: #e74c3c; text-align: center; padding: 1rem; background-color: #fee2e2; border-radius: 8px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .badge { display: inline-block; padding: 0.25em 0.75em; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; text-transform: capitalize; }
    .badge-priority-critical { background-color: #fee2e2; color: #991b1b; }
    .badge-priority-high { background-color: #ffedd5; color: #9a3412; }
    .badge-priority-normal { background-color: #dbeafe; color: #1e40af; }
    .badge-priority-low { background-color: #e0e7ff; color: #3730a3; }
    
    /* --- Styles for the new Status Dropdown --- */
    .status-dropdown {
        padding: 0.4rem 0.6rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background-color: #fff;
        cursor: pointer;
        width: 100%;
        max-width: 150px;
    }
    .status-dropdown:focus {
        outline: 2px solid var(--button-primary-bg);
        border-color: var(--button-primary-bg);
    }
    .status-dropdown.not-started { border-left: 4px solid #6b7280; }
    .status-dropdown.in-progress { border-left: 4px solid #d97706; }
    .status-dropdown.resolved { border-left: 4px solid #059669; }
  `}</style>
);

const Badge = ({ text, type }) => <span className={`badge badge-${type}`}>{text || 'N/A'}</span>;

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M2.985 19.644L6.166 16.46M21.015 10.356L17.834 13.54m0 0a8.25 8.25 0 01-11.664 0M17.834 13.54l-3.181-3.182" />
    </svg>
);

function AssignedBugsPage() {
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  const currentUser = useMemo(() => {
    const userString = sessionStorage.getItem('loggedInUser');
    return userString ? JSON.parse(userString) : null;
  }, []);

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setIsRefreshing(true);
    setError(null);
    
    try {
      const cacheBust = `_=${new Date().getTime()}`;
      let bugsUrl;

      if (isAdmin) {
        bugsUrl = `http://localhost/BugTracker/api/bug/get_bugs.php?${cacheBust}`;
        const [projectsRes, usersRes] = await Promise.all([
          fetch(`http://localhost/BugTracker/api/project/get_projects.php?${cacheBust}`),
          fetch(`http://localhost/BugTracker/api/user/get_all_users.php?${cacheBust}`)
        ]);
        const projectsData = await projectsRes.json();
        const usersData = await usersRes.json();
        setProjects(projectsData.records || []);
        setUsers(usersData || []);
      } else if (currentUser) {
        bugsUrl = `http://localhost/BugTracker/api/bug/get_assigned_bugs.php?user_id=${currentUser.id}&${cacheBust}`;
      } else {
        setBugs([]);
        throw new Error("No user is logged in.");
      }

      const bugsRes = await fetch(bugsUrl);
      if (!bugsRes.ok) throw new Error(`HTTP error! Status: ${bugsRes.status}`);
      const bugsData = await bugsRes.json();
      setBugs(bugsData.records || []);

    } catch (e) {
      setError(`Failed to fetch data: ${e.message}`);
    } finally {
      if (!isRefresh) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ HANDLER to update bug status
  const handleStatusChange = useCallback(async (bugId, newStatus) => {
    const originalBugs = [...bugs];
    // Update UI immediately for better UX
    const updatedBugs = bugs.map(bug => 
        bug.id === bugId ? { ...bug, status: newStatus } : bug
    );
    setBugs(updatedBugs);

    try {
        const response = await fetch("http://localhost/BugTracker/api/bug/update_bug_status.php", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: bugId, status: newStatus }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update status.');
        }
    } catch (error) {
        console.error("Error updating status:", error);
        // If API call fails, revert the change in the UI
        setBugs(originalBugs);
        setError(`Failed to update status: ${error.message}`);
    }
  }, [bugs]);

  const filteredBugs = useMemo(() => {
    if (!isAdmin) return bugs;
    return bugs.filter(bug => {
      const projectMatch = selectedProject === 'all' || bug.project_id === parseInt(selectedProject, 10);
      let userMatch = true;
      if (selectedUser !== 'all') {
        if (selectedUser === 'unassigned') userMatch = !bug.assigned_to; 
        else userMatch = bug.assigned_to === parseInt(selectedUser, 10);
      }
      return projectMatch && userMatch;
    });
  }, [bugs, isAdmin, selectedProject, selectedUser]);
  
  const handleRefresh = () => {
    setSelectedProject('all');
    setSelectedUser('all');
    fetchData(true);
  };

  // ✅ UPDATED columns to use a dropdown for the status
  const columns = useMemo(() => [
    { name: 'Title', key: 'title' },
    { name: 'Project', key: 'project_name' },
    { 
      name: 'Status', 
      key: 'status', 
      cell: (row) => {
        const statusClass = row.status?.toLowerCase().replace(' ', '-') || 'not-started';
        return (
            <select
                value={row.status}
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent row click event when interacting with dropdown
                className={`status-dropdown ${statusClass}`}
            >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select>
        );
      }
    },
    { name: 'Priority', key: 'priority', cell: row => <Badge text={row.priority} type={`priority-${row.priority?.toLowerCase()}`} /> },
    { name: 'Assigned To', key: 'assigned_to_name', cell: row => row.assigned_to_name || 'Unassigned' },
    { name: 'Created At', key: 'created_at', cell: row => new Date(row.created_at).toLocaleDateString() },
  ], [handleStatusChange]);

  if (isLoading) return <div className="spinner"></div>;

  return (
    <>
      <StyleTag />
      <div className="bugs-page-container">
        <div className="page-header">
          <h1>{isAdmin ? 'All Bugs (Admin View)' : 'My Assigned Bugs'}</h1>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        {isAdmin && !error && (
          <div className="admin-filters">
            <div className="filter-group">
              <label htmlFor="project-filter">Filter by Project</label>
              <select id="project-filter" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                <option value="all">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="user-filter">Filter by User</label>
              <select id="user-filter" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="all">All Users</option>
                <option value="unassigned">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <button 
              className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              title="Refresh Data and Reset Filters"
              disabled={isRefreshing}
            >
              <RefreshIcon />
            </button>
          </div>
        )}

        {!error && (
            <table className="custom-table">
              <thead>
                <tr>{columns.map(col => <th key={col.key}>{col.name}</th>)}</tr>
              </thead>
              <tbody>
                {filteredBugs.length > 0 ? (
                  filteredBugs.map(bug => (
                    <tr key={bug.id}>
                      {columns.map(col => <td key={col.key}>{col.cell ? col.cell(bug) : bug[col.key]}</td>)}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                      {isAdmin ? 'No bugs match the current filters.' : 'You have no bugs assigned to you.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        )}
      </div>
    </>
  );
}

export default AssignedBugsPage;
