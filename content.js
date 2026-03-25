let popupCount = 0;
let redirectCount = 0;

// Detect popups
const originalOpen = window.open;
window.open = function () {
  popupCount++;
  return originalOpen.apply(this, arguments);
};

// Detect alert popups
const originalAlert = window.alert;
window.alert = function () {
  popupCount++;
  return originalAlert.apply(this, arguments);
};

// Detect redirects
let lastUrl = location.href;

setInterval(() => {
  if (location.href !== lastUrl) {
    redirectCount++;
    lastUrl = location.href;
  }
}, 1000);

// Send data to popup after delay
setTimeout(() => {
  chrome.runtime.sendMessage({
    popups: popupCount,
    redirects: redirectCount
  });
}, 3000);