import express from 'express'

import { updateUser, deleteUser, signOutUser, getUsers,adminDeleteUser, getUser } from '../controllers/user.controler.js'
import { varifyToken } from '../utlis/varifyUser.js'

const router = express.Router()

router.put("/updateUser/:userId", varifyToken, updateUser)
router.delete("/deleteUser/:userId", varifyToken, deleteUser)
router.post("/signOutUser", signOutUser)
router.get("/getUsers",varifyToken, getUsers)
router.delete("/adminDeleteUser/:userId/:adminId",varifyToken, adminDeleteUser)
router.get("/:userId", getUser)

export default router