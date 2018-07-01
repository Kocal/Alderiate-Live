export const setBadgeText = text => {
  chrome.browserAction.setBadgeText({
    text,
  });
};

export const setBadgeColor = color => {
  chrome.browserAction.setBadgeBackgroundColor({
    color,
  });
};

export const onBadgeClick = listener => {
  chrome.browserAction.onClicked.addListener(listener);
};
