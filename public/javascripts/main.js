var socket = io();

let data = {};

if (localStorage.getItem("username")) {
  data.username = localStorage.getItem("username");
  data.language = localStorage.getItem("language");
  
  socket.emit('lobby.firstJoin.', data);
}
else {
  data.username = prompt("Your name: ");
  data.language = navigator.language;
  
  // Check if not european
  // if (data.language)
  
  localStorage.setItem("username", data.username);
  localStorage.setItem("language", data.language);
  
  socket.emit('lobby.join.', data);
}

document.getElementById("new_game").addEventListener('click', function (e) {
  socket.emit('matchmaking.join', data);
});
