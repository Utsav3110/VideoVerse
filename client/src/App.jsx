import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import VideoDetails from './components/VideoDetails';
import VideoGallery from './components/VideoGallery';
import PublishVideo from './components/PublishVideo';
import Header from './components/Header';
import Chennal from './components/Chennal';
import UserContextProvider, {
  UserContext,
} from './context/UserContextProvider';
import axios from 'axios';
import WatchHistory from './components/WatchHistory';
import SubscriptionVideo from './components/SubscriptionVideo';
import UpdateVideo from './components/UpdateVideo';
import VideoUpdateForm from './components/VideoUpdateForm';

const App = () => {
  const { userAuth, setUserAuth, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_API_URL;
  axios.defaults.withCredentials = true;

  const getUserInfo = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/users/current-user`,
        null,
        {
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        setUser(response.data.user);
        setUserAuth(true);
      } else {
        setUser(null);
        setUserAuth(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log(userAuth);
    setLoading(true);
    getUserInfo().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

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
            <Route
              path="/watchHistory"
              element={userAuth ? <WatchHistory /> : <Navigate to="/login" />}
            />
            <Route
              path="/subscriptions"
              element={
                userAuth ? <SubscriptionVideo /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/video-update"
              element={userAuth ? <UpdateVideo /> : <Navigate to="/login" />}
            />
            <Route
              path="/video-update/:videoId"
              element={
                userAuth ? <VideoUpdateForm /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;


//changing for redpoly