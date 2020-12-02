/**
 * Service qui permet la gestion des enregistrement depuis le background
 */
export class StorageService {

  /**
   * Sauvegarde un objet dans le local storage
   */
  public static setData(object : { [key : string] : any }) : void {
    chrome.storage.local.set(object);
  }

  /**
   * Permet de récupérer un objet
   */
  public static get(keys : string[] , callback? : (any) => void) : void {
    chrome.storage.local.get(keys, callback);
  }

  /**
   * Supprime des données dans le local storage
   */
  public static remove(key : string, callback? : () => void) : void {
    chrome.storage.local.remove(key, callback);
  }
}