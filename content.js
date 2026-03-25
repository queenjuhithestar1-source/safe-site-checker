// MAIN ANALYSIS
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  document.getElementById("url").textContent = url;

  let score = 100;
  let tips = [];

  if (!url.startsWith("https")) {
    score -= 40;
    tips.push("Not using HTTPS");
  }

  if (url.includes("login") || url.includes("verify")) {
    score -= 20;
    tips.push("Possible phishing keywords");
  }

  if (url.length > 60) {
    score -= 10;
    tips.push("URL is unusually long");
  }

  let status = "";
  let color = "";

  if (score >= 80) {
    status = "Safe";
    color = "green";
  } else if (score >= 50) {
    status = "Be Careful";
    color = "orange";
  } else {
    status = "Unsafe";
    color = "red";
  }

  document.getElementById("score-fill").style.width = score + "%";
  document.getElementById("score-fill").style.backgroundColor = color;
  document.getElementById("score-fill").textContent = score + "/100";

  document.getElementById("status").textContent = status;
  document.getElementById("status").style.color = color;

  let tipsList = document.getElementById("tips");
  tipsList.innerHTML = "";

  tips.forEach((tip) => {
    let li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });
});

// 🔗 BUTTON FIX
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("openDashboard");

  if (btn) {
    btn.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentUrl = tabs[0].url;

        chrome.tabs.create({
          url:
            "https://queenjuhithestar1-source.github.io/safe-site-checker/buddy-website/dashboard.html?url=" +
            encodeURIComponent(currentUrl)
        });
      });
    });
  }
});

// 🧠 BEHAVIOR ANALYZER
chrome.runtime.onMessage.addListener((message) => {
  let tipsList = document.getElementById("tips");

  if (!tipsList) return;

  if (message.popups > 0) {
    let li = document.createElement("li");
    li.textContent = `Detected ${message.popups} popups`;
    tipsList.appendChild(li);
  }

  if (message.redirects > 1) {
    let li = document.createElement("li");
    li.textContent = "Multiple redirects detected";
    tipsList.appendChild(li);
  }

  let ai = document.createElement("li");

  if (message.popups > 2 || message.redirects > 1) {
    ai.textContent =
      "AI Insight: Behavior similar to scam/phishing sites.";
  } else {
    ai.textContent = "AI Insight: No suspicious behavior detected.";
  }

  tipsList.appendChild(ai);
});