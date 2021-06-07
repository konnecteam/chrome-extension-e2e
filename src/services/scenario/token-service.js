const atob = require('atob');
const RequestService = require('./request-service');

/**
 * Ce service permet de modifier des tokens
 */
class TokenService {

  /** On cherche le token utilisé pour le scénario*/
  static findToken(currentToken) {

    // On cherche le taken
    let token = '';
    for (let c = 0; c < currentToken.length; c++) {

      if (currentToken.charAt(c).match(/[a-zA-Z0-9_%=]/g)) {
        token += currentToken.charAt(c);
      }
      else {
        return token;
      }
    }
    return token;
  }

  /**
   * Remplace le token pour mettre le bon
   * @param {*} listToken 
   * @param {*} harContent 
   * @returns 
   */
  static replaceToken(listToken, harContent) {
    for (let i = 1; i < listToken.length; i++) {
      let currentToken = listToken[i];
      let token = this.findToken(currentToken);
      // On verifie la validitée du token :
      try {
        let t = atob(token);
        if (t.split('|').length == 3) {
          RequestService.getInstance().setHarContent(harContent
            .split(token)
            .join(Buffer.from('anonymous|_MASTER_|0')
              .toString('base64')));
          return;
        }
      }
      catch (e) {
      }
    }
  }
}

module.exports = TokenService;
