// Toggle subscription for a channel
import { Subscription } from "../models/subscription.model.js";


const toggleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (existingSubscription) {
      // Unsubscribe: Remove subscription
      await Subscription.deleteOne({ _id: existingSubscription._id });
      return res
        .status(200)
        .json({ success: true, message: "Unsubscribed successfully" });
    } else {
      // Subscribe: Create a new subscription
      await Subscription.create({ subscriber: userId, channel: channelId });
      return res
        .status(200)
        .json({ success: true, message: "Subscribed successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get the subscriber list of a channel
const getUserChannelSubscribers = async (req, res) => {
  try {
    const { channelId } = req.params;

    const subscribers = await Subscription.find({
      channel: channelId,
    }).populate("subscriber", "username avatar");

    return res
      .status(200)
      .json({ success: true, data: subscribers.map((sub) => sub.subscriber) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get the list of channels a user has subscribed
const getSubscribedChannels = async (req, res) => {
  try {
    const { subscriberId } = req.params;

    const subscriptions = await Subscription.find({
      subscriber: subscriberId,
    }).populate("channel", "username avatar");

    return res
      .status(200)
      .json({ success: true, data: subscriptions.map((sub) => sub.channel) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
