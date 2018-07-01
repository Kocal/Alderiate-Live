export const onNotificationClick = listener => {
  chrome.notifications.onClicked.addListener(listener);
};

export const createNotification = ({ type = 'basic', title, message, iconUrl = '../icons/icon_128.png' }) => {
  chrome.notifications.create({
    type,
    title,
    message,
    iconUrl,
  });
};
