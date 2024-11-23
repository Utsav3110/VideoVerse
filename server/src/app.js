import express from "express";

// CORS IS PACKAGE USE FOR , FROM WHERE WE ACCEPT OUR REQ
import cors from "cors";

// USED TO SET (CURD OPRATION) ON USER COOKIES
import cookieParser from "cookie-parser";

const app = express();

// ORIGIN FROM WHERE WE ACCEPT OUR REQUEST
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(cookieParser());

//HOW MANY KB OF DATA WE WILL BE ACCPETIG
app.use(express.json({ limit: "16kb" }));

// HOW NAMY KB URL DATA ACCEPTING
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//routes

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Express API!' });
  });

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

import videoRouter from "./routes/video.routes.js";

app.use("/api/v1/video", videoRouter);

import commentRouter from './routes/comment.routes.js'

app.use("/api/v1/comments", commentRouter)


import subscriptionRoutes from "./routes/subscription.routes.js";

app.use("/api/v1/subscriptions", subscriptionRoutes);


export { app };
