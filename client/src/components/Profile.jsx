import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;


export default function Profile() {
  const { user, setUser, userAuth, setUserAuth } = useContext(UserContext);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSubscriberCount();
  }, []);

  const getSubscriberCount = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/subscriptions/channel/${user._id}/subscribers`
      );
      if (response?.data?.success) {
        setSubscriberCount(response.data.data.length);
      }
    } catch (error) {
      console.error('Error fetching subscriber count:', error);
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleFileChange = (e, setter) => setter(e.target.files[0]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      if (passwordData.oldPassword && passwordData.newPassword) {
        await axios.post(`${backendUrl}/users/change-password`, passwordData);
        toast.success('Password updated successfully');
      }

      if (avatar) {
        const avatarData = new FormData();
        avatarData.append('avatar', avatar);
        await axios.patch(`${backendUrl}/users/change-avatar`, avatarData);
      }

      if (coverImage) {
        const coverData = new FormData();
        coverData.append('coverImage', coverImage);
        await axios.patch(`${backendUrl}/users/change-cover-image`, coverData);
      }

      toast.success('Profile updated successfully');
      setIsEditing(false);
      getUserInfo();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/users/logout`);
      toast.success('Logged out successfully');
      setUser(null);
      setUserAuth(false);
      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.post(`${backendUrl}/users/current-user`);
      if (response?.data?.success) {
        setUser(response.data.user);
        setUserAuth(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching user info');
    }
  };

  const getVideos = async () => {
    try {
      const response = await axios.post(`${backendUrl}/video/uploaded`);
      if (response?.data?.success) {
        setVideos(response.data.data);
      } else {
        toast.error('Failed to fetch videos');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching videos');
    }
  };

  const handleThumbnailClick = (videoId) => {
    navigate(`/video-details/${videoId}`);
  };

  useEffect(() => {
    getUserInfo();
    getVideos();
  }, [user]);

  return userAuth ? (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Cover Image Section */}
        <div className="relative mb-20 md:mb-24">
          <div className="w-full h-32 sm:h-48 md:h-64 lg:h-80 bg-gray-700 rounded-lg overflow-hidden">
            {user?.coverImage && (
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* Avatar Section */}
          <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2 md:left-8 md:transform-none w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-700">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* User Info Section */}
        <div className="px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-8">
            {/* Username and Full Name */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold">{user?.username}</h2>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                {user?.fullName}
              </p>
            </div>

            {/* Subscriber Count */}
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <span className="text-lg font-semibold">{subscriberCount}</span>
                <span className="text-gray-400 text-sm">subscribers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information and Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Profile Information Section */}
          <div className="col-span-1 md:col-span-2 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Current Password
                  </label>
                  <input
                    id="oldPassword"
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-400"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Update Avatar
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    onChange={(e) => handleFileChange(e, setAvatar)}
                    className="mt-1 block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="coverImage"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Update Cover Image
                  </label>
                  <input
                    id="coverImage"
                    type="file"
                    onChange={(e) => handleFileChange(e, setCoverImage)}
                    className="mt-1 block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSaveChanges}
                    className="w-full sm:w-1/2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="w-full sm:w-1/2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Account Actions Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/watchHistory')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Watch History
              </button>
              <button
                onClick={() => navigate('/video-update')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Edit Video
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Uploaded Videos Section */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Uploaded Videos</h3>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleThumbnailClick(video._id)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-auto rounded-lg"
                  />
                  <h4 className="mt-2 font-semibold">{video.title}</h4>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No videos uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-red-600 flex justify-center">Please Login Again</div>
  );
}