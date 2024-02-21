import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routs.js";
import commentRouter from "./routes/comment.routes.js";
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((error) => {
        console.log(error.message);
    });

app.listen(5000, () => {
    console.log("Server is running on port 5000!");
});

app.use(cors())

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/comment", commentRouter)

//middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})