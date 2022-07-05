require('dotenv').config()
const express = require('express')
const {Server} = require('socket.io')
const cors = require('cors')
const createError = require('http-errors')
const morgan = require('morgan')
const mainRoute = require('./src/routes')
const messageModel = require('./src/models/messages')
const app = express()
const http = require('http')
const jwt = require('jsonwebtoken')
const moment = require('moment')
moment.locale('id')
// apply middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
//   credentials: true,
  origin: 'http://localhost:3000',
}))
app.use(morgan('dev'))

app.use('/v1', mainRoute)

app.all('*', (req, res, next) => {
    next(new createError.NotFound())
  })
  
  app.use((err, req, res, next) => {
    const messError = err.message || 'Internal Server Error'
    const statusCode = err.status || 500
  
    res.status(statusCode).json({
      message: messError
    })
  })

const httpServer = http.createServer(app)
const PORT = 4000
// app.use(cors())
// app.use('/v1', route)
const io = new Server(httpServer, {
    cors:{
        origin: 'http://localhost:3000'
    }
})

io.use((socket, next)=>{
    const token = socket.handshake.query.token
    jwt.verify(token, process.env.SECRET_KEY_JWT, function(error, decoded) {
        if(error){
            if(error && error.name === 'JsonWebTokenError'){
                next(createError(400, 'token invalid'))
            }else if(error && error.name === 'TokenExpiredError'){
                next(createError(400, 'token expired'))
            }else{
                next(createError(400, 'Token not active'))
            }
        }
    
        socket.userId = decoded.id
        socket.join(decoded.id)
        next()
    });
})

io.on('connection', (socket)=>{
    console.log(`ada perankat yg terhubung dengan id ${socket.id} dan id usernya ${socket.userId}`);

    socket.on('inisialRoom', ({room, username})=>{
        console.log(room);
        socket.join(`room:${room}`)
        // socket.broadcast.t
        socket.broadcast.to(`room:${room}`).emit('notifAdmin', {
            sender: 'Admin',
            message: `${username} bergabung dalam group`,
            date: new Date().getHours()+':'+ new Date().getMinutes()
        })
    })

    socket.on('sendMessage', ({idReceiver, messageBody}, callback)=>{
        const message = {
            receiver_id:idReceiver ,
            message:messageBody,
            sender_id: socket.userId,
            created_at: new Date()
        }
        console.log(message);
        callback({...message, created_at: moment(message.created_at).format('LT')})
        messageModel.create(message)
        .then(()=>{
            socket.broadcast.to(idReceiver).emit('newMessage', message)
        })
        // console.log('roomSender', room);
        // io.to(`room:${room}`).emit('newMessage', {
        //     sender: sender,
        //     message: message,
        //     date: new Date().getHours()+':'+ new Date().getMinutes()
        // })
    })

    // socket.on('message', ({idSocket, message})=>{
    //     // socket.emit('messageBE', {message: data, date: new Date()})
    //     // socket.broadcast.emit('messageBE', {message: data, date: new Date()})
    //     // io.emit('messageBE', {message: data, date: new Date()})
    //     socket.to(idSocket).emit('messageBE', {message: message, date: new Date()})
    // })
    socket.on('disconnect', ()=>{
        console.log(`ada perangkat yg terputus dengan id ${socket.id}`);
        // userModel.deleteUserbyId()
    })
})

httpServer.listen(PORT, ()=>{
    console.log(`server is running in port ${PORT}`);
})