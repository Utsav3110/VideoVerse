import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Play, Eye, Calendar } from "lucide-react";
import { UserContext } from "../context/UserContextProvider";


const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const WatchHistory = () => {
  const { user } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Fetch video details based on watch history
  const fetchWatchHistoryVideos = async () => {
    if (!user?.watchHistory?.length) return;
    setLoading(true);
    try {
      const response = await Promise.all(
        user.watchHistory.map((videoId) =>
          axios.get(`${backendUrl}/video/${videoId}`).catch(() => null)
        )
      );
      const videoData = response
        .filter((res) => res?.data?.success) // Filter successful responses
        .map((res) => res.data.data);

      // Add owner details for videos
      const videosWithOwners = await Promise.all(
        videoData.map(async (video) => {
          try {

            const userResponse = await axios.get(
              `${backendUrl}/users/${video.owner._id}`
            );
            return {
              ...video,
              ownerName: userResponse.data.user.username,
              ownerAvatar: userResponse.data.user.avatar,
            };
          } catch {
            return {
              ...video,
              ownerName: "Unknown",
              ownerAvatar: null,
            };
          }
        })
      );

      setVideos(videosWithOwners);
    } catch (err) {
      setError("Failed to fetch watch history videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchHistoryVideos();
  }, [user?.watchHistory]);

  if (loading) return <div className=" text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 flex items-center">
            <Play className="mr-4 text-blue-500 size-10" />
            Watch History
          </h1>

    <div
      className={`grid gap-6 cursor-pointer ${
        videos.length > 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {videos.map((video, index) => (
        <div
          key={`video._id-${index}`}
          className="group relative bg-gray-800/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
          onClick={() => navigate(`/video-details/${video._id}`)}
        >
          <div className="aspect-video relative overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500/80 backdrop-blur-sm">
                  <Play className="text-white w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2
              className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300"
              title={video.title}
            >
              {video.title}
            </h2>

            <div className="flex items-center mb-4 space-x-3">
              <img
                src={video.ownerAvatar || "/placeholder.svg"}
                alt={video.ownerName}
                className="w-10 h-10 rounded-full ring-2 ring-blue-500/50"
              />
              <span className="text-sm text-gray-300 font-medium">
                {video.ownerName}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default WatchHistory;
