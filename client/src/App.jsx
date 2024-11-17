import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';
import UserContextProvider from './context/UserContextProvider';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
     
     <UserContextProvider>
      <div>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Home /> } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </div>
      </UserContextProvider>
    
    </Router>
  );
};

export default App;
