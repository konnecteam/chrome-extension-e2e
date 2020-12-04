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
   * Permet de définir une couleur
   */
  public static setBadgeBackgroundColor(color : string) : void {
    chrome.browserAction.setBadgeBackgroundColor({ color });
  }

  /**
   * Permet d'exécuter un script
   */
  public static executeScript(details : chrome.tabs.InjectDetails, callback? : (result : any[]) => void) : void {
    chrome.tabs.executeScript(details, callback);
  }

  /**
   * Permet de récupérer des info via une query
   */
  public static query(queryInfo : chrome.tabs.QueryInfo, callback : (result : chrome.tabs.Tab[]) => void) : void {
    chrome.tabs.query(queryInfo, callback);
  }

  /**
   * Permet de télécharger un fichier
   */
  public static download(content : File, filename : string) : void {
    chrome.downloads.download({
      url: URL.createObjectURL(content),
      filename,
      saveAs: true
    });
  }

  /**
   * Permet de récupérer l'url d'un fichier
   */
  public static getUrl(url : string) : string {
    return chrome.extension.getURL(url);
  }
}