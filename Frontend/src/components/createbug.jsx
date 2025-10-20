import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

// --- ICONS (No changes) ---
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

// --- UPDATED STYLES ---
const StyleTag = () => (
  <style>{`
    :root {
      --primary-bg: #f4f7fa; --content-bg: #ffffff; --border-color: #e5e7eb; --text-primary: #111827;
      --text-secondary: #6b7280; --button-primary-bg: #3498db; --button-primary-hover: #2980b9;
      --button-danger-bg: #e74c3c; --button-danger-hover: #c0392b;
      --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: var(--primary-bg); color: var(--text-primary); }
    .main-content { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .controls-header { padding: 1rem 1.5rem; background-color: var(--content-bg); border-radius: 8px 8px 0 0; box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap; border-bottom: 1px solid var(--border-color); }
    .filters-wrapper { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .filter-item { display: flex; flex-direction: column; }
    .filter-item label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem; }
    .filter-item input { padding: 0.6rem; border: 1px solid var(--border-color); border-radius: 6px; width: 220px; font-family: inherit; }
    .priority-tabs { display: flex; gap: 0.5rem; padding: 0.75rem 1.5rem; background-color: var(--content-bg); }
    .priority-tab-btn { padding: 0.5rem 1rem; border: 1px solid transparent; background-color: #f9fafb; color: var(--text-secondary); font-weight: 600; cursor: pointer; border-radius: 6px; transition: all 0.2s; }
    .priority-tab-btn:hover { background-color: #f3f4f6; color: var(--text-primary); }
    .priority-tab-btn.active { color: var(--button-primary-bg); background-color: #e9f5ff; border-color: var(--button-primary-bg); }
    .bug-list-container { background-color: var(--content-bg); padding: 1.5rem; border-radius: 0 0 8px 8px; box-shadow: var(--shadow); overflow-x: auto; margin-top: -1px;}
    .custom-table { width: 100%; border-collapse: collapse; }
    .custom-table th, .custom-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    .custom-table thead th { background-color: #f9fafb; font-size: 12px; color: var(--text-secondary); font-weight: bold; text-transform: uppercase; cursor: pointer; }
    .custom-table tbody tr { transition: background-color 0.2s; }
    .custom-table tbody tr:hover { background-color: #f9fafb; }
    .actions-cell { display: flex; align-items: center; gap: 15px; }
    .icon-btn { background: none; border: none; cursor: pointer; padding: 5px; margin: 0; font-size: 14px; color: var(--text-secondary); transition: all 0.2s; }
    .icon-btn:hover { transform: scale(1.1); color: var(--button-primary-bg); }
    .icon-btn.delete:hover { color: var(--button-danger-bg); }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
    .modal-content { background: var(--content-bg); padding: 2rem; border-radius: 8px; width: 800px; max-width: 90%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); position: relative; max-height: 90vh; overflow-y: auto; }
    
    /* --- NEW: Improved Close Button UI --- */
    .modal-close-button {
      position: absolute; top: 12px; right: 12px; background: #f1f5f9; border: none; border-radius: 50%;
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
    }
    .modal-close-button:hover { background: #e2e8f0; transform: rotate(90deg); }

    .form-container, .view-bug-container { width: 100%; }
    .form-container h2 { margin-top: 0; margin-bottom: 1.5rem; color: var(--text-primary); text-align: center; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 6px; font-size: 1rem; box-sizing: border-box; }
    .row { display: flex; flex-wrap: wrap; margin: 0 -10px; }
    .col-md-6 { width: 50%; padding: 0 10px; box-sizing: border-box; }
    .submit-button { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; background-color: var(--button-primary-bg); color: white; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background-color 0.2s; width: 100%; margin-top: 1rem; }
    .message { margin-top: 1rem; padding: 0.75rem; border-radius: 6px; text-align: center; font-weight: 500; }
    .message.success { background-color: #dcfce7; color: #166534; }
    .message.error { background-color: #fee2e2; color: #991b1b; }
    .badge { display: inline-block; padding: 0.25em 0.75em; border-radius: 9999px; font-weight: 600; font-size: 0.8rem; line-height: 1.5; text-transform: capitalize; }
    .badge-priority-critical { background-color: #fee2e2; color: #991b1b; } .badge-priority-high { background-color: #ffedd5; color: #9a3412; }
    .badge-priority-normal { background-color: #dbeafe; color: #1e40af; } .badge-priority-low { background-color: #e0e7ff; color: #3730a3; }
    .badge-not-started { background-color: #e5e7eb; color: #4b5563; } .badge-in-progress { background-color: #fef3c7; color: #92400e; }
    .badge-resolved { background-color: #d1fae5; color: #065f46; }
    .spinner { border: 4px solid rgba(0, 0, 0, 0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: var(--button-primary-bg); animation: spin 1s linear infinite; margin: 2rem auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* --- NEW: File Input Styles --- */
    .file-input-wrapper { border: 2px dashed var(--border-color); border-radius: 8px; padding: 1rem; text-align: center; cursor: pointer; transition: background-color 0.2s; }
    .file-input-wrapper:hover { background-color: #f9fafb; }
    .file-input-wrapper input[type="file"] { display: none; }
    .file-input-label { color: var(--text-secondary); font-weight: 500; }
    .file-name { margin-top: 0.5rem; font-weight: 600; color: var(--button-primary-bg); }

    /* --- NEW: Improved View Bug Modal UI --- */
    .view-bug-header { text-align: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
    .view-bug-header h2 { font-size: 1.8rem; color: var(--text-primary); margin: 0; }
    .view-bug-header p { font-size: 1rem; color: var(--text-secondary); margin-top: 0.25rem; }
    .view-bug-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
    .view-bug-item { background-color: #f9fafb; padding: 1rem; border-radius: 8px; }
    .view-bug-item strong { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem; }
    .view-bug-item p, .view-bug-item .badge { margin: 0; line-height: 1.5; color: #4b5563; font-size: 1rem; }
    .view-bug-item.full-width { grid-column: 1 / -1; }
  `}</style>
);

