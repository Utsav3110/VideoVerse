import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoGallery from "./VideoGallery";
import { 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Clock, 
  UserCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const backendUrl = "http://localhost:8000/api/v1";

const VideoDetails = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/video/${videoId}`);
      if (response.data.success) {
        setVideo(response.data.data);
        const ownerResponse = await axios.get(
          `${backendUrl}/users/${response.data.data.owner._id}`
        );
        setOwner(ownerResponse.data.user);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch video.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-400">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[70%] space-y-6">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              className="w-full aspect-video rounded-t-xl"
              src={video.videoFile}
            ></video>
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4 text-gray-400">
                <div className="flex items-center">
                  <Eye className="mr-2" />
                  <span>{video.views} views</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2" />
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">{video.description}</p>
              
              {owner && (
                <div onClick={() => navigate(`/chennal/${owner._id}`)} className=" cursor-pointer flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={owner.avatar}
                      alt={owner.username}
                      className="w-16 h-16 rounded-full border-4 border-blue-500"
                    />
                    <div>
                      <p className="text-xl font-semibold text-white">{owner.username}</p>
                      <p className="text-sm text-gray-400">{owner.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-400">
                    <ThumbsUp className="hover:text-blue-500 cursor-pointer" />
                    <MessageCircle className="hover:text-green-500 cursor-pointer" />
                    <Share2 className="hover:text-purple-500 cursor-pointer" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:w-[30%]">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <UserCircle className="mr-3 text-blue-500" />
            Related Videos
          </h2>
          <div className="bg-gray-800 rounded-xl p-4">
            <VideoGallery excludeVideoId={videoId}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;