import bcrypt from 'bcryptjs'
import User from "../models/user.model.js"
import { errorHandler } from '../utlis/error.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"))
    }

    const oldUserName = await User.findOne({ username })
    if (oldUserName) {
        next(errorHandler(400, "User already exist with username!"))
    }
    const oldUserEmail = await User.findOne({ email })

    if (oldUserEmail) {
        next(errorHandler(400, "User already exist with email!"))
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = new User({ username, email, password: hashedPassword })
    try {
        await newUser.save()
        res.json("SignUp succefull")
    } catch (error) {
        next(error)
    }
}
export const signin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"))
    }

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, "User not found"))
        }
        const validPassword = bcrypt.compareSync(password, validUser.password)

        if (!validPassword) {
            return next(errorHandler(404, "Invalid credentials"))
        }

        const token = jwt.sign(
            { userId: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_KEY, { expiresIn: "2d" }
        )

        const { password: pass, ...rest } = validUser._doc

        res.status(200).cookie("access_token", token, {
            httpOnly: true
        }).json(rest)

    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { name, email, googlePhotoURL } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            const token = jwt.sign(
                { userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_KEY, { expiresIn: "2d" }
            )
            const { password, ...rest } = user._doc
            res.status(200).cookie("access_token", token, {
                httpOnly: true
            }).json(rest)
        } else {
            const generatedPassword = Math.random().toString().slice(2, 10)
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10)

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString().slice(2, 6),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoURL
            })
            await newUser.save()
            const token = jwt.sign(
                { userId: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_KEY, { expiresIn: "2d" }
            )
            const { password, ...rest } = newUser._doc
            res.status(200).cookie("access_token", token, {
                httpOnly: true
            }).json(rest)
        }
    } catch (error) {
        next(error)
    }
}