import { MessageModel } from './../models/message-model';
import { URLService } from './../services/url/url-service';
import { SelectorService } from './../services/selector/selector-service';
import elementsTagName from '../constants/elements-tagName';
import { EventModel } from './../models/event-model';
import { KeyDownService } from '../services/key-down/key-down-service';
import { StorageService } from '../services/storage/storage-service';
import eventsToRecord from '../constants/dom-events-to-record';
import { ChromeService } from '../services/chrome/chrome-service';
import { WindowService } from '../services/window/window-service';
import { PollyService } from '../services/polly/polly-service';
import { ComponentManager } from '../manager/component-manager';
import { EventMessageFactory } from '../factory/message/event-message-factory';
import controlMSG from '../constants/control-message';

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

  /** Fonction qui permet d'écouter les events */
  private _boundedRecordEvent : () => void = null;

  /** Fonction qui permet d'ecouter l'event onbeforeunload */
  private _boundedOnBeforeUnload : () => void = null;

  /** Fonction qui permet d'ecouter l'event du PollyRecorder */
  private _boundedSendPollyResult : () => void = null;

  /** Fonction qui permet d'ecouter les messages du RecordingController */
  private _boundedMessageControl : () => void = null;

  /** Selecteur de l'élément de l'event précédant */
  private _previousSelector = null;

  /** Contient les informations de la dernière K list détéctée */
  private _previousKList : {
    selector : string;
    typeList : string;
    element : Element;
  };

  /** Time de départ d'un mousesdown */
  private _startMouseDown : number;

  constructor() {

    // Boolean
    this._useRegexForDataAttribute = false;

    // Service
    this._keyDownService = KeyDownService.Instance;
    this._events = Object.values(eventsToRecord);

    // Enregistre les informations avant un click d'un item de list
    this._previousKList = { selector : '', typeList : '', element : null };
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

    /**
     * Quand on start,
     * On met loadingPage à flase
     * car on n'a pas reload
     * et il faut le définir
     */
    StorageService.setData({
      loadingPage: false
    });
    // Récupération des options
    StorageService.get(['options'], data => {

      // Mise à jour des options
      this._updateOptions(data.options);

      // Si On record les requests on initialise et inject le script polly
      if (data.options.code.recordHttpRequest) {
        this._init();
      } else {
        // On send au statup condig que PollyJS est prêt et qu'il peut donc charger les modules
        const event = new CustomEvent(controlMSG.POLLY_READY_EVENT);
        WindowService.dispatchEvent(event);
      }

      // Ajout d'un listener afin d'écouter les messages du background
      if (!(window.document as any).pptRecorderAddedControlListeners && chrome.runtime && chrome.runtime.onMessage) {
        this._addAllListeners(this._events);
      }

      // On observe les changement et on ajoute un listener sur les inputs
      (window as any).observer = new MutationObserver(this._listenerObserver);
      (window as any).observer.observe(document, { childList: true, subtree: true });

      ChromeService.sendMessage({ control: controlMSG.EVENT_RECORDER_STARTED_EVENT });
    });
  }

  /**
   * Permet de rediriger les messages dans la bonne méthode
   * @param message
   */
  private _messageControl(message : MessageModel) : void {

    if (message && message.hasOwnProperty('control')) {

      switch (message.control) {
        case controlMSG.GET_CURRENT_URL_EVENT:
          WindowService.getCurrentUrl(message);
          break;
        case controlMSG.GET_VIEWPORT_SIZE_EVENT:
          WindowService.getViewPortSize(message);
          break;
        case controlMSG.GET_RESULT_EVENT:
          this._getResult();
          break;
        case controlMSG.PAUSE_EVENT:
          this._doPause();
          break;
        case controlMSG.UNPAUSE_EVENT:
          this._doUnPause();
          break;
      }
    }
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

    // Si des fichiers sont en cours de transfère on les stocks
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
        // On test chaque attribute avec le pattern
        for (let i = 0; i < targetAttributes.length; i++) {
          // Regex ou string test
          if (this._useRegexForDataAttribute ? regexp.test(targetAttributes[i].name) : patternAttr === targetAttributes[i].name) {
            customAttribute = targetAttributes[i].name;

            // La recherche est terminée
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
    if (e.target.type === 'file' && e.target.tagName === elementsTagName.INPUT.toUpperCase() && e.type === eventsToRecord.CHANGE) {
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
    let message : EventModel = {
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
      coordinates: this._keyDownService.getClickCoordinates(e),
      scrollY: window.pageYOffset,
      scrollX: window.pageXOffset
    };

    // On vérifie si un composant est concerné par l'event
    const component = ComponentManager.determinateComponent(message.typeEvent, e.target, this._previousKList);

    /* Si c'est le cas et qu'on a un previousElement
       c'est que on a une konnect liste, on update donc la value des k list
    */
    if (component && component.previousElement) {
      this._previousKList = component.previousElement;
    }

    // Si on a un component on edit le message de l'event
    if (component) {
      message = EventMessageFactory.buildMessageEvent(component, message, filesUpload);
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
  private async _listenerObserver(mutationList : any[]) {
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
        // Si on a une iframe on rajoute les listener car de base il n'y en pas
        if (child.tagName === elementsTagName.IFRAME.toUpperCase()) {

          (window as any).eventRecorder._events.forEach(type => {
            child.contentDocument.addEventListener(type, boundedRecordEvent, true);
          });
        }

        // Si on a un input file on rajoute le listener des change
        if (child.tagName === elementsTagName.INPUT.toUpperCase() && child.type === 'file') {

          child.addEventListener('change', boundedRecordEvent, false);
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

    (window as any).document.pptRecorderAddedControlListeners = true;

    this._boundedMessageControl = this._messageControl.bind(this);
    ChromeService.addOnMessageListener(this._boundedMessageControl);

    this._boundedSendPollyResult = this._sendPollyResult.bind(this);
    WindowService.addEventListener('message', this._boundedSendPollyResult, false);


    // écoute de l'évènement before unload
    this._boundedOnBeforeUnload = this._onBeforeUnload.bind(this);
    WindowService.addEventListener('beforeunload', this._boundedOnBeforeUnload);

    this._boundedRecordEvent = this._recordEvent.bind(this);
    events.forEach(type => {
      WindowService.addEventListener(type, this._boundedRecordEvent, true);
    });
  }

  /**
   * Supprime les listeners de la page
   */
  private _deleteAllListeners() : void {

    this._events.forEach(type => {
      WindowService.removeEventListener(type, this._boundedRecordEvent, true);
    });

    ChromeService.removeOnMessageListener(this._boundedMessageControl);
    WindowService.removeEventListener('message', this._boundedSendPollyResult, false);
    WindowService.removeEventListener('beforeunload', this._boundedOnBeforeUnload);
    (window as any).document.pptRecorderAddedControlListeners = false;

  }

  /**
   * Onbefore unload action
   */
  private _onBeforeUnload() {
    // On set que le page reload
    StorageService.setData({
      loadingPage: true
    });
    this._getResult();
    this._deleteAllListeners();
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
    if (event?.data.action === controlMSG.GOT_HAR_EVENT) {
      const data = new File([event.data.payload.result], 'har.json', { type: 'text/json;charset=utf-8' });
      // On diffuse le message
      ChromeService.sendMessage({
        control : controlMSG.GET_RESULT_EVENT,
        recordingId : event.data.payload.recordingId,
        resultURL : URLService.createURLObject(data)
      });
    }
    /* Si on récupère le résultat de PollyJS c'est qu'on a terminé
     * donc on peut delete les listeners
     */
    this._deleteAllListeners();
  }

  /**
   * Récupère les résultats de pollyJS
   */
  private _getResult() : void {
    WindowService.dispatchEvent(
      new CustomEvent(controlMSG.GET_HAR_EVENT)
    );

  }

  /**
   * Envoi un event à Polly pour mettre le record en pause
   */
  private _doPause() : void {
    WindowService.dispatchEvent(
      new CustomEvent(controlMSG.PAUSE_EVENT)
    );
  }

  /**
   * Envoi un event à Polly pour reprendre l'enregistrement
   */
  private _doUnPause() : void {
    WindowService.dispatchEvent(
      new CustomEvent(controlMSG.UNPAUSE_EVENT)
    );
  }
}

(window as any).eventRecorder = new EventRecorder();
(window as any).eventRecorder.start();