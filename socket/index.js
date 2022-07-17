const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

dotenv.config();

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

//when connected
io.on("connection", (socket) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    // verify token
    jwt.verify(
      socket.handshake.query.token,
      process.env.TOKEN_KEY,
      function (err, decoded) {
        console.log("a user connected.");

        //take userId and socketId from user
        socket.on("addUser", (userId) => {
          addUser(userId, socket.id);
          io.emit("getUsers", users);
        });

        //send and get message
        socket.on("sendMessage", ({ senderId, receiverId, text }) => {
          const user = getUser(receiverId);
          if (user) {
            io.to(user.socketId).emit("getMessage", {
              senderId,
              text,
            });
          }
        });

        //when disconnect
        socket.on("disconnect", () => {
          console.log("a user disconnected!");
          removeUser(socket.id);
          io.emit("getUsers", users);
        });
      }
    );
  } else {
    console.log("Authentication error");
  }
});
