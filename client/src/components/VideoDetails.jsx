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
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

axios.defaults.withCredentials = true;

export default function VideoDetails() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, userAuth } = useContext(UserContext);

  // Subscription states
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);

  // Configure axios
  axios.defaults.withCredentials = true;

  const getSubscriptionStatus = async (ownerId) => {
    try {
      if (!userAuth || !ownerId) return;

      const response = await axios.get(
        `${backendUrl}/subscriptions/user/${user._id}/subscriptions`
      );

      const subscriptions = response.data.data;
      setIsSubscribed(subscriptions.some((channel) => channel._id === ownerId));
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const getSubscriberCount = async (ownerId) => {
    try {
      if (!ownerId) return;

      const response = await axios.get(
        `${backendUrl}/subscriptions/channel/${ownerId}/subscribers`
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
      setIsLoadingSubscription(true);
      if (!userAuth) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/subscriptions/toggle/${owner._id}`
      );

      if (response.data.success) {
        setIsSubscribed(!isSubscribed);
        setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setIsLoadingSubscription(false);
    }
  };

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
        // Get subscription info after setting owner
        if (userAuth) {
          await getSubscriptionStatus(ownerResponse.data.user._id);
        }
        await getSubscriberCount(ownerResponse.data.user._id);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch video.');
    } finally {
      setLoading(false);
    }
  };

  const copyUrlToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success('URL copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy: ', err);
      });
  };

  const updateWatchHistory = async () => {
    if (!userAuth) return;

    const response = await axios.patch(
      `${backendUrl}/users/updateWatchHistory/${videoId}`
    );
    if (!response.data?.success) {
      console.log(response.data?.message);
    }
  };

  const updateViews = async () => {
    const response = await axios.patch(`${backendUrl}/video/viwes/${videoId}`);
    if (!response.data?.success) {
      console.log(response.data?.message);
    }
  };

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

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToTop();
    updateViews();
    updateWatchHistory();
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
              src={video?.videoFile}
            ></video>

            <div className="p-6">
              <h1 className="text-3xl font-bold text-white mb-4">
                {video?.title}
              </h1>

              <div className="flex items-center space-x-4 mb-4 text-gray-400">
                <div className="flex items-center">
                  <Eye className="mr-2" />
                  <span>{video?.views} views</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2" />
                  <span>{new Date(video?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{video?.description}</p>

              {owner && (
                <div className="flex flex-col md:flex-row items-center md:justify-between bg-gray-700 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
                    <img
                      src={owner.avatar}
                      alt={owner.username}
                      className="w-16 h-16 rounded-full border-4 border-blue-500 cursor-pointer"
                      onClick={() => navigate(`/chennal/${owner._id}`)}
                    />
                    <div className="text-center md:text-left">
                      <p
                        className="text-xl font-semibold text-white cursor-pointer"
                        onClick={() => navigate(`/chennal/${owner._id}`)}
                      >
                        {owner.username}
                      </p>
                      <p className="text-sm text-gray-400">{owner.fullName}</p>
                      <p className="text-sm text-gray-400">
                        {subscriberCount} subscribers
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
                    {user?._id !== owner._id && (
                      <button
                        onClick={handleSubscribeToggle}
                        disabled={isLoadingSubscription}
                        className={`w-full md:w-auto px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                          isSubscribed
                            ? 'bg-gray-600 hover:bg-gray-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        } ${
                          isLoadingSubscription
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {isLoadingSubscription
                          ? 'Loading...'
                          : isSubscribed
                          ? 'Unsubscribe'
                          : 'Subscribe'}
                      </button>
                    )}
                    <Share2
                      onClick={copyUrlToClipboard}
                      className="text-gray-400 hover:text-purple-500 cursor-pointer text-center md:text-left"
                    />
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
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  currentUserId={user?._id}
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
