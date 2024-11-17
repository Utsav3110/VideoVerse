import { Router } from "express";
import { changeCurrentUserPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(
    upload.fields( [
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser)

router.route("/login").post(
    loginUser
)


//secure routes
router.route("/logout").post(
    verifyJWT,
    logoutUser
)


router.route("/refresh-token").post(
    refreshAccessToken
)


router.route("/change-password").post(
    verifyJWT,
    changeCurrentUserPassword
)

router.route("/current-user").get(
    verifyJWT, 
    getCurrentUser
)

router.route("/change-info").patch(
    verifyJWT,
    updateAccountDetails
)

router.route("/change-avatar").patch(
   upload.single("avatar"),
   verifyJWT,
   updateUserAvatar
)

router.route("/change-cover-image").patch(
    upload.single("coverImage"),
    verifyJWT,
    updateUserCoverImage
 )
 


export default router