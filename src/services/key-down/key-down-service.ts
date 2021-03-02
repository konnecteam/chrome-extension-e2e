import { ChromeService } from './../chrome/chrome-service';
import { EventModel } from './../../models/event-model';
import domEventsToRecord from '../../constants/dom-events-to-record';
import actionEvents from '../../constants/action-events';
import elementsTagName from '../../constants/elements-tagName';

/**
 * Service qui permet de gérer les keydown pour un sélecteur
 */
export class KeyDownService {

  /** Instance de classe */
  public static instance : KeyDownService;

  /** Liste des keydown enregistrés */
  private _listsKeyDown : EventModel[] = [];

  /**
   * Constructeur
   */
  constructor() { }

  /**
   * Singleton
   */
  public static get Instance() : KeyDownService {
    if (KeyDownService.instance == null) {
      KeyDownService.instance = new KeyDownService();
    }
    return KeyDownService.instance;
  }

  /**
   * Permet de gérer les evènement keydown
   */
  public handleEvent(msg : EventModel, element : HTMLElement) : void {
    // On vérifie que l'event est un keydown et que ce n'est pas un input ou que c'est un input de liste
    if (msg.action === domEventsToRecord.KEYDOWN) {
      if (!msg.value && element.tagName !== elementsTagName.INPUT.toUpperCase() ||  this._isInputList(element)) {
        // On récupère l'event
        this._handleKeyDownEvent(msg);
      }
    } else if (this._listsKeyDown.length > 0) {

      // On récupère la liste des keydowns
      ChromeService.sendMessage(this._processListsKeydown());
      this._listsKeyDown = [];
    }
  }

  /**
   * Permet de gérer la liste des évènements pour un sélecteur
   */
  private _handleKeyDownEvent(msg : EventModel) : EventModel {

    if (this._listsKeyDown.length > 0) {

      // Si le premier élément à le même action et même sélecteur on enregistre tous les évènements
      // Pour ce même sélecteur
      if (this._listsKeyDown[0].action === domEventsToRecord.KEYDOWN && this._listsKeyDown[0].selector !== msg.selector) {

        // dans le cas contraire on envoie la liste qu'on à déja
        // et on traite la liste des keydown
        msg = this._processListsKeydown();
        this._listsKeyDown = [];
      }
    }

    this._listsKeyDown.push(msg);

    return msg;
  }

  /**
   * Permet de traité les key down
   */
  private _processListsKeydown() {

    // Contien la liste des clés des keydown
    let value = '';

    for (let i = 0; i < this._listsKeyDown.length; i++) {

      const currentMsg = this._listsKeyDown[i];

      // Si le keydown event contient uniquement une touche
      if (currentMsg.key.length === 1) {
        // On concataine la valeur
        value += currentMsg.key;
      } else {

        // Gestion du backspace
        if (currentMsg.key === 'Backspace') {
          value = value.slice(0, -1);
        }

        // Gestion de la touche entré
        if (currentMsg.key === 'Enter') {
          value += '<br/>';
        }
      }
    }

    // On définit le premier élément
    this._listsKeyDown[0].value = value;
    this._listsKeyDown[0].action = actionEvents.LISTKEYDOWN;
    return this._listsKeyDown[0];
  }

  /**
   * Verifie si c'est un input de list
   */
  private _isInputList(element : HTMLElement) : boolean {
    let listbox = '';
    // On verifié si c'est un input d'une dropdown list
    listbox = element.getAttribute('aria-owns');

    if (!listbox) {
      // On vérifie si c'est le input d'une liste multiple select liste
      listbox = element.getAttribute('aria-describedby');
      if (!listbox) return false;
    }

    return listbox && listbox.includes('kdp');
  }

  /**
   * Récupère les évènements liés au clic de la souris
   */
  public getClickCoordinates(evt) {
    const eventsWithCoordinates = {
      mouseup: true,
      mousedown: true,
      mousemove: true,
      mouseover: true
    };
    return eventsWithCoordinates[evt.type] ? { x: evt.clientX, y: evt.clientY } : null;
  }
}