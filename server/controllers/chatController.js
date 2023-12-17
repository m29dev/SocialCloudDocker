const Chat = require('../models/Chat.js')

const chats_userId_friendId_post = async (req, res) => {
    try {
        const { userId, friendId } = req.params
        const { message } = req.body

        //check if chat already exists
        const query = [userId]
        const userChats = await Chat.find({ ids: { $in: query } })
        let thisChat
        userChats.forEach(chat => {
            if (chat.ids.includes(friendId)) thisChat = chat
        })

        //if chat doesnt exist create new one
        if (!thisChat) {
            const newChat = new Chat({
                ids: [userId, friendId],
                messages: [message]
            })
            await newChat.save()
            return res.status(200).json({ message: 'chat has been created' })
        }

        //if chat exists update it  
        if (thisChat) {
            thisChat.messages.push(message)
            const updatedChat = await Chat.findByIdAndUpdate({ _id: thisChat._id }, { messages: thisChat.messages })
            return res.status(200).json({ message: 'chat has been updated' })
        }

    } catch (err) {
        console.log(err)
    }
}

const chats_userId_friendId_get = async (req, res) => {
    try {
        const { userId, friendId } = req.params

        //check if chat exists
        const query = [userId]
        const userChats = await Chat.find({ ids: { $in: query } })
        let thisChat
        userChats.forEach(chat => {
            if (chat.ids.includes(friendId)) thisChat = chat
        })

        if (!thisChat) return res.status(200).json([])

        res.status(200).json(thisChat.messages)
    } catch (err) {

    }
}

module.exports = {
    chats_userId_friendId_post,
    chats_userId_friendId_get,
}