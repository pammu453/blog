import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utlis/error.js"
import User from '../models/user.model.js'

export const updateUser = async (req, res, next) => {
    if (req.user.userId !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this user"))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, "Username must be at least 7 to 20 characters"))
        }
        if (req.body.username.includes(" ")) {
            return next(errorHandler(400, "Username must not contain space"))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, "Username must be lowerase"))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username only contain letter and numbers"))
        }
    }
    if (req.body.email) {
        if (!req.body.email.match(/^[a-zA-Z0-9._%+-]+@gmail.com$/)) {
            return next(errorHandler(400, "Enter valid gmail"))
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, { new: true })
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.userId !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this user"))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        next(error)
    }
}

export const signOutUser = async (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json({ message: "User has been signed out" })
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to see these user"))
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === "asc" ? 1 : -1
        const users = await User.find()
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit)

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gt: oneMonthAgo }
        })

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        })
    } catch (error) {
        next(error)
    }
}

export const adminDeleteUser = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.userId !== req.params.adminId) {
        return next(errorHandler(403, "You are not allowed to delete this user"))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return next(errorHandler(404, "User not found"))
        }
        const { password, ...rest } = user._doc
        res.status(200).json(rest)
    }
    catch (error) {
        next(error)
    }
}
