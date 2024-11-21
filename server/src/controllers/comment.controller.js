import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

// Fetch comments for a specific video with pagination
const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ video: videoId })
      .populate("user", "username avatar", null , { strictPopulate: false }) // Populate user details
      .sort({ createdAt: -1 }) // Latest comments first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalComments = await Comment.countDocuments({ video: videoId });

    return res.status(200).json({
      success: true,
      data: comments,
      meta: {
        total: totalComments,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming user is authenticated and available in req.user

    console.log(videoId);
    console.log(userId);

    // Validate text
    if (!text) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    // Check if the video exists
    console.log(1);
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    console.log(2);
    const comment = await Comment.create({ content : text, video: videoId, owner: userId });
    console.log(3);
    return res.status(201).json({ success: true, data: comment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and available in req.user

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { getVideoComments, addComment, deleteComment };
