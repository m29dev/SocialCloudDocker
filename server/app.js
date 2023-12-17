const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const dbConnect = require('./config/dbConfig')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const chatRoutes = require('./routes/chatRoutes')
const User = require('./models/User')
const http = require('http')

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = http.createServer(app)

const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: 'http://localhost:5000',
        methods: ['GET', 'POST'],
    },
})

io.use((socket, next) => {
    const userId = socket.handshake.auth.userId
    if (!userId) {
        return next(new Error('invalid userId'))
    }
    socket.userId = userId
    next()
})
io.on('connection', async (socket) => {
    try {
        //connection event
        await User.findByIdAndUpdate(
            { _id: socket.userId },
            { socketId: socket.id }
        )
        console.log('user connected: ', socket.userId, socket.id)

        //socket events
        socket.on('sendPrivateMessage', async ({ content, receiver }) => {
            console.log('new message: ', content)
            const user = await User.findById({ _id: receiver })
            socket.to(user?.socketId).emit('receivePrivateMessage', {
                content,
                sender: socket.userId,
                receiver,
            })
        })
    } catch (err) {
        console.log(err)
    }
})

dbConnect()
server.listen(3000, () => {
    console.log('app is runnin at port 3000')
})

app.get('/api/welcome', (req, res) => {
    res.json({ message: 'Welcome to the Social Cloud Server.' })
})

//routes
app.use(authRoutes)
app.use(userRoutes)
app.use(postRoutes)
app.use(chatRoutes)
