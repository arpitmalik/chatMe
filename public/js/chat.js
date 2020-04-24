// initiate socket connection
const socket = io();

// socket.on("CountUpdated", (count) => {
//   console.log("Count Updated", count);
// });

// document.getElementById("inc").addEventListener("click", () => {
//   // Client Emits
//   socket.emit("increment");
// });

// For displaying a message.
socket.on("message", (message) => {
  console.log(message);
});

// Send Message
document.getElementById("chatSend").addEventListener("submit", (e) => {
  e.preventDefault();
  const inputText = document.getElementById("chatBox").value;
  // Acknowledgement as third argument.
  socket.emit("sendMessage", inputText, (error) => {
    if (error) return console.log(error);

    console.log("The message was delivered");
  });
});

// Send Location
document.getElementById("sendLocation").addEventListener("click", (e) => {
  if (!navigator.geolocation)
    return alert("Oops! your browser does not support geolocation.");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      () => {
        console.log("Location Shared");
      }
    );
  });
});
