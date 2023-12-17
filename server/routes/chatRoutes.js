const express = require('express')
const controller = require('../controllers/chatController.js')

const router = express.Router()

//create chat
router.post('/api/chats/:userId/:friendId', controller.chats_userId_friendId_post)

//read chat
router.get('/api/chats/:userId/:friendId', controller.chats_userId_friendId_get)

module.exports = router