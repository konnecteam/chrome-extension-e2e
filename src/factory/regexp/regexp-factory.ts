/**
 * Factory de RegExp
 */
export class RegExpFactory {

  /**
   * Permet de construire une regexp à partir d'une chaîne de caractères
   */
  public static buildRegeExp(userRegexp : string) : { regexp : string, flags : string } {

    const buildRegex = { regexp: '', flags: ''};

    const splitRegexp = userRegexp.split('/');

    // Si la regexp est mal formatée
    if ((splitRegexp.length < 3 )) {
      return buildRegex;
    }

    const flag = splitRegexp[splitRegexp.length - 1 ];

    // on enlève le premier '/' et le dernier '/'
    const splitWithoutSlash = splitRegexp.splice(1 , splitRegexp.length - 2);

    // on build la regexp
    const finalRexp = splitWithoutSlash.join('/');
    if (flag) {
      buildRegex.flags = flag;
    }

    buildRegex.regexp = finalRexp;
    return buildRegex;
  }
}