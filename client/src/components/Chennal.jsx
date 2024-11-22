import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider'; // Adjust the import path as needed

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export default function Channel() {
  const [channelOwner, setChannelOwner] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, userAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const { userId } = useParams();

  // Configure axios to include credentials
  axios.defaults.withCredentials = true;

  const getChannelOwnerInfo = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users/${userId}`);
      console.log(response.data);
      if (response?.data?.success) {
        setChannelOwner(response.data.user);
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Error fetching channel owner info');
    }
  };

  const getVideos = async () => {
    try {
      const response = await axios.get(`${backendUrl}/video/uploaded/${userId}`);
      if (response?.data?.success) {
        setVideos(response.data.data);
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Error fetching videos');
    }
  };

  const getSubscriptionStatus = async () => {
    try {
      if (!userAuth) return;

      const response = await axios.get(
        `${backendUrl}/subscriptions/user/${user._id}/subscriptions`
      );

      const subscriptions = response.data.data;
      setIsSubscribed(subscriptions.some(channel => channel._id === userId));
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const getSubscriberCount = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/subscriptions/channel/${userId}/subscribers`
      );
      if (response?.data?.success) {
        setSubscriberCount(response.data.data.length);
      }
    } catch (error) {
      console.error('Error fetching subscriber count:', error);
    }
  };

  const handleSubscribeToggle = async () => {
    try {
      setIsLoading(true);
      if (!userAuth) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/subscriptions/toggle/${userId}`
      );

      if (response.data.success) {
        setIsSubscribed(!isSubscribed);
        setSubscriberCount(prev => isSubscribed ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailClick = (videoId) => {
    navigate(`/video-details/${videoId}`);
  };

  useEffect(() => {

    console.log(channelOwner);
    getChannelOwnerInfo();
    getVideos();
    if (userAuth) {
      getSubscriptionStatus();
    }
    getSubscriberCount();
  }, [userId, userAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8">
          <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-700 rounded-lg overflow-hidden">
            {channelOwner?.coverImage && (
              <img
                src={channelOwner.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute left-4 -bottom-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            {channelOwner?.avatar && (
              <img
                src={channelOwner.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="ml-40 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{channelOwner?.username}</h2>
            <div className="flex items-center mt-2 text-gray-300">
              <span>{subscriberCount} subscribers</span>
            </div>
          </div>
          {user?._id !== userId && ( // Only show subscribe button if not the channel owner
            <button
              onClick={handleSubscribeToggle}
              disabled={isLoading}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                isSubscribed
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading
                ? 'Loading...'
                : isSubscribed
                ? 'Unsubscribe'
                : 'Subscribe'}
            </button>
          )}
        </div>

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
  );
}