import express from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = express.Router();

// Route to toggle subscription (subscribe/unsubscribe)

router.post("/toggle/:channelId", verifyJWT, toggleSubscription);

// Route to get all subscribers of a channel
router.get("/channel/:channelId/subscribers", getUserChannelSubscribers);

// Route to get all channels a user has subscribed to
router.get("/user/:subscriberId/subscriptions", verifyJWT, getSubscribedChannels);

export default router;
