import { KeyDownService } from './../key-down/key-down-service';
import { SelectorService } from './../selector/selector-service';
import { IMessage } from '../../interfaces/i-message';
import { PasswordService } from '../../services/password/password-service';
import { ComponentManager } from '../../manager/component-manager';
import { EventMessageFactory } from '../../factory/message/event-message-factory';

// Constant
import TAG_NAME from '../../constants/elements/tag-name';
import DOM_EVENT from '../../constants/events/events-dom';


/**
 * Service qui permet de traiter les events capturés
 */
export class EventService {

  /**
   * Vérifie si l'event est un event à traiter
   */
  public static continueEventTreatment(previousEvent : any, currentEvent : any, previousMessage : IMessage) : boolean {

    // Si un evènement précédent est toujours en cours ou qu'aucun élément n'est capturé on ne continue pas le traitement
    if (previousEvent && (previousEvent.timeStamp === currentEvent.timeStamp || !currentEvent.target)) {
      return false;
    }

    /**
     * Si c'est un keydown on arrête tout pour pas envoyer les caractères
     * qui composent le mot de passe
     */
    if (currentEvent.target.tagName === TAG_NAME.INPUT.toUpperCase()
    && currentEvent.target.type === 'password' && currentEvent.type === DOM_EVENT.KEYDOWN) {
      return false;
    }

    /**
     * On verifie si l'element qui a déclenché le submit
     * et le même que celui de l'event précédent
     * si c'est le cas c'est qu'il n'y a pas besoin
     * de garder le submit car il y a eu une detection de clique
     * sur l'event précédant donc on le traite pas
     */
    if (currentEvent.type === DOM_EVENT.SUBMIT && previousEvent.type === DOM_EVENT.CLICK
      && currentEvent.submitter === previousEvent.target) {
      return false;
    }

    /* Si on récupère un lien directement dans un body
     * Alors c'est qu'on a utilisé un window.open et ouvert un autre onglet
     * donc on l'ignore car l'élement n'existe pas
     */
    if (currentEvent.target.tagName === TAG_NAME.LINK.toUpperCase()
        && currentEvent.target.getAttribute('target') === '_blank'
      ) {
      return false;
    }

    /**
     * Dans les file drop zone lors d'un change input file
     * un click est catché mais on ne veut pas du click car il n'est pas utile
     */
    if (currentEvent.target.type === 'file' && currentEvent.target.tagName === TAG_NAME.INPUT.toUpperCase()
      && currentEvent.type === DOM_EVENT.CLICK && previousMessage.action === DOM_EVENT.CLICK) {
      return false;
    }

    return true;
  }

  /**
   * Permet de gérer la valeur de l'event
   */
  public static valueEvent(currentEvent : any) : string {
    /**
     * Si c'est un input de type password et que c'est un event de type change
     * il faut changer la value
     */
    if (currentEvent.target.tagName === TAG_NAME.INPUT.toUpperCase() && currentEvent.target.type === 'password' && currentEvent.type === DOM_EVENT.CHANGE) {

      return PasswordService.generate();
    } else {
      return '';
    }
  }

  /**
   * Permet de gérer le selecteur de l'event
   */
  public static selectorEvent(currentEvent : any, previousSelector : string) : string {

    if (currentEvent.target.type === 'file' && currentEvent.target.tagName === TAG_NAME.INPUT.toUpperCase()
      && currentEvent.type === DOM_EVENT.CHANGE) {

      return previousSelector;
    } else {

      return SelectorService.Instance.find(currentEvent.target);
    }
  }

  /**
   * Permet de récupérer un commentaire si necessaire
   */
  public static commentsEvent(selector : string) {

    // On vérifie si le sélecteur est ambigu (plus de deux réponses)
    if (document.querySelectorAll(selector).length > 1) {

      return `/!\\ Le sélécteur a retourné plus d'un élément, il risque d'y avoir une erreur`;
    } else {

      return '';
    }
  }

  /**
   * Permet de récupérer le IMessage lié à l'event
   */
  public static messageEvent(currentEvent : any, selector : string, value : string, durancyClick : number
    , comments : string, filesUpload : FileList) : IMessage {

    let message : IMessage = {
      selector : SelectorService.Instance.standardizeSelector(selector),
      comments,
      value : value ? value : currentEvent.target.value,
      tagName : currentEvent.target.tagName,
      action : currentEvent.type,
      typeEvent : currentEvent.type,
      key : currentEvent.key ? currentEvent.key : null,
      keyCode : currentEvent.keyCode ? currentEvent.keyCode : null,
      href : currentEvent.target.href ? currentEvent.target.href : null,
      durancyClick  : durancyClick ? durancyClick : 0,
      clickCoordinates : KeyDownService.Instance.getClickCoordinates(currentEvent),
      scrollY : window.pageYOffset,
      scrollX : window.pageXOffset,
      submitterSelector : currentEvent.submitter ? SelectorService.Instance.find(currentEvent.submitter) : ''
    };

    // On vérifie si un composant est concerné par l'event
    const component = ComponentManager.getComponent(message.typeEvent, currentEvent.target);

    if (component) {

      message = EventMessageFactory.buildMessageEvent(component, message, filesUpload);
    }

    return message;
  }
}