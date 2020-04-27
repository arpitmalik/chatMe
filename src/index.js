const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage} = require("./utils/messages");

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
  // Send message to user.
  socket.emit("message", generateMessage("Welcome!"));
  // Send message to all except current user.
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("sendMessage", (message, callback) => {
    // Profanity filter
    const filter = new Filter();
    if (filter.isProfane(message)) return callback("Profanity is not allowed");
    io.emit("message", generateMessage(message));
    callback();
  });

  // Sendlocation
  socket.on("sendLocation", ({ lat, long }, callback) => {
    io.emit(
      "sendmylocation",
      generateLocationMessage(`https://www.google.com/maps?q=${lat},${long}`)
    );
    callback();
  });
  // Disconnect
  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left."));
  });
});

server.listen(PORT, () => {
  console.log(`App running on localhost ${PORT}`);
});
