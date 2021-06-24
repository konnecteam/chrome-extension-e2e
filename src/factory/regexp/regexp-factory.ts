/**
 * Factory de RegExp
 */
export class RegExpFactory {

  /**
   * Permet de construire une regexp à partir d'une chaîne de caractères
   * Exemple : /*.localhost.*\/g => regexp : *.localhost.*, flag : g
   */
  public static buildRegexpAndFlag(userRegexp : string) : { regexp : string, flag : string } {

    const object = { regexp: '', flag: ''};

    const splittedRegex = userRegexp.split('/');

    // Si la regexp est mal formatée
    if ((splittedRegex.length < 3 )) {
      return object;
    }

    const flag = splittedRegex[splittedRegex.length - 1];

    // on enlève le premier '/' et le dernier '/'et on a la regexp
    const regex = splittedRegex.splice(1, splittedRegex.length - 2).join('/');

    if (flag) {
      object.flag = flag;
    }

    if (regex) {
      object.regexp = regex;
    }

    return object;
  }
}