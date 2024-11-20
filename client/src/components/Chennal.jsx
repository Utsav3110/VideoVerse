import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const backendUrl = 'http://localhost:8000/api/v1';

export default function Chennal() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams(); // Assuming userId is passed as a route param

  const getUserInfo = async () => {
    try {
    
      const response = await axios.get(`${backendUrl}/users/${userId}`);
     
      if (response?.data?.success) {
    
        setUser(response.data.user);
      } else {
        console.error('Failed to fetch user information');
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Error fetching user info');
    }
  };

  const getVideos = async () => {
    try {
      const response = await axios.get(`${backendUrl}/video/uploaded/${userId}`);
      if (response?.data?.success) {
        setVideos(response.data.data);
      } else {
        console.error('Failed to fetch videos');
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Error fetching videos');
    }
  };

  const handleThumbnailClick = (videoId) => {
    navigate(`/video-details/${videoId}`);
  };

  useEffect(() => {
    getUserInfo();
    getVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8">
          <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-700 rounded-lg overflow-hidden">
            {user?.coverImage && (
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute left-4 -bottom-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="ml-40 mb-8">
          <h2 className="text-3xl font-bold">{user?.username}</h2>
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
