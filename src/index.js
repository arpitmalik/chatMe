const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

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

  socket.emit("message", "Welcome to my app!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message, callback) => {
    // Profanity
    const filter = new Filter();
    if (filter.isProfane(message)) return callback("Profanity is not allowed");
    io.emit("message", message);
    callback();
  });

  socket.on("sendLocation", ({ lat, long }, callback) => {
    io.emit("message", `https://www.google.com/maps?q=${lat},${long}`);
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left.");
  });
});

server.listen(PORT, () => {
  console.log(`App running on localhost ${PORT}`);
});