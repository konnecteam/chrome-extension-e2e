/**
 * Service qui permet la gestion des enregistrements depuis le background
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
  public static getDataAsync(keys : string[]) : Promise<{ [keys : string] : any }> {
    return new Promise((resolve, reject) => {

      chrome.storage.local.get(keys, data => {
        if (chrome.runtime.lastError) {

          reject(chrome.runtime.lastError);
        } else {

          resolve(data);
        }
      });
    });
  }

  /**
   * Supprime des données dans le local storage
   */
  public static removeDataAsync(key : string) : Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {

          reject(chrome.runtime.lastError);
        } else {

          resolve();
        }
      });
    });
  }
}