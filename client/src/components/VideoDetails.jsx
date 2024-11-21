import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoGallery from './VideoGallery';
import Comment from './Comment';
import {
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Clock,
  UserCircle,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContextProvider';

const backendUrl = 'http://localhost:8000/api/v1';

export default function VideoDetails() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user , userAuth } = useContext(UserContext);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);

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
      setError(err.message || 'Failed to fetch video.');
    } finally {
      setLoading(false);
    }
  };


  const updateWatchHistory = async () =>{

    if(!userAuth) return;

    const response = await axios.patch(`${backendUrl}/users/updateWatchHistory/${videoId}`)

    if(!response.data?.success){
      console.log(response.data?.message);
    }
  }

  const updateViwes = async () =>{
    const response = await axios.patch(`${backendUrl}/video/viwes/${videoId}`);
    if(!response.data?.success){
      console.log(response.data?.message);
    }
  }

  const fetchComments = async (page = 1) => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`${backendUrl}/comments/${videoId}`);
      if (response.data.success) {
        if (page === 1) {
          setComments(response.data.data);
        } else {
          setComments((prev) => [...prev, ...response.data.data]);
        }
        setTotalComments(response.data.meta.total);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) return;

      const response = await axios.post(`${backendUrl}/comments/${videoId}`, {
        text: newComment,
      });

      if (response.data.success) {
        setNewComment('');
        fetchComments(1);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/comments/c/${commentId}`
      );
      if (response.data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        setTotalComments((prev) => prev - 1);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const loadMoreComments = () => {
    setCommentPage((prev) => prev + 1);
    fetchComments(commentPage + 1);
  };

  useEffect(() => {
    updateViwes()
    updateWatchHistory()
    fetchVideo();
    fetchComments(1);
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
          <h2 className="text-2xl font-bold mb-4">
            Oops! Something went wrong
          </h2>
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
              <h1 className="text-3xl font-bold text-white mb-4">
                {video.title}
              </h1>

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
                <div
                  onClick={() => navigate(`/chennal/${owner._id}`)}
                  className="cursor-pointer flex items-center justify-between bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={owner.avatar}
                      alt={owner.username}
                      className="w-16 h-16 rounded-full border-4 border-blue-500"
                    />
                    <div>
                      <p className="text-xl font-semibold text-white">
                        {owner.username}
                      </p>
                      <p className="text-sm text-gray-400">{owner.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-400">
                  
                    <MessageCircle className="hover:text-green-500 cursor-pointer" />
                    <Share2 className="hover:text-purple-500 cursor-pointer" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <MessageCircle className="mr-2" />
              Comments ({totalComments})
            </h3>

            {/* Add Comment */}

            {userAuth && (
              <div className="flex gap-4 mb-8">
              
              <img
                src={user?.avatar} 
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 min-h-[80px] mb-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Comment
                </button>
              </div>
            </div>

            )
          }
            {/* Comments List */}
            <div className="space-y-6 h-screen overflow-y-auto">
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  currentUserId={video?.owner?._id}
                  videoOwnerId={video?.owner?._id}
                />
              ))}

              {comments.length < totalComments && (
                <button
                  onClick={loadMoreComments}
                  disabled={loadingComments}
                  className="w-full mt-4 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingComments ? 'Loading...' : 'Load More Comments'}
                </button>
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
            <div className="h-screen overflow-y-auto">
              <VideoGallery excludeVideoId={videoId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