const Modal = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-button" onClick={onClose}>&times;</button>
      {children}
    </div>
  </div>
);

const Badge = ({ text, type }) => <span className={`badge badge-${type}`}>{text || 'N/A'}</span>;

// --- UPDATED: BugForm Component with File Upload ---
const BugForm = ({ bug, onFormSubmit, onCancel }) => {
  const [formDataState, setFormDataState] = useState(
    bug ? { ...bug } : {
      title: '', description: '', project_id: '', priority: 'Low', status: 'Not Started', assigned_to: ''
    }
  );
  // NEW: State to hold the selected file
  const [attachment, setAttachment] = useState(null);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, userRes] = await Promise.all([
          fetch('http://localhost/BugTracker/api/project/get_projects.php'),
          fetch('http://localhost/BugTracker/api/user/get_all_users.php')
        ]);
        const projectData = await projectRes.json();
        const userData = await userRes.json();
        setProjects(projectData.records || []);
        setUsers(userData || []);
      } catch (error) {
        setMessage('Failed to fetch projects or users.');
        setMessageType('error');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormDataState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // NEW: Handler for file input change
  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!formDataState.title.trim() || !formDataState.project_id) {
        setMessage('Bug title and project are required.');
        setMessageType('error');
        return;
    }

    // NEW: Use FormData to send file and text data
    const submissionData = new FormData();
    for (const key in formDataState) {
        submissionData.append(key, formDataState[key]);
    }
    if (attachment) {
        submissionData.append('attachment', attachment, attachment.name);
    }
    
    try {
        const url = bug ? 'http://localhost/BugTracker/api/bug/update_bug.php' : 'http://localhost/BugTracker/api/bug/create_bug.php';
        const response = await fetch(url, {
            method: 'POST',
            // IMPORTANT: Do not set Content-Type header when using FormData
            body: submissionData,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to save bug.');

        setMessage(bug ? 'Bug updated successfully!' : 'Bug created successfully!');
        setMessageType('success');
        setTimeout(onFormSubmit, 1500);
    } catch (error) {
        setMessage(error.message);
        setMessageType('error');
    }
  };

  return (
    <div className="form-container">
      <h2>{bug ? 'Edit Bug' : 'Create New Bug'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="title">Bug Title</label>
              <input type="text" id="title" name="title" value={formDataState.title} onChange={handleChange} required />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="project_id">Project</label>
              <select id="project_id" name="project_id" value={formDataState.project_id} onChange={handleChange} required >
                <option value="">Select a project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formDataState.description} onChange={handleChange} />
        </div>
        <div className="row">
          <div className="col-md-6"><div className="form-group"><label htmlFor="priority">Priority</label><select id="priority" name="priority" value={formDataState.priority} onChange={handleChange}><option>Low</option><option>Normal</option><option>High</option><option>Critical</option></select></div></div>
          <div className="col-md-6"><div className="form-group"><label htmlFor="status">Status</label><select id="status" name="status" value={formDataState.status} onChange={handleChange}><option>Not Started</option><option>In Progress</option><option>Resolved</option></select></div></div>
        </div>
        <div className="form-group">
          <label htmlFor="assigned_to">Assigned To</label>
          <select id="assigned_to" name="assigned_to" value={formDataState.assigned_to} onChange={handleChange}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.username || u.email}</option>)}
          </select>
        </div>

        {/* --- NEW: File Upload Field --- */}
        <div className="form-group">
            <label>Attach File (Optional)</label>
            <div className="file-input-wrapper" onClick={() => document.getElementById('attachment-file').click()}>
                <input type="file" id="attachment-file" name="attachment" onChange={handleFileChange} />
                {attachment ? (
                    <p className="file-name">{attachment.name}</p>
                ) : (
                    <p className="file-input-label">Click to select a file</p>
                )}
            </div>
        </div>

        <button type="submit" className="submit-button">{bug ? 'Update Bug' : 'Create Bug'}</button>
        {message && <p className={`message ${messageType}`}>{message}</p>}
      </form>
    </div>
  );
};


