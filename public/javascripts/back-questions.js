var socket = io();

var inputs = {
  question : document.getElementById('question'),
  card : document.getElementById('card'),
  answer : document.getElementById('answer'),
  difficulty : document.getElementById('difficulty'),
  country : document.getElementById('country'),
  false1 : document.getElementById('false1'),
  false2 : document.getElementById('false2'),
  false3 : document.getElementById('false3')
};

var labels = {
  false2: document.getElementById('l-false2'),
  false3: document.getElementById('l-false3')
};

document.getElementById("difficulty").addEventListener('change', function (e) {
  if (inputs.difficulty.value === "duo") {
    inputs.false2.classList.add("hidden");
    inputs.false3.classList.add("hidden");
    labels.false2.classList.add("hidden");
    labels.false3.classList.add("hidden");
  }
  else if (inputs.difficulty.value === "trio") {
    inputs.false2.classList.remove("hidden");
    inputs.false3.classList.add("hidden");
    labels.false2.classList.remove("hidden");
    labels.false3.classList.add("hidden");
  }
  else {
    inputs.false2.classList.remove("hidden");
    inputs.false3.classList.remove("hidden");
    labels.false2.classList.remove("hidden");
    labels.false3.classList.remove("hidden");
  }
});
