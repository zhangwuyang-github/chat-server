const express = require('express')
const app = express()
const socket = require('socket.io')
const color = require('colors')
const cors = require('cors')
const { get_current_user, user_disconnect, join_user }  = require('./dummyuser')

app.use(express())

const PORT = 8080

app.use(cors())

let server = app.listen(
    PORT, () => {
        console.log(`Server is Listening on PORT: ${PORT}`.green)
    }
)

// 可以解决打包后的跨域问题
const io = socket(server)

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, roomname }) => {
        const p_user = join_user(socket.id, username, roomname)
        console.log(socket.id, '=id')
        socket.join(p_user.room)

        socket.emit('message', {
            userId: p_user.id,
            username: p_user.username,
            text: `欢迎来到聊天室, ${p_user.username}`
        })

        socket.broadcast.to(p_user.room).emit('message', {
            userId: p_user.id,
            username: p_user.username,
            text: `${p_user.username} 加入了聊天`
        })

        socket.on('chat', (text) => {
            const p_user = get_current_user(socket.id)

            io.to(p_user.room).emit('message', {
                userId: p_user.id,
                username: p_user.username,
                text: text
            })
        })

        socket.on('disconnect', () => {
            const p_user = user_disconnect(socket.id)

            if (p_user) {
                io.to(p_user.room).emit('message', {
                    userId: p_user.id,
                    username: p_user.username,
                    text: `${p_user.username} 离开了聊天`
                })
            }
        })
    })
})