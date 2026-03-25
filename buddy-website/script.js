// =====================
// URL CHECKER
// =====================
function checkSite() {
  let url = document.getElementById("urlInput").value;
  let score = 100;
  let result = "";

  if (!url.startsWith("https")) {
    score -= 40;
    result += "<p>Not secure (no HTTPS)</p>";
  }

  if (url.includes("login") || url.includes("verify")) {
    score -= 20;
    result += "<p>May ask for sensitive info</p>";
  }

  if (url.length > 60) {
    score -= 10;
    result += "<p>URL looks suspicious</p>";
  }

  result += `<h3>Score: ${score}/100</h3>`;

  document.getElementById("result").innerHTML = result;
}

// Auto-load from extension
const params = new URLSearchParams(window.location.search);
const url = params.get("url");

if (url) {
  document.getElementById("urlInput").value = url;
  checkSite();
}

// =====================
// PHISHING GAME
// =====================
const questions = [
  {
    options: [
      "https://amazon-login-secure.net",
      "https://amazon.com"
    ],
    correct: 1,
    explanation:
      "The first URL is a fake domain designed to look like Amazon."
  },
  {
    options: [
      "http://paypal.verify-user.info",
      "https://paypal.com"
    ],
    correct: 1,
    explanation:
      "Real companies do not use strange subdomains like 'verify-user'."
  }
];

let currentQuestion = 0;

function loadQuestion() {
  let q = questions[currentQuestion];

  document.getElementById("opt0").textContent = q.options[0];
  document.getElementById("opt1").textContent = q.options[1];
  document.getElementById("gameResult").textContent = "";
}

function checkAnswer(choice) {
  let q = questions[currentQuestion];
  let result = document.getElementById("gameResult");

  if (choice === q.correct) {
    result.textContent = "Correct! " + q.explanation;
    result.style.color = "green";
  } else {
    result.textContent = "Incorrect. " + q.explanation;
    result.style.color = "red";
  }

  currentQuestion = (currentQuestion + 1) % questions.length;

  setTimeout(loadQuestion, 2000);
}

// Load first question
loadQuestion();