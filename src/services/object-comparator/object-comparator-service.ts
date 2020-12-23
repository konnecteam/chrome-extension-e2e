/**
 * Service qui permet de comparer des objets
 */
export class ObjectComparatorService {

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
}