import axios from 'axios';
import Logger from '@kocal/logger';
import { openInNewTab } from './utils/chrome/tabs';
import { onBadgeClick, setBadgeColor, setBadgeText } from './utils/chrome/badge';
import { createNotification, onNotificationClick } from './utils/chrome/notification';

const logger = Logger.getLogger();
const urlStream = 'https://alderiate.com';
const urlApi = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:7718/twitch.json' : `${urlStream}/twitch.json`;
const secondsBeforeNextApiRequest = process.env.NODE_ENV === 'development' ? 5 : 60;
let isOnline = false;

const openStream = () => {
  logger.debug('Ouverture du stream');

  openInNewTab(urlStream);
};

const configureBadge = () => {
  logger.debug('Configuration du badge');

  setBadgeText('...');
  onBadgeClick(() => openStream());
};

const configureNotifications = () => {
  logger.debug('Configuration des notifications');

  onNotificationClick(() => openStream());
};

const putOnlineState = () => {
  logger.debug('Passage au mode en-ligne');

  setBadgeText('ON');
  setBadgeColor('green');
};

const putOfflineState = () => {
  logger.debug('Passage au mode hors-ligne');

  setBadgeText('OFF');
  setBadgeColor('gray');
};

/**
 * @param {Object} json
 * @param {Number} json.twitch
 * @param {String} [json.twitchGame]
 * @param {String} [json.twitchTitle]
 */
const handleApiResponse = json => {
  logger.info('Traitement de la réponse');
  logger.debug(JSON.stringify(json));

  const isOnlineOnTwitch = json.twitch === 1;

  if (isOnlineOnTwitch) {
    if (isOnline === false) {
      isOnline = true;
      putOnlineState();
      createNotification({
        title: `Alderiate est en live sur ${json.twitchGame || ''}`,
        message: (json.twitchTitle || '').trim(),
      });
    }
  } else {
    isOnline = false;
    putOfflineState();
  }
};

const requestApi = () => {
  logger.info("Requête vers l'API");

  axios
    .get(urlApi)
    .then(response => response.data)
    .then(json => handleApiResponse(json))
    .catch(e => {
      logger.error("Erreur lors de la requête vers l'API");
      // eslint-disable-next-line no-console
      console.error(e);
    })
    .finally(() => {
      setTimeout(() => requestApi(), secondsBeforeNextApiRequest * 1000);
    });
};

logger.debug("Initialisation de l'application");
configureBadge();
configureNotifications();
requestApi();
