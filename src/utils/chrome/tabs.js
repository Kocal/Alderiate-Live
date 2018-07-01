export const openInNewTab = url => {
  chrome.tabs.create({
    url,
    active: true,
  });
};
