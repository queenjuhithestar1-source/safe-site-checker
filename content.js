chrome.runtime.onMessage.addListener((message) => {
  let tipsList = document.getElementById("tips");

  if (!tipsList) return;

  // Add raw detections
  if (message.popups > 0) {
    let li = document.createElement("li");
    li.textContent = `Detected ${message.popups} popup attempts`;
    tipsList.appendChild(li);
  }

  if (message.redirects > 1) {
    let li = document.createElement("li");
    li.textContent = `Multiple redirects detected`;
    tipsList.appendChild(li);
  }

  // 🧠 AI-style explanation
  let aiInsight = document.createElement("li");

  if (message.popups > 2 && message.redirects > 1) {
    aiInsight.textContent =
      "AI Insight: This site shows behavior commonly seen in scam or phishing websites (excessive popups and redirects).";
  } else if (message.popups > 0) {
    aiInsight.textContent =
      "AI Insight: Popups are often used in misleading or unsafe websites. Proceed carefully.";
  } else if (message.redirects > 1) {
    aiInsight.textContent =
      "AI Insight: Multiple redirects may indicate tracking or malicious behavior.";
  } else {
    aiInsight.textContent =
      "AI Insight: No suspicious behavior patterns detected.";
  }

  tipsList.appendChild(aiInsight);
});