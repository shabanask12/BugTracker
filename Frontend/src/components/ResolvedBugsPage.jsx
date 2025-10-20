import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- STYLES (Reusing the same styles from AssignedBugsPage) ---
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
    .custom-table { width: 100%; border-collapse: collapse; background: var(--content-bg); border-radius: 8px; box-shadow: var(--shadow); overflow: hidden; }
    .custom-table th, .custom-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border-color); }
    .custom-table thead th { background-color: #f9fafb; font-size: 12px; color: var(--text-secondary); font-weight: bold; text-transform: uppercase; }
    .spinner { border: 4px solid rgba(0, 0, 0, 0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: var(--button-primary-bg); animation: spin 1s linear infinite; margin: 2rem auto; }
    .error-message { color: #e74c3c; text-align: center; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .badge { display: inline-block; padding: 0.25em 0.75em; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; text-transform: capitalize; }
    .badge-priority-critical { background-color: #fee2e2; color: #991b1b; }
    .badge-priority-high { background-color: #ffedd5; color: #9a3412; }
    .badge-priority-normal { background-color: #dbeafe; color: #1e40af; }
    .badge-priority-low { background-color: #e0e7ff; color: #3730a3; }
    .badge-not-started, .badge-in-progress { background-color: #e5e7eb; color: #4b5563; }
    .badge-resolved { background-color: #d1fae5; color: #065f46; }
  `}</style>
);

const Badge = ({ text, type }) => <span className={`badge badge-${type}`}>{text || 'N/A'}</span>;

function ResolvedBugsPage() {
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResolvedBugs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the new API endpoint to fetch only resolved bugs
      const response = await fetch("http://localhost/BugTracker/api/bug/get_resolved_bugs.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setBugs(data.records || []);
    } catch (e) {
      setError(`Failed to fetch resolved bugs: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResolvedBugs();
  }, [fetchResolvedBugs]);

  // Define columns for the table. The status is now a static badge.
  const columns = useMemo(() => [
    { name: 'Title', key: 'title' },
    { name: 'Project', key: 'project_name' },
    { name: 'Status', key: 'status', cell: row => <Badge text={row.status} type={row.status?.toLowerCase().replace(' ', '-')} /> },
    { name: 'Priority', key: 'priority', cell: row => <Badge text={row.priority} type={`priority-${row.priority?.toLowerCase()}`} /> },
    { name: 'Assigned To', key: 'assigned_to_name', cell: row => row.assigned_to_name || 'Unassigned' },
    { name: 'Created At', key: 'created_at', cell: row => new Date(row.created_at).toLocaleDateString() },
  ], []);

  if (isLoading) return <div className="spinner"></div>;

  return (
    <>
      <StyleTag />
      <div className="bugs-page-container">
        <div className="page-header">
          <h1>Resolved Bugs</h1>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        {!error && (
            <table className="custom-table">
              <thead>
                <tr>{columns.map(col => <th key={col.key}>{col.name}</th>)}</tr>
              </thead>
              <tbody>
                {bugs.length > 0 ? (
                  bugs.map(bug => (
                    <tr key={bug.id}>
                      {columns.map(col => <td key={col.key}>{col.cell ? col.cell(bug) : bug[col.key]}</td>)}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                      No resolved bugs found.
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

export default ResolvedBugsPage;
