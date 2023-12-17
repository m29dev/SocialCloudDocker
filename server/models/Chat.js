const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    ids: {
        type: Array,
        default: [],
        required: true
    },
    messages: {
        type: Array,
        default: []
    }
}, { timestamps: true })

const chat = mongoose.model('Chat', userSchema)
module.exports = chat