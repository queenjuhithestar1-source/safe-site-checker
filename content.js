let popupCount = 0;
let suspiciousActivity = [];

// Detect window.open (common popup method)
const originalOpen = window.open;
window.open = function () {
  popupCount++;
  suspiciousActivity.push("Popup window attempted");
  return originalOpen.apply(this, arguments);
};

// Detect alert spam
const originalAlert = window.alert;
window.alert = function () {
  popupCount++;
  suspiciousActivity.push("Alert popup detected");
  return originalAlert.apply(this, arguments);
};

// Detect confirm spam
const originalConfirm = window.confirm;
window.confirm = function () {
  popupCount++;
  suspiciousActivity.push("Confirm popup detected");
  return originalConfirm.apply(this, arguments);
};

// Send data to extension
setTimeout(() => {
  chrome.runtime.sendMessage({
    popups: popupCount,
    issues: suspiciousActivity
  });
}, 2000);