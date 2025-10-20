import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import your page/layout components
import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './components/DashboardLayout';
import BugManagementPage from './components/createbug'; // Using a more descriptive name
import ProjectManagementPage from './components/ProjectManagementPage';
import UserManagementPage from './components/UserManagementPage'; 
import AssignedBugsPage from './components/AssignedBugsPage'; 
import ResolvedBugsPage from './components/ResolvedBugsPage';
import DashboardPage from './components/DashboardPage';
import PermissionsPage from './components/PermissionsPage';

// A simple component for pages that are not ready yet

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes for Login and Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* This is the main layout route for the entire dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* These are the "child" routes that will be rendered inside the <Outlet> */}

          {/* When the URL is exactly "/dashboard", show the new DashboardPage */}
          <Route index element={<DashboardPage />} />

          {/* When the URL is "/dashboard/create", show the BugManagementPage component */}
          <Route path="create" element={<BugManagementPage />} />
       
          <Route path="Roles" element={<UserManagementPage />} />
          
          {/* All other dashboard pages */}
         <Route path="assigned" element={<AssignedBugsPage />} />
          <Route path="resolved" element={<ResolvedBugsPage />} />
          <Route path="permission" element={<PermissionsPage />} />
          <Route path="project" element={<ProjectManagementPage />} />
        </Route>

        {/* Redirects the user from the base URL "/" to the "/login" page */}
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

