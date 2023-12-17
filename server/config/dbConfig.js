const mongoose = require('mongoose')
require('dotenv').config()
DB_URI = process.env.DB_URI
DB_URI_1 = process.env.DB_URI_1

const dbConnect = async () => {
    try {
        // const conn = await mongoose.connect(DB_URI)
        // if (conn) console.log('server has been connected to the db')

        const url = DB_URI_1
        const db = mongoose.connection
        mongoose.connect(url)
        db.once('open', (_) => {
            console.log('Database connected:', url)
        })
        db.on('error', (err) => {
            console.error('connection error:', err)
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = dbConnect
