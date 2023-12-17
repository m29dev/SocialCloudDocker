const bcrypt = require('bcryptjs')
const User = require('../models/User.js')
const {cloudinary} = require('../config/cloudinaryConfig.js')

//register user
const register_post = async (req, res) => {
    try {
        const { firstName, lastName, email, password, friends, location, occupation } = req.body

        if (!firstName || !lastName || !email || !password) return res.status(403).json({ message: 'all inputs must be filled out' })

        let picturePath
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64")
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64

            const cloudRes = await cloudinary.uploader.upload(dataURI, {
                resource_type: "auto",
                folder: 'auctionPhoto'
            })

            picturePath = cloudRes.secure_url
        }

        const passwordHash = bcrypt.hashSync(password, 8)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation
        })
        await newUser.save()

        const user = await User.findOne({ email })
        user.password = undefined

        delete user.password

        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

//login post
const login_post = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'wrong email or password' })

        const validatePassword = bcrypt.compareSync(password, user.password)
        if (!validatePassword) return res.status(400).json({ message: 'wrong email or password' })

        user.password = undefined

        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

//logoout post
const logout_post = async (req, res) => {
    try {
        res.status(200).json({ message: 'user has been logged out' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    register_post,
    login_post,
    logout_post
}