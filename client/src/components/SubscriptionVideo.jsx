import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';
import { Loader2 } from 'lucide-react';

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const SubscriptionVideo = () => {
  const { user, userAuth } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  // Fetch user subscriptions
  const fetchSubscriptions = async () => {
    try {
      if (!userAuth) {
        setLoading(false);
        return [];
      }
      const response = await axios.get(
        `${backendUrl}/subscriptions/user/${user._id}/subscriptions`,
      );
      return response.data.data.map((sub) => sub._id);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscriptions.');
      return [];
    }
  };

  // Fetch videos and filter by subscriptions
  const fetchVideos = async (pageNum, subscriptionIds) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/video/`, {
        params: { page: pageNum, limit: 12 },
        headers: {
          Authorization: `Bearer ${userAuth}`
        }
      });
  
      if (response.data.success) {
        // Filter videos based on subscriptions
        const filteredVideos = response.data.data.docs.filter((video) =>
          subscriptionIds.includes(video.owner)
        );
  
        // Fetch owner details for each video in parallel
        const videosWithOwners = await Promise.all(
          filteredVideos.map(async (video) => {
            try {
              const userResponse = await axios.get(
                `${backendUrl}/users/${video.owner}`,
                {
                  headers: {
                    Authorization: `Bearer ${userAuth}`
                  }
                }
              );
              return {
                ...video,
                ownerName: userResponse.data.user.username,
                ownerAvatar: userResponse.data.user.avatar,
              };
            } catch (error) {
              console.error(`Failed to fetch owner for video ${video._id}:`, error);
              return {
                ...video,
                ownerName: "Unknown",
                ownerAvatar: null,
              };
            }
          })
        );
  
        setVideos((prevVideos) =>
          pageNum === 1 ? videosWithOwners : [...prevVideos, ...videosWithOwners]
        );
  
        setHasMore(filteredVideos.length === 12);
        setLoading(false);
      } else {
        setError(response.data.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch videos.');
      setLoading(false);
    }
  };

  // Fetch subscriptions first, then fetch videos
  useEffect(() => {
    const loadInitialData = async () => {
      const subscriptionIds = await fetchSubscriptions();
      setSubscriptions(subscriptionIds);
      
      if (subscriptionIds.length > 0) {
        fetchVideos(1, subscriptionIds);
      } else {
        setLoading(false);
      }
    };

    if (userAuth) {
      loadInitialData();
    } else {
      setLoading(false);
    }
  }, [userAuth]);

  // Load more videos
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage, subscriptions);
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Videos Grid */}
      <div className="grid gap-6 cursor-pointer grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group relative bg-gray-800/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            onClick={() => navigate(`/video-details/${video._id}`)}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h2 className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                {video.title}
              </h2>
              <div className="flex items-center mb-4 space-x-3">
                <img
                  src={video.ownerAvatar || '/placeholder.svg'}
                  alt={video.ownerName}
                  className="w-10 h-10 rounded-full ring-2 ring-blue-500/50"
                />
                <span className="text-sm text-gray-300 font-medium">
                  {video.ownerName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center my-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && subscriptions.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Load More Videos
          </button>
        </div>
      )}

      {/* No Videos State */}
      {!loading && (videos.length === 0 || subscriptions.length === 0) && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">
            {subscriptions.length === 0 
              ? "No active subscriptions" 
              : "No subscribed videos found"}
          </h2>
          <p className="text-gray-400">
            {subscriptions.length === 0
              ? "Subscribe to channels to see their videos"
              : "Check back later or subscribe to more channels"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionVideo;