import { SelectorService } from './../services/selector/selector-service';
import { ComponentModel } from './../models/component-model';
import  elementsTagName  from '../constants/elements-tagName';
import { EventModel } from './../models/event-model';
import { KeyDownService } from '../services/key-down/key-down-service';
import { StorageService } from '../services/storage/storage-service';
import eventsToRecord from '../constants/dom-events-to-record';
import { ChromeService } from '../services/chrome/chrome-service';
import { WindowService } from '../services/window/window-service';
import { PollyService } from '../services/polly/polly-service';
import { ComponentManager } from '../manager/component-manager';
import { EventMessageBuilderFactory } from '../factory/message-builder/event-message-builder-factory';

/**
 * Enregistre les intéractions de l'utilisateur avec la page
 */
class EventRecorder {

  // event
  /** élément précédant */
  private _previousEvent : Event;

  // Boolean
  /** Utilisation de la regex pour les data attribute */
  private _useRegexForDataAttribute : boolean;

  // services
  /** Service qui permet de gérer les keydown */
  private _keyDownService : KeyDownService;

  /** Liste des data attributes */
  private _dataAttributes : any = [];

  /** Liste des events à ecouter */
  private _events;

  /** Savoir si on a déjà injecté le script */
  private _isAlreadyInjected : boolean = false;

  /** Savoir si on traite un event */
  private _isRecordTreated : boolean;

  /** Selecteur de l'élément de l'event précédant */
  private _previousSelector = null;

  /** Contient les informations de la dernière K list détéctée */
  private _previousKList : { selector : string; typeList :
     string; element : Element; };

  /** Time de départ d'un mousesdown */
  private _startMouseDown : number;

  constructor() {

    // Boolean
    this._useRegexForDataAttribute = false;

    // Service
    this._keyDownService = KeyDownService.Instance;
    this._events = Object.values(eventsToRecord);

    // Enregistre les informations avant un click d'un item de list
    this._previousKList = {selector: '', typeList: '', element: null};
    this._init();
  }

  /**
   * Initialisation
   */
  private _init() : void {

    // Le document est totalement chargé ?
    if (document.readyState === 'complete') {

      // On inject le script et on clone le body courant
      this.injectScript();
      (window as any).saveBody = document.cloneNode(true);
    }

    // écoute de l'évènement before unload
    window.onbeforeunload = () => {
      WindowService.dispatchEvent(new CustomEvent(PollyService.GET_HAR_ACTION));
    };

    // écoute du state change pour cloner de nouveau le body
    document.onreadystatechange = () => {
      if (document.readyState === 'interactive') {
        this.injectScript();
      }
      (window as any).saveBody = document.cloneNode(true);
    };
  }

  /**
   * Permet d'injecter le script dans le dom de la page
   */
  public injectScript() : void {
    if (chrome && chrome.extension && !this._isAlreadyInjected) {
      const script = document.createElement('script');
      script.async = false;
      script.defer = false;
      script.setAttribute('src', ChromeService.getUrl(PollyService.POLLY_SCRIPT_PATH));
      (document.head || document.documentElement).prepend(script);
      this._isAlreadyInjected = true;
    }
  }

  /**
   * Démarrage du recorder
   */
  public start() {

    // Récupération des options
    StorageService.get(['options'], data => {

      // mise à jour des options
      this._updateOptions(data.options);

      if (!(window as any).pptRecorderAddedControlListeners) {
        this._addAllListeners(this._events);
        (window as any).pptRecorderAddedControlListeners = true;
      }

      // Ajout d'un listener afin d'écouter les messages du background
      if (!(window.document as any).pptRecorderAddedControlListeners && chrome.runtime && chrome.runtime.onMessage) {

        const boundedGetCurrentUrl = WindowService.getCurrentUrl.bind(this);
        const boundedGetViewPortSize = WindowService.getViewPortSize.bind(this);
        const boundedGetResult = this._getResult.bind(this);

        ChromeService.addOnMessageListener(boundedGetCurrentUrl);
        ChromeService.addOnMessageListener(boundedGetViewPortSize);
        ChromeService.addOnMessageListener(boundedGetResult);

        (window as any).document.pptRecorderAddedControlListeners = true;
        window.addEventListener('message', this._sendPollyResult.bind(this), false);
      }

      // On observe les changement et on ajoute un listener sur les inputs
      (window as any).observer = new MutationObserver(this._listenerObserver);
      (window as any).observer.observe(document, {childList: true, subtree: true});

      ChromeService.sendMessage({ control: 'event-recorder-started' });
    });
  }

  /**
   * Record des events
   */
  private _recordEvent(e : any) : void {

    let filesUpload : FileList = null;
    let durationClick : number = null;
    this._isRecordTreated = false;

    // Si aucun évènement capturé on met à jour la variable et on ne fait rien
    if (!e.target) {
      this._isRecordTreated = true;
      return;
    }

    // si des fichiers sont en cours de transfère on les stocks
    if (e.dataTransfer) {
      filesUpload = e.dataTransfer.files;
    }

    // Gestion de la durée du click (principalement pour les input numérique)
    if (e.type === eventsToRecord.MOUSEDOWN) {
      this._startMouseDown = Date.now();
      return;
    }

    if (e.type === eventsToRecord.CLICK) {
      durationClick = Date.now() - this._startMouseDown;
    }

    // Si un evènement précédent est toujours en cours on ne fait rien
    if (this._previousEvent && this._previousEvent.timeStamp === e.timeStamp) {
      return;
    }

    let customAttribute = null;

    // Gestion des cutom attributes
    if (this._dataAttributes && this._dataAttributes.length && e.target.hasAttribute) {
      // On recherche les custom attributes
      const targetAttributes = e.target.attributes;
      // Ordre des patterns sont important
      this._dataAttributes.find(patternAttr => {
        const regexp = RegExp(patternAttr);
        // On test chaques attribute avec le pattern
        for (let i = 0; i < targetAttributes.length; i++) {
          // Regex ou string test
          if (this._useRegexForDataAttribute ? regexp.test(targetAttributes[i].name) : patternAttr === targetAttributes[i].name) {
            customAttribute = targetAttributes[i].name;

            // La recherche est terminé
            // On traite les cas spéciaux des customs attributes
            customAttribute = SelectorService.manageSpecialCase(customAttribute);
            return true;
          }
        }
        return false;
      });
    }

    // définition du selecteur
    let selector = '';
    if (e.target.type === 'file' && e.target.tagName === elementsTagName.INPUT.toLocaleUpperCase() && e.type === eventsToRecord.CHANGE) {
      selector = this._previousSelector;
    } else {
      selector = customAttribute
        ? SelectorService.formatDataOfSelector(e.target, customAttribute)
        : SelectorService.find(e.target);
    }

    let comments = '';

    // On vérifie si le sélecteur est ambigu (plus de deux réponses)
    if (customAttribute && document.querySelectorAll(selector).length > 1) {
      comments = '/!\\ The selector returns more than one element, thus the test will be wrong.';
    }

    // construction du message model: EventModel
    let message : EventModel;
    message = {
      selector: SelectorService.standardizeSelector(selector),
      comments,
      value: e.target.value,
      tagName: e.target.tagName,
      action: e.type,
      typeEvent: e.type,
      key: e.key ? e.key : null,
      keyCode: e.keyCode ? e.keyCode : null,
      href: e.target.href ? e.target.href : null,
      durancyClick: durationClick ? durationClick : 0,
      coordinates: this._keyDownService.getCoordinates(e),
      scrollY: window.pageYOffset,
      scrollX: window.pageXOffset
    };

    // On vérifie si un composant est concerné par l'event
    const component = ComponentManager.determinateComponent(message.typeEvent, e.target, this._previousKList);

    /* Si c'est le cas et qu'on a un previousElement
       c'est que on a une klist, on update donc la value des k list
    */
    if (component && component.previousElement) {
      this._previousKList = component.previousElement;
    }

    // Si on a un component on edit le message de l'event
    if (component) {
      message = EventMessageBuilderFactory.buildMessageEvent(component, message, filesUpload);
    }
    // On vérifie si on a eu des keydown ou si on a fini les keydown et dans ce cas on modifie le message car c'est un listkeydown
    this._keyDownService.handleEvent(message, e.target);
    this._previousEvent = e;
    this._previousSelector = selector;
    ChromeService.sendMessage(message);
    this._isRecordTreated = true;

  }

