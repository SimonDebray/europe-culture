var socket = io();

let username = "",
  language = "";

if (localStorage.getItem("username")) {
  username = localStorage.getItem("username");
  language = localStorage.getItem("language");
}
else {
  username = prompt("Your name: ");
  language = navigator.language;
}

localStorage.setItem("username", username);
localStorage.setItem("language", language);

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
