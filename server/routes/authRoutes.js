const express = require('express')
const { upload } = require('../config/uploadConfig.js')
const controller = require('../controllers/authController.js')

const router = express.Router()

//register
router.post('/api/auth/register', upload.single('image'), controller.register_post)

//login
router.post('/api/auth/login', controller.login_post)

//logout
router.post('/api/auth/logout', controller.logout_post)

module.exports = router