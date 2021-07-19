import { SelectorService } from './../selector/selector-service';
import { ElementService } from './../element/element-service';
import { ChromeService } from './../chrome/chrome-service';
import { IMessage } from '../../interfaces/i-message';
import { ETagName } from '../../enum/elements/tag-name';
import { ECustomEvent } from '../../enum/events/events-custom';
import { EDomEvent } from '../../enum/events/events-dom';

/**
 * Service qui permet de gérer les keydown pour un sélecteur
 */
export class KeyDownService {

  /** Instance de classe */
  public static instance : KeyDownService;

  /**
   * Value des touches
   */
  private static readonly _ENTER_KEY = 'Enter';
  private static readonly _BACKSPACE_KEY = 'Backspace';

  /** Liste des keydown enregistrés */
  private _listsKeyDown : IMessage[] = [];

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
  public handleEvent(msg : IMessage, element : HTMLElement) : void {

    // On vérifie que l'event est un keydown
    if (msg.action === EDomEvent.KEYDOWN) {

      // On gère le cas ou si c'est un user qui appuie sur la touche Entrer sur un bouton
      if (element.tagName === ETagName.BUTTON.toUpperCase() && msg.key === KeyDownService._ENTER_KEY) {

        // Si c'est le cas on tranforme le keydown en click
        msg.action = EDomEvent.CLICK;
        msg.typeEvent = EDomEvent.CLICK;
        return;
      }

      // On verifie si c'est un body car les textes areas sont parfois dans un body qui se trouve dans une iframe
      if (!msg.value && element.tagName === ETagName.BODY.toUpperCase() || element.tagName === ETagName.TEXTAREA.toUpperCase()
          || ElementService.getTextEditor(element) || ElementService.getInputList(element)) {

        // On récupère l'event
        this._handleKeyDownEvent(msg);
      }
    } else if (this._listsKeyDown.length > 0) {

      // On récupère la liste des keydowns
      ChromeService.sendMessage(this._listKeydownProcess());

      this._listsKeyDown = [];
    }
  }

  /**
   * Permet de gérer la liste des évènements pour un sélecteur
   */
  private _handleKeyDownEvent(msg : IMessage) : IMessage {

    if (this._listsKeyDown.length > 0) {

      // Si le premier élément à le même action et même sélecteur on enregistre tous les évènements
      // Pour ce même sélecteur
      if (this._listsKeyDown[0].action === EDomEvent.KEYDOWN && this._listsKeyDown[0].selector !== msg.selector) {

        // dans le cas contraire on envoie la liste qu'on a déja
        // et on traite la liste des keydown
        msg = this._listKeydownProcess();
        this._listsKeyDown = [];
      }
    }

    this._listsKeyDown.push(msg);

    return msg;
  }

  /**
   * Permet de traiter les keydowns
   */
  private _listKeydownProcess () : IMessage {

    // Si le list keydown concerne le text editor on utilise le processus spécifique
    if (ElementService.getTextEditor(document.querySelector(this._listsKeyDown[0].selector))) {

      return this._textEditorListKeydownProcess();
    } else {

      return this._standardProcess();
    }
  }

  /**
   * Processus pour le text editor du list keydown
   */
  private _textEditorListKeydownProcess() : IMessage {

    const event = this._listsKeyDown[this._listsKeyDown.length - 1 ];
    event.action = ECustomEvent.LIST_KEYDOWN_EDITOR;
    event.selector = SelectorService.Instance.standardizeSelector(event.selector);
    return event;
  }

  /**
   * Processus standard d'un listkeydown
   */
  private _standardProcess() : IMessage {
    // Contient la liste des clés des keydowns
    let value = '';

    for (let i = 0; i < this._listsKeyDown.length; i++) {

      const currentMsg = this._listsKeyDown[i];

      // Si le keydown event contient uniquement une touche
      if (currentMsg.key.length === 1) {
        // On concataine la valeur
        value = `${value}${currentMsg.key}`;
      } else {

        // Gestion du backspace
        if (currentMsg.key === KeyDownService._BACKSPACE_KEY) {
          value = value.slice(0, -1);
        }

        // Gestion de la touche entrée
        if (currentMsg.key === KeyDownService._ENTER_KEY) {

          // Pour faire un retour à la ligne dans un memo il faut utilise une balise br car \n ne fonctionne pas
          value = `${value}<br/>`;
        }
      }
    }

    // On définit le premier élément
    this._listsKeyDown[0].value = value;
    this._listsKeyDown[0].action = ECustomEvent.LIST_KEYDOWN;
    return this._listsKeyDown[0];
  }

  /**
   * Récupère les évènements liés au clic de la souris
   */
  public getClickCoordinates(evt) {
    const eventsWithCoordinates = {
      mouseup : true,
      mousedown : true,
      mousemove : true,
      mouseover : true
    };
    return eventsWithCoordinates[evt.type] ? { x : evt.clientX, y : evt.clientY } : null;
  }
}