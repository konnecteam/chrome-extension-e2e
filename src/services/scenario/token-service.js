/**
 * Ce service permet de modifier des tokens
 */
class TokenService {

  /** On cherche le token utilisé pour le scénario*/
  static findToken(currentToken) {

    // On cherche le token
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
}

module.exports = TokenService;
