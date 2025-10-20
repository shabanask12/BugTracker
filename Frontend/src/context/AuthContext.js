import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const userString = sessionStorage.getItem('loggedInUser');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user);

      if (user.role) {
        // Send the role to the API in lowercase
        fetch(`http://localhost/BugTracker/api/permissions/get_by_role.php?role=${encodeURIComponent(user.role.toLowerCase())}`)
          .then(res => res.json())
          .then(data => {
            setPermissions(data);
          })
          .catch(error => {
            console.error("Failed to fetch permissions:", error);
            setPermissions([]); // Fallback to empty permissions
          })
          .finally(() => setAuthLoading(false));
      } else {
        setAuthLoading(false);
      }
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Debug log for permissions updates
  useEffect(() => {
    console.log('Permissions updated:', permissions);
  }, [permissions]);

  const hasPermission = (permissionName) => {
    return permissions.includes(permissionName);
  };

  const value = {
    currentUser,
    setCurrentUser,
    permissions,
    setPermissions,
    hasPermission,
    authLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};