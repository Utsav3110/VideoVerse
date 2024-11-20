// App.jsx
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';
import UserContextProvider, {
  UserContext,
} from './context/UserContextProvider';
import VideoDetails from './components/VideoDetails';
import VideoGallery from './components/VideoGallery';
import PublishVideo from './components/PublishVideo';
import Header from './components/Header';
import Chennal from './components/Chennal';

const App = () => {
  const { userAuth } = useContext(UserContext);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ToastContainer theme="dark" position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<VideoGallery />} />
            <Route path="/video-details/:videoId" element={<VideoDetails />} />
            <Route path="/chennal/:userId" element={<Chennal />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={userAuth ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/publish-video"
              element={userAuth ? <PublishVideo /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