  /**
   * Observer des listener
   */
  private async _listenerObserver(mutationList) {
    // On bloque l'update du window.saveBody que l'on copie, tant qu'on traite l'event
    while (!(window as any).eventRecorder._isRecordTreated) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // On bind la méthode de record des events
    const boundedRecordEvent = ((window as any).eventRecorder as EventRecorder)._recordEvent.bind(
      (window as any).eventRecorder
    );

    for (const mutation of mutationList) {

      for (const child of mutation.addedNodes) {
        // Si pn a une iframe on rajoute les listener car de base il n'y en pas
        if (child.tagName === elementsTagName.IFRAME.toUpperCase()) {

          (window as any).eventRecorder._events.forEach(type => {
            child.contentDocument.addEventListener(type, boundedRecordEvent, true);
          });
        }

        // Si ona un input file on rajoute le listener des change
        if (child.tagName === elementsTagName.INPUT.toUpperCase() && child.type === 'file') {

          child.addEventListener('change', boundedRecordEvent, false);
        }

        /* Si on a une balise style aurelia-hide, on l'a supprime
           car elle apparait à cause l'injection du scripts
        */
        if (child.tagName === 'STYLE' && child.parentElement.tagName === 'BODY') {

          if (child.textContent === '.aurelia-hide { display:none !important; }') {

            child.remove();
          }
        }

      }
    }

    (window as any).saveBody = document.cloneNode(true);
  }

  /**
   * Ajout des listeners
   *
   */
  private _addAllListeners(events) : void {
    const boundedRecordEvent = this._recordEvent.bind(this);

    events.forEach(type => {
      window.addEventListener(type, boundedRecordEvent, true);
    });
  }

  /**
   * Mise à jour des options
   */
  private _updateOptions(options : {[key : string] : any}) : void {
    const dataAttribute = options.code.dataAttribute;
    const useRegexForDataAttribute = options.code.useRegexForDataAttribute;
    if (dataAttribute) {
      this._dataAttributes = dataAttribute.split(' ').filter(f => f !== '').map(f => {
        if (useRegexForDataAttribute) {
          return new RegExp(f);
        } else {
          return f;
        }
      });
    }

    this._useRegexForDataAttribute = useRegexForDataAttribute;

    StorageService.setData({
      useRegexForDataAttribute: this._useRegexForDataAttribute
    });
  }

  /**
   * Permet d'envoyer le résultat de pollyJS
   */
  private _sendPollyResult(event) : void {

    // On demande à récupérer le har
    if (event?.data.action === PollyService.GOT_HAR_ACTION) {

      // On diffuse le message
      ChromeService.sendMessage({
        control : 'get-result',
        recordingId : event.data.payload.recordingId,
        result : event.data.payload.result
      });
    }
  }

  /**
   * Récupère les résultats de pollyJS
   */
  private _getResult(message) : void {
    if (message && message.hasOwnProperty('control') && message.control === 'get-result') {
      WindowService.dispatchEvent(
        new CustomEvent(PollyService.GET_HAR_ACTION)
      );
    }
  }
}

// //usefull when we start record with buttom of plugin
// if (document.readyState == "complete") {
//   (window as any).eventRecorder.injectScript();
//   (window as any).saveBody = document.cloneNode(true);
// }

(window as any).eventRecorder = new EventRecorder();
(window as any).eventRecorder.start();

window.onbeforeunload = function() {
  const event = new CustomEvent(PollyService.GET_HAR_ACTION);
  window.dispatchEvent(event);
};