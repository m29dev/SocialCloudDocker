const User = require('../models/User.js')
const Post = require('../models/Post.js')
const { cloudinary } = require('../config/cloudinaryConfig.js')

//create post
const posts_create_post = async (req, res) => {
    try {
        const { userId, description } = req.body

        if (!description)
            return res
                .status(403)
                .json({ message: 'post cannot be created without description' })

        let picturePath
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64')
            let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64

            const cloudRes = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'auto',
                folder: 'auctionPhoto',
            })

            picturePath = cloudRes.secure_url
        }

        const user = await User.findById({ _id: userId })
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            likes: {},
            userPicturePath: user.picturePath,
            picturePath,
        })
        await newPost.save()

        //res with all posts including this one just created
        // const posts = await Post.find().sort({ createdAt: -1 })

        //get all user's and user friend's posts
        let queryArray = []
        //add user's id to filter query
        queryArray.push(user._id)
        //add all friend's ids to filter query
        user.friends.forEach((friend) => queryArray.push(friend._id))

        //get all frirend's posts
        const posts = await Post.find({ userId: { $in: queryArray } }).sort({
            createdAt: -1,
        })

        res.status(201).json(posts)
    } catch (err) {
        console.log(err)
        res.status(409).json({ error: err.message })
    }
}

//read posts (only user's and friend's posts)
const posts_feed_get = async (req, res) => {
    try {
        const id = req.params.userId
        const user = await User.findById({ _id: id })

        let queryArray = []
        //add user's id to filter query
        queryArray.push(user._id)
        //add all friend's ids to filter query
        user.friends.forEach((friend) => queryArray.push(friend._id))

        //get all frirend's posts
        const posts = await Post.find({ userId: { $in: queryArray } }).sort({
            createdAt: -1,
        })
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        res.status(404).json({ error: err.message })
    }
}

//read user's posts
const posts_user_get = async (req, res) => {
    try {
        const id = req.params.userId
        const posts = await Post.find({ userId: id }).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        res.status(404).json({ error: err.message })
    }
}

//update post
const posts_update_put = async (req, res) => {
    try {
        const { id } = req.params
        const { userId, description } = req.body

        if (!description)
            return res
                .status(403)
                .json({ message: 'description cannot be empty' })

        const postBeforeEdit = await Post.findById({ _id: id })
        if (postBeforeEdit.userId !== userId)
            return res.status(403).json({
                message: 'only owner can edit posts data',
            })

        const resPost = await Post.findByIdAndUpdate(
            { _id: id },
            { description },
            { new: true }
        )
        res.status(200).json(resPost)
    } catch (err) {
        console.log(err)
    }
}

//update post's likes
const posts_like_put = async (req, res) => {
    try {
        //liked post id
        const id = req.params.id
        //user id
        const { userId } = req.body

        const post = await Post.findById({ _id: id })
        const isLiked = post.likes.get(userId)

        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            { _id: id },
            { likes: post.likes },
            { new: true }
        )
        res.status(200).json(updatedPost)
    } catch (err) {
        console.log(err)
        res.status(404).json({ error: err.message })
    }
}

const posts_delete = async (req, res) => {
    try {
        const id = req.params.id
        await Post.findByIdAndDelete({ _id: id })
        const posts = await Post.find().sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    posts_create_post,
    posts_feed_get,
    posts_user_get,
    posts_update_put,
    posts_like_put,
    posts_delete,
}
