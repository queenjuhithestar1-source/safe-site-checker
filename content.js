let popupCount = 0;
let suspiciousActivity = [];

const originalOpen = window.open;
window.open = function () {
  popupCount++;
  suspiciousActivity.push("Popup window attempted");
  return originalOpen.apply(this, arguments);
};

const originalAlert = window.alert;
window.alert = function () {
  popupCount++;
  suspiciousActivity.push("Alert popup detected");
  return originalAlert.apply(this, arguments);
};

const originalConfirm = window.confirm;
window.confirm = function () {
  popupCount++;
  suspiciousActivity.push("Confirm popup detected");
  return originalConfirm.apply(this, arguments);
};

setTimeout(() => {
  chrome.runtime.sendMessage({
    popups: popupCount,
    issues: suspiciousActivity
  });
}, 2000);