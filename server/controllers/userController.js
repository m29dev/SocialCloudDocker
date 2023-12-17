const User = require('../models/User.js')
const Post = require('../models/Post.js')
const bcrypt = require('bcryptjs')
const {cloudinary} = require('../config/cloudinaryConfig.js')

//read user
const users_id_get = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById({ _id: id })
        if (!user) return res.status(403).json({ message: 'user does not exist' })

        user.password = undefined
        res.status(200).json(user)

    } catch (err) {
        console.log(err)
        res.status(404).json({ error: err.message })
    }
}

//update user
const users_id_edit_put = async (req, res) => {
    try {
        const id = req.params.id
        const { firstName, lastName, email, password, location, occupation } = req.body
        const user = await User.findById({ _id: id })
        if (!user) return res.status(403).json({ message: 'wrong id, no user found' })
        if (!firstName && !lastName && !email && !password && !location && !occupation && !req.file) return res.status(403).json({ message: 'no data to update, fill out at least one input' })

        //handle picture update
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
        //handle update picturePath in all user's posts
        if (picturePath) {
            const posts = await Post.find({ userId: id })
            let queryArray = []
            posts.forEach(post => {
                queryArray.push(post._id)
            })

            await Post.updateMany({ _id: { $in: queryArray } }, { userPicturePath: picturePath })
            console.log('users posts picturePath has been updated')
        }

        const newFirstName = firstName ? firstName : user.firstName
        const newLastName = lastName ? lastName : user.lastName
        const newEmail = email ? email : user.email
        const newPassword = password ? bcrypt.hashSync(password, 8) : user.password
        const newLocation = location ? location : user.location
        const newOccupation = occupation ? occupation : user.occupation
        const newPicturePath = picturePath ? picturePath : user.picturePath

        const updatedUser = await User.findByIdAndUpdate({ _id: id }, {
            firstName: newFirstName,
            lastName: newLastName,
            email: newEmail,
            password: newPassword,
            location: newLocation,
            occupation: newOccupation,
            picturePath: newPicturePath
        }, { new: true })
        if (!updatedUser) return res.status(400).json({ message: 'could not update user' })

        res.status(200).json(updatedUser)
    } catch (err) {
        console.log(err)
    }
}

const users_id_delete = async (req, res) => {
    try {
        const id = req.params.id
        const remUser = await User.findByIdAndDelete({ _id: id })
        if (!remUser) return res.status(403).json({ message: 'could not delete, no user found' })
        res.status(200).json({ message: 'user has been deleted' })
    } catch (err) {
        console.log(err)
    }
}

//search user
const users_search_post = async (req, res) => {
    try {
        const users = await User.find()
        let fixedUsers = []

        users.forEach(user => {
            const userData = {
                _id: user._id,
                name: user.firstName + ' ' + user.lastName,
                picturePath: user.picturePath
            }

            fixedUsers.push(userData)
        })

        const { search } = req.body
        fixedUsers = fixedUsers.filter((user) => {
            return user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
        })

        res.status(200).json(fixedUsers)
    } catch (err) {
        console.log(err)
    }
}

//add / remove friend
const users_userId_friendId_put = async (req, res) => {
    try {
        const { id, friendId } = req.params

        const user = await User.findById({ _id: id })
        const friend = await User.findById({ _id: friendId })

        if (user.friends.some(e => JSON.stringify(e._id) === `"${friendId}"`)) {
            user.friends = user.friends.filter(e => JSON.stringify(e._id) !== `"${friendId}"`)
            friend.friends = friend.friends.filter(e => JSON.stringify(e._id) !== `"${id}"`)
        } else {
            user.friends.push({
                _id: friend._id,
                firstName: friend.firstName,
                lastName: friend.lastName,
                picturePath: friend.picturePath,
                location: friend.location,
                occupation: friend.occupation
            })
            friend.friends.push({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                picturePath: user.picturePath,
                location: user.location,
                occupation: user.occupation
            })
        }

        await user.save()
        await friend.save()

        const userUpdated = await User.findById({ _id: id })
        res.status(200).json(userUpdated)
    } catch (err) {
        console.log(err)
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    users_id_get,
    users_id_edit_put,
    users_id_delete,
    users_search_post,
    users_userId_friendId_put
}
