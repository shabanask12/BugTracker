// src/components/mainnav.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUsersCog, FaKey, FaPlusCircle, FaTasks, 
  FaCheckCircle, FaProjectDiagram, FaUserCircle, FaSignOutAlt, FaBars 
} from 'react-icons/fa';
import './mainnav.css';

const MainNav = () => {
  const [currentUser, setCurrentUser] = useState(null);
  // The sidebar is open on desktop and closed on mobile by default.
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  // Get current user from session storage
  useEffect(() => {
    const userString = sessionStorage.getItem('loggedInUser');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  // Handles window resize to show/hide sidebar appropriately
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    setCurrentUser(null);
    navigate('/login');
  };
  
  // Closes the sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
    }
  };
  
  // Toggles the sidebar's visibility on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <>
      <button className="hamburger-menu" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Bug Tracker</h3>
        </div>
        
        <nav className="sidebar-nav">
          <ul onClick={handleLinkClick}>
            <li>
              <NavLink to="/dashboard" end>
                <FaTachometerAlt /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/Roles">
                <FaUsersCog /> User Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/permission">
                <FaKey /> Permissions
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/create">
                <FaPlusCircle /> Create Bug
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/assigned">
                <FaTasks /> Assigned Bugs
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/resolved">
                <FaCheckCircle /> Resolved Bugs
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/project">
                <FaProjectDiagram /> Projects
              </NavLink>
            </li>
        
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          {currentUser && (
            <div className="user-profile">
              <FaUserCircle className="icon" />
              <span className="username">{currentUser.username}</span>
            </div>
          )}
          <a href="/login" onClick={handleLogout} className="logout-link">
            <FaSignOutAlt /> Logout
          </a>
        </div>
      </aside>
    </>
  );
};

export default MainNav;

