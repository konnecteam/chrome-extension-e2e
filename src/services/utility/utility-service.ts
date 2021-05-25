/**
 * Service utilitaire qui permet de verifier le contenu des objets
 */
export class UtilityService {

  /**
   * Vérifie si un object quelconque contient une value quelconque
   */
  public static isValueInObject(object : any, value : any) : boolean {

    for (const property in object) {
      if (object[property] === value) {
        return true;
      }
    }

    return false;
  }

  /**
   * Vérifie si la value commence par une des string du tableau
   */
  public static isStringStartInTab(value : string, tab : string[]) : boolean {

    for (let index = 0; index < tab.length; index++) {
      const element = tab[index];

      if (value.startsWith(element)) return true;
    }

    return false;
  }

  /**
   * Verifie si une string inclut les strings du tableau
   * @param value
   * @param tab
   * @returns
   */
  public static isStringIncludesTabString(value : string, tab : string[]) : boolean {

    for (let i = 0; i < tab.length; i++) {
      if (!value.includes(tab[i])) {
        return false;
      }
    }
    return true;
  }
}