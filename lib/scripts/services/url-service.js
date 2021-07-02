const notNormalizeChar = [',', '(', ')', '{', '}', '[', ']', '|', '!', '*'];
const normalizeChar = ['%2C', '%28', '%29', '%7B', '%7D', '%5B', '%5D', '%7C', '%21', '%2A'];
const TokenService = require('./token-service');

/**
 * Service qui permet de modifier une url
 */
class UrlService {

  /** Permet de supprimer le datetime de certaines requêtes */
  static deleteDateTime(urlM) {
    let parseURL = new URL(urlM);
    let requestURL = [
      'document/picture/ctc/',
      'document/cnt',
      'document/rqt',
      'calendar/addDays',
      'autoroute/agowdte',
      'document/cpyaddr',
      'module/calendar'
    ];

    for (let request of requestURL) {

      if (urlM.includes(request)) {
        for (let pair of parseURL.searchParams.entries()) {
          let d = pair[1];
          //Si d est un nombre
          if (isNaN(d)) {
            // On le parse en date
            d = Date.parse(pair[1])
          }
          // Si la valeur est  < à 100000000  c'est un nombre et pas une date
          if (d && !isNaN(d) && d > 100000000) {
            // On supprime le paramètre
            parseURL.searchParams.delete(pair[0]);
          }

          if (pair[0] === 'date') {
            // On supprime la fin de la date car elle contient l'heure
            parseURL.searchParams.set(pair[0], pair[1].split('T')[0]);

          }
        }
        return parseURL.href;
      }
    }

    return urlM;
  }

  /**
   * Permet de supprimer le token de l'url
   */
  static deleteToken(url) {
    let splitURL = url.split('token=');
    if (splitURL.length > 1) {
      // On remplace le token de l'url par ''
      splitURL[1] = splitURL[1].replace(TokenService.findToken(splitURL[1]), '');
      return splitURL.join('token=');
    }
    return url;
  }

  /**
   * Permet d'encoder les caractères spéciaux de l'url
   */
  static getURLEncode(url) {
    let urlFinal = '';
    let urlSplit = url.split(':');

    if (urlSplit.length > 1) {
      let firstPart = urlSplit.shift();
      let secondPart = urlSplit.shift();
      urlFinal =
        `${firstPart}:${secondPart}${urlSplit.length !== 0 ? `:${urlSplit.join('%3A')}` : ''}`;
    }

    for (let i = 0 ; i < notNormalizeChar.length ; i++) {
      urlFinal = urlFinal.split(notNormalizeChar[i]).join(normalizeChar[i]);
    }

    const regexForPercent = /%[^a-zA-Z,^0-9]{1}/gm;
    const foundMatchPercent = urlFinal.match(regexForPercent);

    if (foundMatchPercent) {
      for (let i = 0 ; i < foundMatchPercent.length ; i++) {
        urlFinal = urlFinal.replace(foundMatchPercent[i], `%25${foundMatchPercent[i].slice(1)}`);
      }
    }
    return urlFinal;
  }
}

module.exports = UrlService;