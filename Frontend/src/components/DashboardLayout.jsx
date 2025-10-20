// src/components/DashboardLayout.jsx

import React from 'react';
// STEP 1: Import the Outlet component from react-router-dom
import { Outlet } from 'react-router-dom';
import MainNav from './mainnav';
import './mainnav.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <MainNav />

      <main className="main-content">
        {/*
          STEP 2: The <Outlet> component is a placeholder.
          React Router will automatically render the correct child component here
          (e.g., <CreateBug />) based on the URL.
        */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;