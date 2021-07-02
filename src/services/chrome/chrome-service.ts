/**
 * Service Global qui permet la gestion des action chrome
 */
export class ChromeService {

  /**
   * Permet d'envoyer des messages
   */
  public static sendMessage(object : any) : void {
    chrome.runtime.sendMessage(object);
  }

  /**
   * Ajout d'un listener de message
   */
  public static addOnMessageListener(callback : () => void) : void {
    chrome.runtime.onMessage.addListener(callback);
  }

  /**
   * Supprime le listener de callback
   */
  public static removeOnMessageListener(callback : () => void) : void {
    chrome.runtime.onMessage.removeListener(callback);
  }

  /**
   * Ajoute un listener sur le onComplete
   */
  public static addOnCompletedListener(callback : () => void) : void {
    chrome.webNavigation.onCompleted.addListener(callback);
  }

  /**
   * Ajoute un listener sur le onComplete
   */
  public static removeOnCompletedListener(callback : () => void) : void {
    chrome.webNavigation.onCompleted.removeListener(callback);
  }

  /**
   * Ajoute un listener sur le onBeforeNavigate
   */
  public static addOnBeforeNavigateListener(callback : () => void) : void {
    chrome.webNavigation.onBeforeNavigate.addListener(callback);
  }

  /**
   * Ajoute un listener sur le onBeforeNavigate
   */
  public static removeOnBeforeNavigateListener(callback : () => void) : void {
    chrome.webNavigation.onBeforeNavigate.removeListener(callback);
  }

  /**
   * Ajoute un listener sur le onCommitted
   */
  public static addOnCommittedListener(callback : () => void) : void {
    chrome.webNavigation.onCompleted.addListener(callback);
  }

  /**
   * Ajoute un listener sur le onCommitted
   */
  public static removeOnCommittedListener(callback : () => void) : void {
    chrome.webNavigation.onCompleted.removeListener(callback);
  }

  /**
   * Permet de définir une icone
   */
  public static setIcon(path : string) : void {
    chrome.browserAction.setIcon({ path });
  }

  /**
   * Permet de définir un badge
   */
  public static setBadgeText(text : string) : void {
    chrome.browserAction.setBadgeText({ text });
  }

  /**
   * Permet de récupérer le bage
   */
  public static async getBadgeText() : Promise<string> {

    try {

      const currentTab = await this.getCurrentTabId();
      return new Promise((resolve, reject) => {

        chrome.browserAction.getBadgeText({ tabId : currentTab.id }, result => {
          if (result === 'non-tab-specific') {

            reject('problem with tabId');
          } else {

            resolve(result);
          }
        });
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Permet de définir une couleur
   */
  public static setBadgeBackgroundColor(color : string) : void {
    chrome.browserAction.setBadgeBackgroundColor({ color });
  }

  /**
   * Permet de récupérer l'id du tab courrant
   */
  public static async getCurrentTabId() : Promise<{id : number, url : string}> {
    return new Promise(async (resolve, reject) => {
      const tabs = await this._query({
        active : true,
        currentWindow : true
      });
      if (tabs && tabs[0]) {
        resolve({id : tabs[0].id, url : tabs[0].url});
      } else {
        reject('tabs is undefined');
      }
    });
  }

  /**
   * Permet d'exécuter un script
   */
  public static executeScript(details : chrome.tabs.InjectDetails) : Promise<boolean> {
    return new Promise((resolve, reject) => {
      chrome.tabs.executeScript(details, () => {
        resolve(true);
      });
    });
  }

  /**
   * Permet de récupérer des info via une query
   */
  private static async _query(queryInfo : chrome.tabs.QueryInfo) : Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(queryInfo, (result : chrome.tabs.Tab[]) => {
        resolve(result);
      });
    });
  }

  /**
   * Permet d'envoyer des messages au content-script pour qu'il les envoie à PollyRecorder
   * @param message
   */
  public static async sendMessageToContentScript(message : string) : Promise<void> {

    try {

      const tabs = await this._query({
        currentWindow : true,
        active : true
      });

      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          control : message
        });
      }
    } catch (err) {
    }
  }


  /**
   * Suppression des données d'un site à partir de l'url
   * @param url
   */
  public static async removeBrowsingData(url : string) : Promise<void> {
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 7 * 52;
    const oneYearAgo = (new Date()).getTime() - millisecondsPerYear;
    return new Promise<void>((resolve, err) => {
      chrome.browsingData.remove({
        'since': oneYearAgo,
        'origins' : [url]
      } as any, {
        'cacheStorage': true,
        'cookies': true,
        'fileSystems': true,
        'indexedDB': true,
        'localStorage': true,
        'serviceWorkers': true,
        'webSQL': true
      } as any, () => {
        resolve();
      });
    });
  }

  /**
   * Permet de télécharger un fichier
   */
  public static download(content : File, filename : string) : Promise<void> {

    return new Promise((resolve, reject) => {
      chrome.downloads.download({
        url : URL.createObjectURL(content),
        filename,
        saveAs : true
      }, (downloadId : number) => {

        if (downloadId) {

          resolve();
        } else {
          // chrome.runtime.lastError contient la raison de l'erreur
          reject(chrome.runtime.lastError);
        }
      });
    });
  }

  /**
   * Permet de récupérer l'url d'un fichier
   */
  public static getUrl(url : string) : string {
    return chrome.extension.getURL(url);
  }
}