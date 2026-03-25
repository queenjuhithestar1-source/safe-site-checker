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

const params = new URLSearchParams(window.location.search);
const url = params.get("url");

if (url) {
  document.getElementById("urlInput").value = url;
  checkSite();
}