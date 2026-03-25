function checkSite() {
  let url = document.getElementById("urlInput").value;
  let score = 100;

  if (!url.startsWith("https")) score -= 40;
  if (url.includes("login")) score -= 20;
  if (url.length > 60) score -= 10;

  document.getElementById("result").innerHTML =
    "Score: " + score + "/100";
}

// Load URL from extension
const params = new URLSearchParams(window.location.search);
const url = params.get("url");

if (url) {
  document.getElementById("urlInput").value = url;
  checkSite();
}

// GAME
const questions = [
  {
    options: ["https://amazon-login-secure.net", "https://amazon.com"],
    correct: 1
  },
  {
    options: ["http://paypal.verify-user.info", "https://paypal.com"],
    correct: 1
  }
];

let current = 0;

function loadQ() {
  document.getElementById("opt0").textContent =
    questions[current].options[0];
  document.getElementById("opt1").textContent =
    questions[current].options[1];
}

function checkAnswer(choice) {
  let correct = questions[current].correct;

  let result = document.getElementById("gameResult");

  if (choice === correct) {
    result.textContent = "Correct!";
  } else {
    result.textContent = "Wrong!";
  }

  current = (current + 1) % questions.length;
  setTimeout(loadQ, 1500);
}

loadQ();