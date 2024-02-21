import express from 'express'

import { createPost, getPosts, deletePost, updatePost } from '../controllers/post.contoler.js'
import { varifyToken } from '../utlis/varifyUser.js'

const router = express.Router()

router.post("/createPost", varifyToken, createPost)
router.get("/getPosts", getPosts)
router.delete("/deletePost/:postId/:userId", varifyToken, deletePost)
router.put("/updatePost/:postId/:userId", varifyToken, updatePost)

export default router