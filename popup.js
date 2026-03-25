chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  document.getElementById("url").textContent = url;

  let score = 100;
  let tips = [];

  // HTTPS check
  if (!url.startsWith("https")) {
    score -= 40;
    tips.push("This site is not secure (no HTTPS)");
  }

  // Suspicious keywords
  if (
    url.includes("login") ||
    url.includes("verify") ||
    url.includes("secure")
  ) {
    score -= 20;
    tips.push("This page may ask for sensitive information");
  }

  // URL structure
  if (url.length > 60 || url.includes("-")) {
    score -= 10;
    tips.push("This URL looks unusual or overly long");
  }

  // Status
  let statusText = "";
  let color = "";

  if (score >= 80) {
    statusText = "Looks Safe";
    color = "#4CAF50";
  } else if (score >= 50) {
    statusText = "Be Careful";
    color = "#FFA500";
  } else {
    statusText = "Unsafe Site";
    color = "#E53935";
  }

  // Score bar
  let scoreFill = document.getElementById("score-fill");
  scoreFill.style.width = score + "%";
  scoreFill.style.backgroundColor = color;
  scoreFill.textContent = score + "/100";

  // Status text
  let statusElement = document.getElementById("status");
  statusElement.textContent = statusText;
  statusElement.style.color = color;

  // Tips
  let tipsList = document.getElementById("tips");
  tipsList.innerHTML = "";

  if (tips.length === 0) {
    tips.push("No obvious risks detected");
  }

  tips.forEach((tip) => {
    let li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  // History
  let history = JSON.parse(localStorage.getItem("siteHistory") || "[]");

  history.unshift({
    url: url,
    score: score,
    status: statusText,
    date: new Date().toLocaleString()
  });

  if (history.length > 10) {
    history.pop();
  }

  localStorage.setItem("siteHistory", JSON.stringify(history));

  let historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";

  history.forEach((item) => {
    let div = document.createElement("div");
    div.textContent = `${item.score}/100 - ${item.status}`;
    historyDiv.appendChild(div);
  });
});

// ✅ FIXED: Event listener instead of inline onclick
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("openDashboard");

  if (btn) {
    btn.addEventListener("click", openWebsite);
  }
});

// Open dashboard
function openWebsite() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentUrl = tabs[0].url;

    chrome.tabs.create({
      url: `https://queenjuhithestar1-source.github.io/safe-site-checker/buddy-website/dashboard.html?url=${encodeURIComponent(currentUrl)}`
    });
  });
}

// Popup detection messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.popups > 0) {
    let tipsList = document.getElementById("tips");

    let li = document.createElement("li");
    li.textContent = `Detected ${message.popups} popup attempts`;
    tipsList.appendChild(li);

    message.issues.forEach((issue) => {
      let li = document.createElement("li");
      li.textContent = issue;
      tipsList.appendChild(li);
    });
  }
});