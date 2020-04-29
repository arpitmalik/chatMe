const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();

// Express Server.
const server = http.createServer(app);
// Socket IO server.
const io = socketio(server);

const PORT = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New socket connection.");

  socket.on("join", ({ username, room }, callback) => {
    const id = socket.id;
    const { error, user } = addUser({ id, username, room });
    if (error) {
      return callback(error);
    }
    // Make a room.
    socket.join(user.room);

    // Send message to user.
    socket.emit("message", generateMessage("Welcome!", "Admin"));

    // Send message to all except current user in a particular room.
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(`${user.username} has joined!`, "Admin")
      );

    // User joined.
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    // Profanity filter
    const filter = new Filter();
    if (filter.isProfane(message)) return callback("Profanity is not allowed");
    io.to(user.room).emit("message", generateMessage(message, user.username));
    callback();
  });

  // Sendlocation
  socket.on("sendLocation", ({ lat, long }, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "sendmylocation",
      generateLocationMessage(
        `https://www.google.com/maps?q=${lat},${long}`,
        user.username
      )
    );
    callback();
  });
  // Disconnect
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left.`, "Admin")
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(`App running on localhost ${PORT}`);
});
