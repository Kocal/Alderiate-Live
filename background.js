class AlderiateLive {

    constructor() {

        /**
         * Le CLIENT-ID de l'application pour utiliser l'API de Twitch.
         * @type {string}
         */
        this.CLIENT_ID = 'ohkwxw5a5g5h3kgm2g17uqbd1ayg7jr'

        /**
         * L'URL a appeler pour avoir les infos sur un stream.
         * @type {string}
         */
        this.API_URL_STREAM = 'https://api.twitch.tv/kraken/streams/alderiate'

        /**
         * L'URL du stream Twitch.
         * @type {string}
         */
        this.URL_STREAM = 'https://www.twitch.tv/alderiate'

        /**
         * Est-ce que le petit fréro est en-ligne ???
         * @type {Boolean|null}
         */
        this.isOnline = null

        this.updateStreamState()
        this.setupBadge()
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
        let xhr = new XMLHttpRequest()

        // Connection à l'API de Twitch
        xhr.open('GET', this.API_URL_STREAM, true)
        xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v3+json')
        xhr.setRequestHeader('Client-ID', this.CLIENT_ID)
        xhr.onreadystatechange = e => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                try {
                    this.handleResponse(JSON.parse(xhr.responseText))
                } catch (e) {
                    // Il y a du avoir une erreur pendant le parsing du JSON ??
                    console.info(e, xhr.responseText)
                }
            }
        }
        xhr.send(null)
    }

    /**
     * Traite les données issues d'une requête à l'API Twitch.
     * @param {Object} json Les données en JSON retournées par l'API Twitch
     */
    handleResponse(json) {
        let isOnline = json.stream !== null

        if (this.isOnline === false && isOnline === true) {
            chrome.notifications.create('xp4', {
                type: 'basic',
                iconUrl: '../icons/alderiate_128.png',
                title: 'Alderiate est actuellement en live !',
                message: json.stream.channel.status.trim()
            }, _ => chrome.notifications.onClicked.addListener(_ => this._openStream()))
        }

        isOnline ? this.putOnline() : this.putOffline()
        this.isOnline = isOnline
        setTimeout(_ => this.updateStreamState(), 60 * 1000)
    }

    /**
     * Affiche Xp4 en-ligne
     */
    putOnline() {
        chrome.browserAction.setBadgeText({text: 'ON'})
        chrome.browserAction.setBadgeBackgroundColor({color: 'green'})
    }

    /**
     * Affiche Xp4 hors-ligne
     */
    putOffline() {
        chrome.browserAction.setBadgeText({text: 'OFF'})
        chrome.browserAction.setBadgeBackgroundColor({color: 'gray'})
    }
}

new AlderiateLive()
