var socket = io();

let data = {},
  allCards = {},
  currentCards = {},
  selectedCard,
  gameData = {};

if (localStorage.getItem("username")) {
  data.username = localStorage.getItem("username");
  data.language = localStorage.getItem("language");
  
  socket.emit('lobby.join', data);
}
else {
  data.username = prompt("Your name: ");
  data.language = navigator.language;
  
  // Check if not european
  // if (data.language)
  
  localStorage.setItem("username", data.username);
  localStorage.setItem("language", data.language);
  
  socket.emit('lobby.firstJoin', data);
}

// Join matchmaking to look for an opponent
document.getElementById("new_game").addEventListener('click', function (e) {
  socket.emit('matchmaking.join', data);
  document.getElementById("gameMatchmaking").classList.remove("hidden");
});

// Match founded
socket.on('game.init', (data) => {
  
  gameData = data;
  
  console.log('Game started against ' + data.opponentUsername);
  
  document.getElementById("theGame").classList.remove("hidden");
  document.getElementById("gameMatchmaking").classList.add("hidden");
  
  document.getElementById("myCards").innerHTML = "";
  
  for(var i = 0; i < data.cards.length; i++) {
    data.cards[i].id = 'card-' + i;
    if (i < 6) {
      document.getElementById("myCards").innerHTML += "<img id='card-"+ i +"' src='' alt=''>";
      currentCards['card-' + i] = data.cards[i];
      document.getElementById('card-'+ i).addEventListener('click', selectCard(this));
    }
    
    allCards['card-' + i] = data.cards;
  }
  createCountdown(8, sendQuestion);
});

function sendQuestion() {
  if (!selectedCard) {
    var keys = Object.keys(currentCards);
    selectedCard = currentCards[keys[0]];
  }
  
  socket.emit('game.sendQuestion', {card: selectedCard, game: gameData});
  
  delete currentCards[selectedCard.id];
  
  document.getElementById(selectedCard.id).classList.add("hidden");
  selectedCard = null;
}

socket.on('game.receiveQuestion', (data) => {
  console.log('New question receive');
  
  console.log(data);
});

socket.on('game.sendResponse', (data) => {
  console.log('Game started against ' + data);
  document.getElementById("theGame").classList.remove("hidden");
  
  socket.emit('game.start');
});


function selectCard(card) {
  selectedCard = currentCards[card.id];
  document.getElementById(card.id).classList.add("selected");
}


// Handle countdown
function createCountdown(time, callback) {
  // Set the date we're counting down to
  var countDownDate = new Date().getTime() + time * 1000;
  
  // Update the count down every 1 second
  var x = setInterval(function() {
    
    // Get today's date and time
    var now = new Date().getTime();
    
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    
    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = (Math.floor((distance % (1000 * 60)) / 1000)).toString();
    
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      
      callback()
    }
  }, 1000);
}
