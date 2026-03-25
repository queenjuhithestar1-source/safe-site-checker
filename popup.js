// =====================
// CONFIG
// =====================
const SAFE_BROWSING_API_KEY = "YOUR_API_KEY_HERE"; // Get free key at console.cloud.google.com

// =====================
// MAIN URL ANALYSIS
// =====================
chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
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
  if (url.includes("login") || url.includes("verify")) {
    score -= 20;
    tips.push("This page may request sensitive information");
  }

  // Long URL
  if (url.length > 60) {
    score -= 10;
    tips.push("URL looks unusually long");
  }

  // =====================
  // GOOGLE SAFE BROWSING API CHECK
  // =====================
  try {
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`;

    const requestBody = {
      client: {
        clientId: "buddy-safesite-checker",
        clientVersion: "1.0"
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: url }]
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // If Google found a threat match, apply a heavy penalty
    if (data.matches && data.matches.length > 0) {
      score -= 50;
      const threatType = data.matches[0].threatType;

      if (threatType === "SOCIAL_ENGINEERING") {
        tips.push("⚠️ Google flagged this site as a known phishing page");
      } else if (threatType === "MALWARE") {
        tips.push("⚠️ Google flagged this site as known malware");
      } else {
        tips.push("⚠️ Google Safe Browsing flagged this site as dangerous");
      }
    } else {
      tips.push("✓ Not found in Google's phishing/malware database");
    }

  } catch (err) {
    // If API call fails (no internet, bad key, etc.), just skip it silently
    tips.push("Safe Browsing check unavailable");
  }

  // Clamp score to 0 minimum
  score = Math.max(0, score);

  // Determine status
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

  // Update UI
  const scoreFill = document.getElementById("score-fill");
  scoreFill.style.width = score + "%";
  scoreFill.style.backgroundColor = color;
  scoreFill.textContent = score + "/100";

  const statusEl = document.getElementById("status");
  statusEl.textContent = status;
  statusEl.style.color = color;

  const tipsList = document.getElementById("tips");
  tipsList.innerHTML = "";

  if (tips.length === 0) {
    tips.push("No obvious risks detected");
  }

  tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });
});

// =====================
// BUTTON → OPEN WEBSITE
// =====================
function openWebsite() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentUrl = tabs[0].url;

    chrome.tabs.create({
      url:
        "https://queenjuhithestar1-source.github.io/safe-site-checker/buddy-website/dashboard.html?url=" +
        encodeURIComponent(currentUrl)
    });
  });
}

// Attach button event (NO inline JS)
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("openDashboard");
  if (btn) {
    btn.addEventListener("click", openWebsite);
  }
});

// =====================
// BEHAVIOR ANALYZER
// =====================
chrome.runtime.onMessage.addListener((message) => {
  const tipsList = document.getElementById("tips");
  if (!tipsList) return;

  if (message.popups > 0) {
    const li = document.createElement("li");
    li.textContent = `Detected ${message.popups} popup attempts`;
    tipsList.appendChild(li);
  }

  if (message.redirects > 1) {
    const li = document.createElement("li");
    li.textContent = "Multiple redirects detected";
    tipsList.appendChild(li);
  }

  const ai = document.createElement("li");

  if (message.popups > 2 && message.redirects > 1) {
    ai.textContent = "AI Insight: This site shows behavior commonly seen in phishing or scam websites.";
  } else if (message.popups > 0) {
    ai.textContent = "AI Insight: Popups can be used by misleading or unsafe websites.";
  } else if (message.redirects > 1) {
    ai.textContent = "AI Insight: Multiple redirects may indicate suspicious behavior.";
  } else {
    ai.textContent = "AI Insight: No suspicious behavior detected.";
  }

  tipsList.appendChild(ai);
});