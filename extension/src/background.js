class AlderiateLive {

    constructor() {

        /**
         * L'URL du stream Twitch.
         * @type {string}
         */
        this.URL_STREAM = 'http://alderiate.com';

        /**
         * L'URL a appeler pour avoir les infos sur un stream.
         * @type {string}
         */
        this.API_URL_STREAM = 'http://kocal.fr:6840/';

        /**
         * @type {Boolean|null}
         */
        this.isOnline = null;

        this.updateStreamState();
        this.setupBadge();
        chrome.notifications.onClicked.addListener(_ => this._openStream());
    }

    /**
     * Configure le badge
     */
    setupBadge() {
        chrome.browserAction.onClicked.addListener(_ => this._openStream())
    }

    _openStream() {
        chrome.tabs.create({active: true, url: this.URL_STREAM})
    }

    /**
     * Met à jour l'état en-ligne/hors-ligne d'un stream en particulier, en appelant l'API Twitch.
     */
    updateStreamState() {
        console.info(new Date, "Mise à jour de l'état du stream...");

        // Connexion à l'API de Twitch
        fetch(this.API_URL_STREAM)
            .then(response => {
                if(response.ok) {
                    response.json().then(json => this.handleResponse(json))
                } else {
                    console.error(new Date(), "Mauvaise réponse du réseau", response);
                }
            })
            .catch(error => {
                console.error(new Date(), "Erreur avec la fonction fetch()", error)
            });

        this.prepareNextUpdate();
    }

    /**
     * Traite les données issues d'une requête à l'API Twitch.
     * @param {Object} json Les données en JSON retournées par l'API Twitch
     */
    handleResponse(json) {
        console.info(new Date, "Réponse bien récupérée", JSON.stringify(json, null, 2));

        let isOnline = !!json['streaming'];

        if (this.isOnline === false && isOnline === true) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: '../icons/alderiate_128.png',
                title: 'Alderiate est actuellement en live !',
                message: json['title']
            });
        }

        isOnline ? this.putOnline() : this.putOffline();
        this.isOnline = isOnline;
    }

    prepareNextUpdate () {
      const min = 1000;
      const max = 1200;
      const timeToWaitBeforeNextUpdate = (Math.random() * (max - min) + min) * 60;

      console.info(new Date, `Prochaine mise à jour de l'état du stream dans ${timeToWaitBeforeNextUpdate / 1000} secondes.`);
      setTimeout(_ => this.updateStreamState(), timeToWaitBeforeNextUpdate)
    }

    putOnline() {
        chrome.browserAction.setBadgeText({text: 'ON'});
        chrome.browserAction.setBadgeBackgroundColor({color: 'green'})
    }

    putOffline() {
        chrome.browserAction.setBadgeText({text: 'OFF'});
        chrome.browserAction.setBadgeBackgroundColor({color: 'gray'})
    }
}

window.AL = new AlderiateLive();
