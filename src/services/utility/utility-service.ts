/**
 * Service utilitaire qui permet de verifier le contenu des objets
 */
export class UtilityService {

  /** Vérifie si la value passée en paramètre contient tous les éléments du tableau */
  public static isStringInTab(value : string, tab : string[]) : boolean {

    for (let i = 0; i < tab.length; i++) {
      if (!value.includes(tab[i])) {
        return false;
      }
    }
    return true;
  }
}