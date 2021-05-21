/**
 * Service qui permet de comparer des objets
 */
export class ObjectService {

  /**
   * Vérifie si object contient la value
   */
  public static isValueInObject(object : any, value : any) {

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
  public static isStringStartInTab(value : string, tab : string[]) {

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