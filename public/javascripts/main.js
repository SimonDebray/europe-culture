var socket = io();

let data = {},
  allCards = {},
  currentCards = {},
  selectedCard,
  gameData = {},
  selectedResponse,
  currentResponses = {},
  currentQuestion;

if (localStorage.getItem("username")) {
  data.username = localStorage.getItem("username");
  data.language = localStorage.getItem("language");
  
  socket.emit('lobby.join', data);
}
else {
  data.username = prompt("Your name: ");
  data.language = prompt("Country tag: ");
  
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
  
  console.log(data);
  
  document.getElementById("theGame").classList.remove("hidden");
  document.getElementById("gameMatchmaking").classList.add("hidden");
  
  document.getElementById("myCards").innerHTML = "";
  
  for(var i = 0; i < data.cards.length; i++) {
    data.cards[i].id = 'card-' + i;
    if (i < 6) {
      document.getElementById("myCards").innerHTML += "<img id='card-"+ i +"' src='"+ data.cards[i].card +"' alt=''>";
      currentCards['card-' + i] = data.cards[i];
      console.log("ici");
      document.getElementById('card-'+ i).addEventListener('click', selectCard);
    }
    
    allCards['card-' + i] = data.cards;
  }
  createCountdown(8, sendQuestion, "cardSelectionTimer");
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

function selectCard(card) {
  console.log(card);
  if (!card) return;
  selectedCard = currentCards[card.id];
  document.getElementById(card.id).classList.add("selected");
}

function selectResponse(response) {
  if (!response) return;
  selectedResponse = currentResponses[response.id];
  document.getElementById(response.id).classList.add("selected");
}

// Handle countdown
function createCountdown(time, callback, divId) {
  // Set the date we're counting down to
  var countDownDate = new Date().getTime() + time * 1000;
  
  // Update the count down every 1 second
  var x = setInterval(function() {
    
    // Get today's date and time
    var now = new Date().getTime();
    
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    
    // Output the result in an element with id="demo"
    document.getElementById(divId).innerHTML = (Math.floor((distance % (1000 * 60)) / 1000)).toString();
    
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      
      callback()
    }
  }, 1000);
}

socket.on('game.receiveQuestion', (data) => {
  
  console.log('New question receive');
  console.log(data);
  currentQuestion = data.question;
  
  document.getElementById("myQuestion").innerHTML = data.question.question;
  document.getElementById("responses").innerHTML = "";
  
  var index = getRndInteger(0, data.question.responses.length - 1);
  
  for(var i = 0; i < data.question.responses.length; i++) {
    if(i === index) {
      document.getElementById("responses").innerHTML += "<div class='response' id='response-good'>"+ data.question.response +"</div>" ;
      currentResponses['response-good'] = data.response;
      
      document.getElementById('response-good').addEventListener('click', selectResponse);
    }
    
    var id = 'response-' + i;
    document.getElementById("responses").innerHTML += "<div class='response' id='"+ id +"'>"+ data.question.responses[i] +"</div>" ;
    currentResponses[id] = data.question.responses[i];
    
    document.getElementById('response-'+ i).addEventListener('click', selectResponse);
  }
  
  createCountdown(10, submitResponse, "responseTimer");
});

socket.on('game.sendResponse', (data) => {
  console.log('Game started against ' + data);
  document.getElementById("theGame").classList.remove("hidden");
  
  socket.emit('game.start');
});

function submitResponse() {
  if (!selectedResponse) {
    var keys = Object.keys(currentResponses);
    selectedResponse = currentResponses[keys[0]];
  }
  
  socket.emit('game.sendResponse', {response: selectedResponse, question: currentQuestion, game: gameData});
  
  delete currentCards[selectedCard.id];
  
  document.getElementById(selectedCard.id).classList.add("hidden");
  selectedCard = null;
}

function responseCut() {
  submitResponse()
}

function selectCut() {
  sendQuestion();
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

socket.on('game.ping', () => {
  setTimeout(function(){
    socket.emit('game.ping', gameData);
  }, 1000);
});


socket.on("game.nextRound", () => {
  setTimeout(function(){
    var key = Object.keys(allCards);
  
    var id = key[0];
  
    document.getElementById("myCards").innerHTML += "<img id='"+ id +"' src='"+ allCards[id].card +"' alt=''>";
  
    currentCards[id] = allCards[id];
  
    createCountdown(8, sendQuestion, "cardSelectionTimer");
  }, 5000);
});

socket.on("game.result", (data) => {
  document.getElementById("result").innerHTML = data ? "Bonne réponse" : "Mauvaise réponse";
});
