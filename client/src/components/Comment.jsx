import React, { useState, useEffect } from 'react';
import { Trash2, ThumbsUp, Reply } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export default function Comment({
  comment,
  onDelete,
  currentUserId,
  videoOwnerId,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [owner, setOwner] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchOwner();
  }, [comment.owner]);

  const fetchOwner = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users/${comment.owner}`);
      if (response.data.success) {
        setOwner(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch comment owner:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${backendUrl}/comments/c/${comment._id}`
      );
      if (response.data.success) {
        toast.success(response.data.message)
        onDelete(comment._id);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = () => {
    // Implement like functionality here
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleReply = () => {
    // Implement reply functionality here
    console.log('Reply to comment:', comment._id);
  };

  const isOwner = comment.owner === currentUserId;
  const canDelete = isOwner || currentUserId === videoOwnerId;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex gap-4 bg-gray-800 p-4 rounded-lg mb-4">
      <img
        src={owner?.avatar || '/placeholder.svg?height=40&width=40'}
        alt={owner?.username || 'User'}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-white">
              {owner?.username || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-400">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-gray-300 mt-2 whitespace-pre-wrap">
          {comment.content}
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm ${
              isLiked ? 'text-blue-500' : 'text-gray-400'
            } hover:text-blue-500 transition-colors`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{likesCount} Likes</span>
          </button>
          <button
            onClick={handleReply}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-green-500 transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
