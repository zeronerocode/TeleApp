require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const createError = require("http-errors");
const morgan = require("morgan");
const mainRoute = require("./src/routes");
const messageModel = require("./src/models/messages");
const app = express();
const http = require("http");
const jwt = require("jsonwebtoken");
const moment = require("moment");
moment.locale("id");
// apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    //   credentials: true,
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use("/v1", mainRoute);

app.all("*", (req, res, next) => {
  next(new createError.NotFound());
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const messError = err.message || "Internal Server Error";
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: messError,
  });
});

const httpServer = http.createServer(app);
const PORT = 4000;
// app.use(cors())
// app.use('/v1', route)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  jwt.verify(token, process.env.SECRET_KEY_JWT, function (error, decoded) {
    if (error) {
      if (error && error.name === "JsonWebTokenError") {
        next(createError(400, "token invalid"));
      } else if (error && error.name === "TokenExpiredError") {
        next(createError(400, "token expired"));
      } else {
        next(createError(400, "Token not active"));
      }
    }

    socket.userId = decoded.id;
    socket.join(decoded.id);
    next();
  });
});

io.on("connection", (socket) => {
  console.log(
    `id ${socket.id} As ${socket.userId}`
  );

  socket.on("sendMessage", (data, callback) => {
    const message = {
      receiver_id: data.idReceiver,
      message: data.messageBody,
      sender_id: socket.userId,
      created_at: new Date(),
    };
    console.log(message);
    callback({
      ...message,
      date: moment(message.created_at).format("LT"),
    });
    messageModel.create(message).then(() => {
      socket.broadcast.to(data.idReceiver).emit("newMessage", {message: message.message, date: moment(message.created_at).format('LT')});
    });
  });

  socket.on("disconnect", () => {
    console.log(`ada perangkat yg terputus dengan id ${socket.id}`);
    // userModel.deleteUserbyId()
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
