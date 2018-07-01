export const openInNewTab = url => {
  chrome.tabs.create({
    url,
    active: true,
  });
};

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

