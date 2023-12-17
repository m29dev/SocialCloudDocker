require('dotenv').config()

//multer config
const multer = require('multer')
const storage = multer.memoryStorage()
//export to routes
const upload = multer({ storage: storage })

//cloudinary config
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

//export to controllers
const uploadImage = (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64")
    let dataURI = "data:" + image.mimetype + ";base64," + b64

    cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: 'auctionPhoto'
    }).then(result => {
        return result.secure_url
    }).catch(err => {
        console.log(err)
    })
}

module.exports = {
    upload,
    uploadImage
}