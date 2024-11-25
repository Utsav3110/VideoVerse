import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "./../models/video.model.js";
import { User } from "./../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Function to fetch all videos
const getAllVideos = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  try {
    const filters = {};
    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }
    if (userId && isValidObjectId(userId)) {
      filters.owner = userId;
    }

    const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

    const aggregateQuery = Video.aggregate([
      { $match: filters },
      { $sort: sort },
    ]);
    const options = { page: parseInt(page), limit: parseInt(limit) };

    const videos = await Video.aggregatePaginate(aggregateQuery, options);

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching videos",
      error: error.message,
    });
  }
};

// Function to publish a new video
const publishAVideo = async (req, res) => {
  const { title, description } = req.body;

  console.log(req.files);

  const { videoFile, thumbnail } = req.files;

  if (!videoFile || !thumbnail) {
    return res.status(400).json({
      success: false,
      message: "Video file and thumbnail are required",
    });
  }

  console.log(req.files?.videoFile[0].buffer);

  try {
    const video = await uploadOnCloudinary(
      req.files?.videoFile[0].buffer,
      "video"
    );
    const thumbnailImaege = await uploadOnCloudinary(
      req.files?.thumbnail[0].buffer,
      "image"
    );

    const duration = video.duration || Math.floor(Math.random() * 300); // Replace with actual duration calculation if available

    const videoUrl = video.url;
    const thumbnailUrl = thumbnailImaege.url;

    const newVideo = new Video({
      videoFile: videoUrl,
      thumbnail: thumbnailUrl,
      title,
      description,
      duration,
      owner: req.user._id,
    });

    const videoData = await newVideo.save();

    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: videoData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: error.message,
    });
  }
};

// Function to get a video by ID
const getVideoById = async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid video ID",
    });
  }

  try {
    const video = await Video.findById(videoId).populate(
      "owner",
      "username fullName"
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video fetched successfully",
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching video",
      error: error.message,
    });
  }
};

  // Function to update a video
const updateVideo = async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;


    if (!isValidObjectId(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }


    try {
      const updatedFields = {};
      if (title) updatedFields.title = title;
      if (description) updatedFields.description = description;

      if (req.file) {
        const thumbnailImage = await uploadOnCloudinary(req.file.buffer, "image");
        updatedFields.thumbnail = thumbnailImage.url;
        console.log(thumbnailImage.url);
      }

      const updatedVideo = await Video.findByIdAndUpdate(videoId, updatedFields, {
        new: true,
      });

      if (!updatedVideo) {
        return res.status(404).json({
          success: false,
          message: "Video not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Video updated successfully",
        data: updatedVideo,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error updating video",
        error: error.message,
      });
    }
};

// Function to delete a video
const deleteVideo = async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid video ID",
    });
  }

  try {
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
      data: deletedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting video",
      error: error.message,
    });
  }
};

// Function to toggle the publish status of a video
const togglePublishStatus = async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid video ID",
    });
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json({
      success: true,
      message: `Video publish status toggled to ${video.isPublished}`,
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error toggling publish status",
      error: error.message,
    });
  }
};

const getAllVideosUploadedById = async (req, res) => {
  try {
    const userId = req.user?._id; // Ensure `req.user` contains the authenticated user ID


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Fetch all videos where `owner` matches the user's ID
    const allVideosUploadedByUser = await Video.find({ owner: userId });

    return res.status(200).json({
      success: true,
      data: allVideosUploadedByUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
};



const getAllVideosUploadedByUser = async (req, res) => {
  try {
    const {userId} = req.params // Ensure `req.user` contains the authenticated user ID


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Fetch all videos where `owner` matches the user's ID
    const allVideosUploadedByUser = await Video.find({ owner: userId });

    return res.status(200).json({
      success: true,
      data: allVideosUploadedByUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
};


const updateViewCount = async (req, res)=> {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }
  
    
      const video = await Video.findById(videoId);
  
      if (!video) {
        return res.status(404).json({
          success: false,
          message: "Video not found",
        });
      }
  
      video.views = video.views + 1;
      await video.save();
  
      return res.status(200).json({
        success: true,
        message: `Video viwes updated to ${video.views}`,
        data: video,
      });
     
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }

}


export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideosUploadedById,
  getAllVideosUploadedByUser,
  updateViewCount,
}
