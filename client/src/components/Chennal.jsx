import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';

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

  const getChannelOwnerInfo = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users/${userId}`);
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
      const response = await axios.get(`${backendUrl}/subscriptions/user/${user._id}/subscriptions`);
      const subscriptions = response.data.data;
      setIsSubscribed(subscriptions.some(channel => channel._id === userId));
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const getSubscriberCount = async () => {
    try {
      const response = await axios.get(`${backendUrl}/subscriptions/channel/${userId}/subscribers`);
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
      const response = await axios.post(`${backendUrl}/subscriptions/toggle/${userId}`);
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
    getChannelOwnerInfo();
    getVideos();
    if (userAuth) {
      getSubscriptionStatus();
    }
    getSubscriberCount();
  }, [userId, userAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image Section */}
        <div className="relative mb-16">
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-700 rounded-xl overflow-hidden shadow-xl">
            {channelOwner?.coverImage && (
              <img
                src={channelOwner.coverImage}
                alt="Channel Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* Avatar Positioning */}
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:left-8 lg:translate-x-0 -bottom-16 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-gray-800 overflow-hidden shadow-2xl">
            {channelOwner?.avatar && (
              <img
                src={channelOwner.avatar}
                alt="Channel Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
  
        {/* Channel Info Section */}
        <div className="lg:ml-48 text-center lg:text-left mb-12 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">{channelOwner?.username}</h2>
            <p className="text-gray-300 text-lg">{subscriberCount} subscribers</p>
          </div>
          {user?._id !== userId && (
            <button
              onClick={handleSubscribeToggle}
              disabled={isLoading}
              className={`mt-6 sm:mt-0 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out ${
                isSubscribed
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          )}
        </div>
  
        {/* Videos Section */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Uploaded Videos</h3>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
                    onClick={() => handleThumbnailClick(video._id)}
                  >
                    <div className="bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h4>
                        <p className="text-gray-400 text-sm">{video.views} views</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-lg text-center">No videos uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

