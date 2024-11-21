import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
} from "../controllers/comment.controller.js"


import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();
 // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(verifyJWT , addComment);
router.route("/c/:commentId").delete(verifyJWT , deleteComment)

export default router;