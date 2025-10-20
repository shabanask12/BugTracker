import React, { useState, useEffect } from 'react'; // Restored useState and useEffect
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// --- ICONS (No changes needed here) ---
const BugIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 01-3 5.197z" /></svg>;
const ResolvedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


// --- UI ENHANCEMENTS & STYLES ---
const StyleTag = () => (
    <style>{`
        /* Added Google Font 'Inter' for a modern, readable UI */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
            /* Refined Color Palette */
            --bg-color: #f8fafc; /* Lighter, cleaner background */
            --card-bg: #ffffff;
            --border-color: #e5e7eb;
            --text-primary: #111827; /* Darker for better contrast */
            --text-secondary: #6b7280;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

            /* Semantic Colors for Icons & Charts */
            --blue: #3b82f6; --blue-light: #eff6ff;
            --green: #22c55e; --green-light: #f0fdf4;
            --amber: #f59e0b; --amber-light: #fffbeb;
            --purple: #8b5cf6; --purple-light: #faf5ff;
            --red: #ef4444;
            --orange: #f97316;
        }
        
        .dashboard-container {
            padding: 2.5rem; /* Increased padding for more breathing room */
            background-color: var(--bg-color);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
             margin-left: 120px;
        }

        .dashboard-header {
            margin-bottom: 2.5rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1rem;
        }
        .dashboard-header h1 {
            color: var(--text-primary);
            font-size: 1.875rem; /* Slightly smaller for balance */
            font-weight: 700;
            line-height: 1.2;
        }
        .dashboard-header p {
            color: var(--text-secondary);
            font-size: 1rem;
            margin-top: 0.25rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }
        @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr; } }
        
        .stat-card {
            background-color: var(--card-bg);
            padding: 1.5rem;
            border-radius: 0.75rem; /* Softer radius */
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 1.25rem;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }

        .stat-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 0.5rem; /* Squircle shape */
        }
        /* Color-coded icon backgrounds */
        .icon-bg-blue { background-color: var(--blue-light); color: var(--blue); }
        .icon-bg-purple { background-color: var(--purple-light); color: var(--purple); }
        .icon-bg-amber { background-color: var(--amber-light); color: var(--amber); }
        .icon-bg-green { background-color: var(--green-light); color: var(--green); }

        .stat-info .stat-value {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
            line-height: 1;
        }
        .stat-info .stat-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            margin: 0 0 0.5rem 0;
        }
        .stat-info .stat-subtitle {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0.5rem 0 0 0;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr; /* Prioritize the first chart */
            gap: 1.5rem;
        }
        .span-2 { grid-column: span 2 / span 2; }
        @media (max-width: 1024px) { 
          .charts-grid { grid-template-columns: 1fr; } 
          .span-2 { grid-column: span 1 / span 1; }
        }

        .chart-card {
            background-color: var(--card-bg);
            padding: 1.5rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow);
        }
        .chart-title {
            text-align: left; /* Align to the left for a cleaner look */
            margin-top: 0;
            margin-bottom: 2rem; /* More space for the chart */
            color: var(--text-primary);
            font-weight: 600;
            font-size: 1.125rem;
        }
        /* Minimalist chart axes and tooltips */
        .recharts-cartesian-axis-tick-value { font-size: 0.75rem; fill: var(--text-secondary); }
        .recharts-tooltip-wrapper {
            border: 1px solid var(--border-color) !important;
            border-radius: 0.5rem !important;
            box-shadow: var(--shadow) !important;
        }

        .spinner { border: 5px solid #e0e7ff; width: 50px; height: 50px; border-radius: 50%; border-top-color: var(--blue); animation: spin 1s linear infinite; margin: 5rem auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .error-message { color: var(--red); text-align: center; padding: 2rem; background-color: #fff1f2; border-radius: 8px; }
    `}</style>
);


// --- Reusable Components ---
const StatCard = ({ icon, iconBgClass, title, value, subtitle }) => (
    <div className="stat-card">
        <div className={`stat-icon ${iconBgClass}`}>{icon}</div>
        <div className="stat-info">
            <h3 className="stat-title">{title}</h3>
            <p className="stat-value">{value}</p>
            {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>
    </div>
);

// --- Main Dashboard Component ---
function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost/BugTracker/api/dashboard/get_dashboard_stats.php");
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                const data = await response.json();
                setStats(data);
            } catch (e) {
                setError(`Failed to fetch dashboard data: ${e.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="spinner"></div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!stats) return <div className="error-message">No data available.</div>;

    // --- Data & Colors for Charts ---
    const bugPriorityData = stats.bugPriorityStats.map(p => ({ name: p.priority, value: parseInt(p.count, 10) }));
    const priorityColors = { 'Critical': 'var(--red)', 'High': 'var(--orange)', 'Normal': 'var(--blue)', 'Low': 'var(--purple)' };
    
    const bugStatusData = [
        { name: 'Not Started', value: stats.bugStats['Not Started'] },
        { name: 'In Progress', value: stats.bugStats['In Progress'] },
        { name: 'Resolved', value: stats.bugStats.Resolved },
    ];
    const bugStatusColors = ['var(--amber)', 'var(--blue)', 'var(--green)'];
    
    const userRoleData = stats.userRoleStats.map(role => ({ name: role.role, Users: parseInt(role.count, 10) }));

    return (
        <>
            <StyleTag />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>An overview of project statuses, bugs, and user activity.</p>
                </div>
                
                <div className="stats-grid">
                    <StatCard icon={<BugIcon />} iconBgClass="icon-bg-amber" title="Total Bugs" value={stats.bugStats.total} />
                    <StatCard icon={<ProjectIcon />} iconBgClass="icon-bg-purple" title="Total Projects" value={stats.projectStats.total} />
                    <StatCard icon={<ResolvedIcon />} iconBgClass="icon-bg-green" title="Bugs Resolved" value={stats.bugStats.Resolved} subtitle={`${Math.round((stats.bugStats.Resolved / stats.bugStats.total) * 100)}% resolved`} />
                    <StatCard icon={<UsersIcon />} iconBgClass="icon-bg-blue" title="Active Users" value={stats.userStatusStats.Active} subtitle={`out of ${stats.userStatusStats.total} total`} />
                </div>

                <div className="charts-grid">
                    <div className="chart-card span-2">
                        <h2 className="chart-title">Users by Role</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userRoleData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="var(--border-color)" tickLine={false} />
                                <YAxis stroke="var(--border-color)" tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'var(--bg-color)' }} contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '0.5rem' }}/>
                                <Bar dataKey="Users" fill="var(--blue)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h2 className="chart-title">Bug Priority</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={bugPriorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} labelLine={false}>
                                    {bugPriorityData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={priorityColors[entry.name]} />
                                    ))}
                                    <Label value={`${stats.bugStats.total} Bugs`} position="center" fill="var(--text-secondary)" fontSize="1rem" />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '0.5rem' }}/>
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h2 className="chart-title">Bug Status</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={bugStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {bugStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={bugStatusColors[index]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '0.5rem' }}/>
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;