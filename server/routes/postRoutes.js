const express = require('express')
const { upload } = require('../config/uploadConfig.js')
const controller = require('../controllers/postController.js')

const router = express.Router()

//create
router.post('/api/posts', upload.single('image'), controller.posts_create_post)

//read
router.get('/api/posts/:userId', controller.posts_feed_get)
router.get('/api/posts/:userId/filter', controller.posts_user_get)

//update
router.put('/api/posts/:id/update', controller.posts_update_put)
router.put('/api/posts/:id/like', controller.posts_like_put)

//delete
router.delete('/api/posts/:id/delete', controller.posts_delete)

module.exports = router