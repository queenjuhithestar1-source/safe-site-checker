chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  document.getElementById("url").textContent = url;

  let score = 100;
  let tips = [];

  // Rule 1: HTTPS check
  if (!url.startsWith("https")) {
    score -= 40;
    tips.push("Site is not using HTTPS (connection not secure)");
  }

  // Rule 2: Suspicious keywords
  if (url.includes("login") || url.includes("verify") || url.includes("secure")) {
    score -= 20;
    tips.push("This page may ask for sensitive information");
  }

  // Rule 3: Long or weird URL
  if (url.length > 60 || url.includes("-")) {
    score -= 10;
    tips.push("URL looks unusual or overly long");
  }

  // Determine status
  let statusText = "";
  let color = "";

  if (score >= 80) {
    statusText = "✅ Likely Safe";
    color = "green";
  } else if (score >= 50) {
    statusText = "⚠️ Be Careful";
    color = "orange";
  } else {
    statusText = "❌ Potentially Unsafe";
    color = "red";
  }

  // Update score bar
  let scoreFill = document.getElementById("score-fill");
  scoreFill.style.width = score + "%";
  scoreFill.style.backgroundColor = color;
  scoreFill.textContent = score + "/100";

  // Update status text
  let statusElement = document.getElementById("status");
  statusElement.textContent = statusText;
  statusElement.style.color = color;

  // Update tips
  let tipsList = document.getElementById("tips");
  tipsList.innerHTML = "";
  if (tips.length === 0) tips.push("No obvious risks detected");
  tips.forEach((tip) => {
    let li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  // --- Local history tracking ---
  let history = JSON.parse(localStorage.getItem("siteHistory") || "[]");

  history.unshift({
    url: url,
    score: score,
    status: statusText,
    date: new Date().toLocaleString(),
  });

  if (history.length > 10) history.pop(); // keep last 10

  localStorage.setItem("siteHistory", JSON.stringify(history));

  // Render history
  let historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  history.forEach((item) => {
    let div = document.createElement("div");
    div.textContent = `${item.date} - ${item.url} → ${item.score}/100 (${item.status})`;
    historyDiv.appendChild(div);
  });
});

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