// --- UPDATED: Redesigned ViewBugModal Component ---
const ViewBugModal = ({ bug, onClose }) => (
  <div className="view-bug-container">
    <div className="view-bug-header">
      <h2>{bug.title}</h2>
      <p>in project: <strong>{bug.project_name || 'N/A'}</strong></p>
    </div>

    <div className="view-bug-grid">
      <div className="view-bug-item">
        <strong>Status</strong>
        <p><Badge text={bug.status} type={bug.status?.toLowerCase().replace(' ', '-')} /></p>
      </div>
      <div className="view-bug-item">
        <strong>Priority</strong>
        <p><Badge text={bug.priority} type={`priority-${bug.priority?.toLowerCase()}`} /></p>
      </div>
      <div className="view-bug-item">
        <strong>Assigned To</strong>
        <p>{bug.assigned_to_name || 'Unassigned'}</p>
      </div>
      <div className="view-bug-item">
        <strong>Created On</strong>
        <p>{new Date(bug.created_at).toLocaleDateString()}</p>
      </div>
      <div className="view-bug-item full-width">
        <strong>Description</strong>
        <p>{bug.description || 'No description provided.'}</p>
      </div>
    </div>
  </div>
);


// --- NO CHANGES to the components below ---

const ConfirmDeleteModal = ({ bug, onConfirm, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(bug.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <div className="confirm-dialog">
      <h3>Confirm Deletion</h3>
      <p>
        Are you sure you want to delete bug <strong>{bug.title}</strong>? This action cannot be undone.
      </p>
      <div className="confirm-dialog-actions">
        <button className="cancel-btn" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </button>
        <button className="confirm-btn" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

const SimpleDataTable = ({ columns, data, onRowClick, onEdit, onDelete, hasPermission }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (e, row) => {
    if (e.target.closest('.actions-cell')) {
      return;
    }
    onRowClick(row);
  };

  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} onClick={() => col.sortable && requestSort(col.key)}>
              {col.name}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.length > 0 ? (
          sortedData.map((row) => (
            <tr key={row.id} onClick={(e) => handleRowClick(e, row)} style={{ cursor: 'pointer' }}>
              {columns.map((col) => (
                <td key={col.key}>{col.cell ? col.cell(row) : row[col.key]}</td>
              ))}
              <td className="actions-cell">
                {hasPermission('edit_bug') && (
                  <button className="icon-btn" title="Edit" onClick={() => onEdit(row)}>
                    <PencilIcon />
                  </button>
                )}
                {hasPermission('delete_bug') && (
                  <button className="icon-btn delete" title="Delete" onClick={() => onDelete(row)}>
                    <TrashIcon />
                  </button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '2rem' }}>
              No bugs match your filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

function CreateBugPage() {
  const { hasPermission, authLoading, currentUser, setPermissions } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchBugs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost/BugTracker/api/bug/get_bugs.php');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setBugs(data.records || []);
    } catch (e) {
      setError(`Failed to fetch bugs: ${e.message}.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const refreshPermissions = async () => {
      if (currentUser?.role) {
        try {
          const response = await fetch(
            `http://localhost/BugTracker/api/permissions/get_by_role.php?role=${encodeURIComponent(currentUser.role.toLowerCase())}`
          );
          if (response.ok) {
            const data = await response.json();
            setPermissions(data);
          }
        } catch (error) {
          console.error('Failed to refresh permissions:', error);
        }
      }
    };
    refreshPermissions();
    fetchBugs();
  }, [fetchBugs, currentUser, setPermissions]);

  const closeModal = () => setModal({ type: null, data: null });
  const refreshAndClose = () => {
    closeModal();
    fetchBugs();
  };

  const handleDelete = async (bugId) => {
    try {
      const response = await fetch('http://localhost/BugTracker/api/bug/delete_bug.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bugId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete bug.');
      refreshAndClose();
    } catch (error) {
      alert(`Error: ${error.message}`);
      closeModal();
    }
  };

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      const searchMatch =
        searchQuery.toLowerCase() === '' ||
        bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bug.project_name && bug.project_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (bug.assigned_to_name && bug.assigned_to_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const dateMatch =
        (!startDate || new Date(bug.created_at) >= new Date(startDate)) &&
        (!endDate || new Date(bug.created_at) <= new Date(endDate).setHours(23, 59, 59, 999));

      const priorityMatch = priorityFilter === 'All' || bug.priority === priorityFilter;

      return searchMatch && dateMatch && priorityMatch;
    });
  }, [bugs, searchQuery, startDate, endDate, priorityFilter]);

  const columns = [
    { name: 'Title', key: 'title', sortable: true },
    { name: 'Project', key: 'project_name', sortable: true },
    {
      name: 'Status',
      key: 'status',
      sortable: true,
      cell: (row) => <Badge text={row.status} type={row.status?.toLowerCase().replace(' ', '-')} />,
    },
    {
      name: 'Priority',
      key: 'priority',
      sortable: true,
      cell: (row) => <Badge text={row.priority} type={`priority-${row.priority?.toLowerCase()}`} />,
    },
    {
      name: 'Assigned To',
      key: 'assigned_to_name',
      sortable: true,
      cell: (row) => row.assigned_to_name || 'Unassigned',
    },
    {
      name: 'Created At',
      key: 'created_at',
      sortable: true,
      cell: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const priorities = ['All', 'Low', 'Normal', 'High', 'Critical'];

  const renderModal = () => {
    const { type, data } = modal;
    switch (type) {
      case 'create':
        return (
          <Modal onClose={closeModal}>
            <BugForm onFormSubmit={refreshAndClose} onCancel={closeModal} />
          </Modal>
        );
      case 'edit':
        return (
          <Modal onClose={closeModal}>
            <BugForm bug={data} onFormSubmit={refreshAndClose} onCancel={closeModal} />
          </Modal>
        );
      case 'view':
        return <Modal onClose={closeModal}><ViewBugModal bug={data} onClose={closeModal} /></Modal>;
      case 'delete':
        return (
          <Modal onClose={closeModal}>
            <ConfirmDeleteModal bug={data} onConfirm={handleDelete} onCancel={closeModal} />
          </Modal>
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <main className="main-content">
        <div className="spinner"></div>
      </main>
    );
  }

  return (
    <>
      <StyleTag />
      <main className="main-content">
        {renderModal()}
        <div className="controls-header">
          <div className="filters-wrapper">
            <div className="filter-item">
              <label htmlFor="search-filter">Search</label>
              <input
                id="search-filter"
                type="text"
                placeholder="Search title, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Created From</label>
              <input
                type="date"
                className="date-filter-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Created To</label>
              <input
                type="date"
                className="date-filter-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>
          {hasPermission('create_bug') && (
            <button
              className="create-bug-button"
              onClick={() => setModal({ type: 'create', data: null })}
            >
              + New Bug
            </button>
          )}
        </div>

        <div className="priority-tabs">
          {priorities.map((p) => (
            <button
              key={p}
              className={`priority-tab-btn ${priorityFilter === p ? 'active' : ''}`}
              onClick={() => setPriorityFilter(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="bug-list-container">
          {isLoading && <div className="spinner"></div>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && (
            <SimpleDataTable
              columns={columns}
              data={filteredBugs}
              onRowClick={(bug) => setModal({ type: 'view', data: bug })}
              onEdit={(bug) => setModal({ type: 'edit', data: bug })}
              onDelete={(bug) => setModal({ type: 'delete', data: bug })}
              hasPermission={hasPermission}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default CreateBugPage;