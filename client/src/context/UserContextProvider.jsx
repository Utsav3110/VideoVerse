// UserContextProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
export const UserContext = createContext();

axios.defaults.withCredentials = true;

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAuth, setUserAuth] = useState(false);

  const backendUrl = 'http://localhost:8000/api/v1';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.post(`${backendUrl}/users/current-user`);
      if (response.data.successs) {
        setUserAuth(true);
        setUser(response.data.user);
      } else {
        setUserAuth(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    userAuth,
    setUserAuth,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
