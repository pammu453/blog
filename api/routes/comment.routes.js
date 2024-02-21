import express from 'express'
import { varifyToken } from '../utlis/varifyUser.js'
import { createComment, getPostComment, likeComment, editComment, deleteComment, getComments } from '../controllers/comment.contoler.js'

const router = express.Router()

router.post("/create", varifyToken, createComment)
router.get("/getPostComment/:postId", getPostComment)
router.put("/likeComment/:commentId", varifyToken, likeComment)
router.put("/editComment/:commentId", varifyToken, editComment)
router.delete("/deleteComment/:commentId", varifyToken, deleteComment)
router.get("/getComments",varifyToken, getComments)

export default router