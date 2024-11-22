import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContextProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const UpdateVideo = () => {
  const { userAuth } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getVideos();
  }, []);

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
    navigate(`/video-update/${videoId}`);
  };

  return (
    userAuth && (
      <div className="mt-8 mx-4 sm:mx-8 md:mx-16 bg-gray-900 p-8 rounded-lg shadow-lg text-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Your Uploaded Videos</h2>
        <p className="text-lg mb-8 text-center text-gray-400">Select a video to edit</p>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleThumbnailClick(video._id)}
              >
                <div className="overflow-hidden rounded-lg shadow-md bg-gray-800">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold truncate text-gray-100">{video.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-6">No videos uploaded yet.</p>
        )}
      </div>
    )
  );
};

export default UpdateVideo;
