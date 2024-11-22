import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Search, Play, Eye, Calendar, Loader2 } from "lucide-react";

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const VideoGallery = ({ excludeVideoId = null }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isBigScreenWithVideoDetails, setIsBigScreenWithVideoDetails] = useState(false);

  useEffect(() => {
    if (excludeVideoId) {
      setIsBigScreenWithVideoDetails(true);
    }
  }, [excludeVideoId]);

  const fetchVideos = async (pageNum, search = "") => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/video/`, {
        params: { page: pageNum, limit: 12, search },
      });
      if (response.data.success) {
        const videoData = response.data.data.docs.filter(
          (video) => video._id !== excludeVideoId
        ) || [];

        const videosWithOwners = await Promise.all(
          videoData.map(async (video) => {
            try {
              const userResponse = await axios.get(
                `${backendUrl}/users/${video.owner}`
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

        setVideos((prevVideos) =>
          pageNum === 1 ? videosWithOwners : [...prevVideos, ...videosWithOwners]
        );
        setHasMore(videosWithOwners.length === 12);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1, searchTerm);
  }, [searchTerm, excludeVideoId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage, searchTerm);
    }
  };

  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
    setPage(1);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-xl shadow-2xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-400">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 flex items-center">
            <Play className="mr-4 text-blue-500" />
            Video Gallery
          </h1>

          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search videos..."
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm border border-gray-700/50"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Video Grid */}
        <div
          className={`grid gap-6 cursor-pointer ${
            isBigScreenWithVideoDetails
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center my-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Load More Button */}
        {!loading && hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Load More Videos
            </button>
          </div>
        )}

        {/* No Videos State */}
        {!loading && !hasMore && videos.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">
              No videos found
            </h2>
            <p className="text-gray-400">
              Try adjusting your search or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;