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
    chrome.action.setIcon({ path });
  }

  /**
   * Permet de définir un badge
   */
  public static setBadgeText(text : string) : void {
    chrome.action.setBadgeText({ text });
  }

  /**
   * Permet de récupérer le bage
   */
  public static async getBadgeTextAsync() : Promise<string> {

    const currentTab = await this.getCurrentTabAsync();
    return new Promise((resolve, reject) => {

      chrome.action.getBadgeText({ tabId : currentTab.id }, result => {
        if (result === 'non-tab-specific') {

          reject('problem with tabId');
        } else {

          resolve(result);
        }
      });
    });
  }

  /**
   * Permet de définir une couleur
   */
  public static setBadgeBackgroundColor(color : string) : void {
    chrome.action.setBadgeBackgroundColor({ color });
  }

  /**
   * Permet de récupérer l'id du tab courrant
   */
  public static async getCurrentTabAsync() : Promise<{id : number, url : string}> {
    return new Promise(async (resolve, reject) => {
      const tabs = await this._queryAsync({
        active : true
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
  public static async executeScript(details : any, allFrames : boolean = false) : Promise<boolean> {
    const currentTab = await this.getCurrentTabAsync();
    const params : chrome.scripting.ScriptInjection<any[], unknown> = {
      ...details,
      target: { tabId: currentTab.id, allFrames }
    };
    await chrome.scripting.executeScript(params);
    return true;
  }

  /**
   * Permet de récupérer des info via une query
   */
  private static async _queryAsync(queryInfo : chrome.tabs.QueryInfo) : Promise<chrome.tabs.Tab[]> {
    const tabs = await chrome.tabs.query(queryInfo);
    return tabs;
  }

  /**
   * Permet d'envoyer des messages au content-script pour qu'il les envoie à PollyRecorder
   */
  public static async sendMessageToContentScriptAsync(message : string) : Promise<void> {

    const tabs = await this._queryAsync({
      currentWindow : true,
      active : true
    });

    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        control : message
      });
    }
  }


  /**
   * Suppression des données d'un site à partir de l'url
   */
  public static async removeBrowsingDataAsync(url : string) : Promise<void> {
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
  public static download(content : File, filename : string) : void {
    ChromeService.downloadBlob(content, filename);
  }

  /**
   * Permet de récupérer l'url d'un fichier
   */
  public static getUrl(url : string) : string {
    return chrome.runtime.getURL(url);
  }

  /**
   * Permet de télécharger du contenu
   * https://stackoverflow.com/questions/73348151/downloading-a-large-blob-to-local-file-in-manifestv3-service-worker
   * Workaround qui permet de télécharger un fichier dans une extension manifest V3 (Il y aura potentiellement des solutions plus simples dans un futur proche)
   */
  public static async downloadBlob(blob : Blob, name : string, destroyBlob : boolean = true) {
    const send = async (dst : any, close : boolean) => {
      dst.postMessage({ blob, name, close }, destroyBlob ? [await blob.arrayBuffer()] : []);
    };

    if ('clients' in self) {
      const clients = await (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({ type: 'window' });
      const client = clients[0];
      if (client) {
        return send(client, false);
      }
    }

    self.addEventListener('message', e => {
      if (e.data === 'sendBlob') {
        self.removeEventListener('message', (e as any).listener);
        send(e.source, false);
      }
    });
  }
}