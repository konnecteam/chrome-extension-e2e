import { IMessageModel } from '../../models/i-message-model';
import { ChromeService } from '../../services/chrome/chrome-service';

/**
 * Service qui permet de gérer toutes les actions liées à la window
 */
export class WindowService {

  /**
   * Récupère l'url courant
   */
  public static getCurrentUrl(message : IMessageModel) : void {
    ChromeService.sendMessage({
      control: message.control,
      frameUrl: window.location.href
    });
  }

  /**
   * Récupère la taille de l'écran courant
   */
  public static getViewPortSize(message : IMessageModel) : void {
    ChromeService.sendMessage({
      control: message.control,
      coordinates: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  /**
   * Permet de faire un reload de la page
   */
  public static reload(message : IMessageModel, callback? : () => void) : void {

    if (message && message.hasOwnProperty('control') && message.control === 'reload-page') {

      // Si une callback est passé, on l'exécute avant de reload
      if (callback) {
        callback();
      }

      window.location.reload();
    }
  }

  /**
   * Dispatch un event
   */
  public static dispatchEvent(event : CustomEvent) : void {
    window.dispatchEvent(event);
  }

  /**
   * Ajout d'un listener sur un event
   */
  public static addEventListener(event : string, callback : (event?) => void, options? : boolean | AddEventListenerOptions) : void {
    window.addEventListener(event, callback, options);
  }

  /**
   * Supprime un listener sur un event
   */
  public static removeEventListener(event : string, callback : (event?) => void, options? : boolean | AddEventListenerOptions) : void {
    window.removeEventListener(event, callback, options);
  }
}