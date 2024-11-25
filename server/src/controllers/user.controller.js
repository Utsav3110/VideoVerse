import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { User } from "./../models/user.model.js";
import { cloudinary, uploadOnCloudinary } from "./../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";
  
import jwt from "jsonwebtoken";
import { Video } from "../models/video.model.js";

import { Readable } from "stream";

const cookieOptions = {
  httpOnly: true,
  secure: true,  // Ensure this works locally in dev
  sameSite: 'none',  // Required for cross-site cookies
  path: '/',  // Cookie available across the whole site
  maxAge: 24 * 60 * 60 * 1000,  //
};


const generateAccessandRerershToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "somthing went wrong while genrating access and refrash token",
    });
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    // destructring
    const { fullName, email, username, password } = req.body;

    //validtion
    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      return res.status(400).json({
        sucess: false,
        message: "All fields are required",
      });
    }

    // checking whether user exist in DB or not
    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      return res.status(409).json({
        sucess: false,
        message: "User already existes",
      });
    }

    console.log("This is req.files ", req.files);

    const avatarLocalPath = req.files?.avatar[0]?.buffer;

    console.log(avatarLocalPath);

    let coverImageLocalPath;

    coverImageLocalPath = req.files?.coverImage[0]?.buffer;

    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //throwing error if not have path
    if (!avatarLocalPath) {
      return res.status(400).json({
        sucess: false,
        message: "Avatar is required",
      });
    }

    // uploding in cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
      ? await uploadOnCloudinary(coverImageLocalPath)
      : null;

    //creating a instanc in DB
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    // we donot want to save(send) password and refresh token
    const userCreated = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!userCreated) {
      return res.status(400).json({
        sucess: false,
        message: "Somthing went wrong while creating user",
      });
    }

    console.log(user._id);
    const { accessToken, refreshToken } = await generateAccessandRerershToken(
      user._id
    );

    res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "User registered successfully",
        userCreated,
      });
  } catch (error) {
    console.log("this is catch block with errro", error);

    return res.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!(username || email)) {
      return res.status(400).json({
        sucess: false,
        message: "Enter a Email or username",
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(404).json({
        sucess: false,
        message: "User does not exisest",
      });
    }

    const isPasswordVaild = await user.isPasswordCorrect(password);

    if (!isPasswordVaild) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateAccessandRerershToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "User logged in successfully",
        loggedInUser,
      });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({
        sucess: true,
        message: "USER LOGOUT ",
      });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(400).json({
      success: false,
      message: "unathorized request",
    });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token",
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Somthing went worong",
      });
    }

    const { accessToken, refreshToken } = await generateAccessandRerershToken(
      user._id
    );

    return res
      .status(200)
      .cookie(accessToken, cookieOptions)
      .cookie(refreshToken,  cookieOptions)
      .json({
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "access token refreshed",
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || "INVALID REFRESH TOKEN",
    });
  }
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "password must be diffrent",
    });
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "INVALID PASSWORD",
    });
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "password change succesfully",
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user: req.user,
  });
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({
      success: false,
      message: "All fileds are required",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(400).json({
    success: true,
    message: "changes sucesssfull",
    user,
  });
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.buffer;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const user = await User.findById(req.user?._id);

  const urlParts = user.avatar.split("/");
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(`Error deleting old avatar: ${error}`);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    return res.status(400).json({
      success: false,
      message: "Error while uploding avatar",
    });
  }

  user.avatar = avatar.url;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "avatar changed",
  });
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.buffer;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const user = await User.findById(req.user?._id);

  const urlParts = user.coverImage.split("/");
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(`Error deleting old avatar: ${error}`);
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    return res.status(400).json({
      success: false,
      message: "Error while uploding Image",
    });
  }

  user.coverImage = coverImage.url;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "cover image changed",
  });
});

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the user details
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const updateWatchHistory = async (req , res) => {
  try {
    
    const user = await User.findById(req.user?._id);

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


      user.watchHistory.push(videoId);
      
     await user.save()

      return res.status(200).json({
        success: true,
        message: `User watch history updated`,
        data: user,
      });

   } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
    });
   }
} 


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserCoverImage,
  updateUserAvatar,
  getUserById,
  updateWatchHistory
};
