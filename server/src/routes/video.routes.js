import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideosUploadedById,
  getAllVideosUploadedByUser,
  updateViewCount,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes
router.route("/").get(getAllVideos); // Fetch all videos
router.route("/:videoId").get(getVideoById); // Fetch a single video by ID
router.route("/uploaded/:userId").get(getAllVideosUploadedByUser);
router.route("/viwes/:videoId").patch(updateViewCount);

// Secure routes
router.route("/publish").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
); // Publish a new video

router
  .route("/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo); // Update video details

router.route("/:videoId").delete(verifyJWT, deleteVideo);

router.route("/:videoId/toggle-publish").patch(verifyJWT, togglePublishStatus); // Toggle publish status

router.route("/uploaded").post(verifyJWT, getAllVideosUploadedById);

export default router;
