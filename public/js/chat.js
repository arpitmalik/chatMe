// initiate socket connection
const socket = io();

// socket.on("CountUpdated", (count) => {
//   console.log("Count Updated", count);
// });

// document.getElementById("inc").addEventListener("click", () => {
//   // Client Emits
//   socket.emit("increment");
// });

// ----- Elements
const $messageForm = document.getElementById("chatSend");
const $chatInput = document.getElementById("chatBox");
const $sendLocationButton = document.getElementById("sendLocation");

// For displaying a message.
socket.on("message", (message) => {
  console.log(message);
});

// Send Message on form submit.
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputText = $chatInput.value;
  // Acknowledgement as third argument.
  socket.emit("sendMessage", inputText, (error) => {
    $chatInput.value = "";
    $chatInput.focus();
    if (error) return console.log(error);
    console.log("The message was delivered");
  });
});

// Send Location
$sendLocationButton.addEventListener("click", (e) => {
  if (!navigator.geolocation)
    return alert("Oops! your browser does not support geolocation.");
  // Disable button
  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      () => {
        // Enable button
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location Shared");
      }
    );
  });
});
