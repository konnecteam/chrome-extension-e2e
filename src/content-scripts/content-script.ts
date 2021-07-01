import { DebounceService } from '../services/debounce/debounce-service';
import { PasswordService } from '../services/password/password-service';
import { URLService } from './../services/url/url-service';
import { SelectorService } from './../services/selector/selector-service';
import { IMessage } from '../interfaces/i-message';
import { KeyDownService } from '../services/key-down/key-down-service';
import { StorageService } from '../services/storage/storage-service';
import { ChromeService } from '../services/chrome/chrome-service';
import { WindowService } from '../services/window/window-service';
import { PollyService } from '../services/polly/polly-service';
import { ComponentManager } from '../manager/component-manager';
import { EventMessageFactory } from '../factory/message/event-message-factory';

// Constant
import EVENT_MSG from '../constants/events/events-message';
import TAG_NAME from '../constants/elements/tag-name';
import DOM_EVENT from '../constants/events/events-dom';
import CUSTOM_EVENT from '../constants/events/events-custom';

/**
 * Enregistre les intéractions de l'utilisateur avec la page
 */
class EventRecorder {

  /** élément précédant */
  private _previousEvent : Event;

  /** Permet de savoir si il faut enregistrer les requêtes http */
  private _recordHttpRequest : boolean;

  /** Service qui permet de gérer les keydown */
  private _keyDownService : KeyDownService;

  /** Service qui permet de trouver le selecteur d'un élément */
  private _selectorService : SelectorService;

  /** PollyJS service */
  private _pollyService : PollyService;

  /** Savoir si on traite un event */
  private _isEventProcessed : boolean;

  /** Fonction qui permet d'écouter les events */
  private _boundedRecordEvent : () => void = null;

  /** Fonction qui permet d'écouter les events scroll */
  private _boundedScrollEvent : () => void = null;

  /** Fonction qui permet d'ecouter l'event onbeforeunload */
  private _boundedOnBeforeUnload : () => void = null;

  /** Fonction qui permet d'ecouter l'event du PollyRecorder */
  private _boundedSendPollyResult : () => void = null;

  /** Fonction qui permet d'ecouter les messages du RecordingController */
  private _boundedMessageControl : () => void = null;

  /** Selecteur de l'élément de l'event précédant */
  private _previousSelector = null;

  /** Time de départ d'un mousesdown */
  private _startMouseDown : number;

  /** Message précédemment envoyé */
  private _previousMessage : IMessage;

  constructor() {

    // Boolean
    this._recordHttpRequest = false;

    // Service
    this._keyDownService = KeyDownService.Instance;
    this._selectorService = SelectorService.Instance;
    this._pollyService = PollyService.Instance;
  }

  /**
   * Initialisation
   */
  private _init() : void {

    // Le document est totalement chargé ?
    if (document.readyState === 'complete') {

      // On inject le script et on clone le body courant
      this._pollyService.injectScript();
      (window as any).saveBody = document.cloneNode(true);
    }

    // écoute du state change pour cloner de nouveau le body
    document.onreadystatechange = () => {

      if (document.readyState === 'interactive') {
        this._pollyService.injectScript();
      }

      (window as any).saveBody = document.cloneNode(true);
    };
  }

  /**
   * Démarrage du recorder
   */
  public async start() {

    /**
     * Quand on start,
     * On met loadingPage à flase
     * car on n'a pas reload
     * et il faut le définir
     */
    StorageService.setData({
      loadingPage: false
    });

    try {

      // Récupération des options
      const data = await StorageService.getDataAsync(['options']);
      if (data) {

        // Mise à jour des options
        this._updateOptions(data.options);

        this._recordHttpRequest = data.options.recordHttpRequest;

        // Si On record les requests on initialise et inject le script polly
        if (data.options.recordHttpRequest) {
          this._init();
        } else {
          // On dit au startup config que pollyJS est prêt et que les modules peuvent être chargé
          WindowService.dispatchEvent(new CustomEvent(EVENT_MSG.POLLY_READY));
        }

        // Ajout d'un listener afin d'écouter les messages du background
        if (!(window.document as any).pptRecorderAddedControlListeners && chrome.runtime && chrome.runtime.onMessage) {
          this._addAllListeners();
        }

        // On observe les changement et on ajoute un listener sur les inputs
        (window as any).observer = new MutationObserver(this._listenerObserverAsync);
        (window as any).observer.observe(document, { childList: true, subtree: true });

        ChromeService.sendMessage({ control: EVENT_MSG.EVENT_RECORDER_STARTED });
      }
    } catch (err) {
    }

  }

  /**
   * Permet de rediriger les messages dans la bonne méthode
   */
  private _redirectMessage(message : IMessage) : void {

    if (message && message.hasOwnProperty('control')) {

      switch (message.control) {
        case EVENT_MSG.GET_CURRENT_URL:
          WindowService.getCurrentUrl(message);
          break;
        case EVENT_MSG.GET_VIEWPORT_SIZE:
          WindowService.getViewPortSize(message);
          break;
        case EVENT_MSG.GET_RESULT:
          this._getResult();
          break;
        case EVENT_MSG.PAUSE:
          this._doPause();
          break;
        case EVENT_MSG.UNPAUSE:
          this._doUnPause();
          break;
        // default
      }
    }
  }

  /**
   * Record des events
   */
  private _recordEvent(e : any) : void {

    // Si un evènement précédent est toujours en cours on ne fait rien
    if (this._previousEvent && this._previousEvent.timeStamp === e.timeStamp) {
      return;
    }

    let filesUpload : FileList = null;
    let durationClick : number = null;
    this._isEventProcessed = false;

    // Si aucun élément capturé on met à jour la variable et on ne fait rien
    if (!e.target) {
      this._isEventProcessed = true;
      return;
    }

    // Si des fichiers sont en cours de transfère on les stocks
    if (e.dataTransfer) {
      filesUpload = e.dataTransfer.files;
    }

    // Gestion de la durée du click (principalement pour les input numérique)
    if (e.type === DOM_EVENT.MOUSEDOWN) {
      this._startMouseDown = Date.now();
      return;
    }

    let value = '';

    /**
     * Si c'est un input de type password
     * il faut changer la value
     */
    if (e.target.tagName === TAG_NAME.INPUT.toUpperCase() && e.target.type === 'password') {

      // Si c'est un change on modifie la value:
      if (e.type === DOM_EVENT.CHANGE) {
        value = PasswordService.generate();
      }

      /*
       * Si c'est un keydown on arrête tout pour pas envoyer les caractères
       * qui composent le mot de passe
       */
      else if (e.type === DOM_EVENT.KEYDOWN) {
        return;
      }
    }

    if (e.type === DOM_EVENT.CLICK) {
      durationClick = Date.now() - this._startMouseDown;
    }

    /**
     * On verifie si l'element qui a déclenché le submit
     * et le même que celui de l'event précédent
     * si c'est le cas c'est qu'il n'y a pas besoin
     * de garder le submit car il y a eu une detection de clique
     * sur l'event précédant donc on le traite pas
     */
    if (e.type === DOM_EVENT.SUBMIT && this._previousEvent.type === DOM_EVENT.CLICK
      && e.submitter === this._previousEvent.target) {
      return;
    }

    /* Si on récupère un lien directement dans un body
     * Alors c'est qu'on a utilisé un window.open et ouvert un autre onglet
     * donc on l'ignore car l'élement n'existe pas
    */
    if (e.target.tagName === TAG_NAME.LINK.toUpperCase()
        && e.target.getAttribute('target') === '_blank'
      ) {
      return;
    }

    // définition du selecteur
    let selector = '';

    if (e.target.type === 'file' && e.target.tagName === TAG_NAME.INPUT.toUpperCase()) {

      if (e.type === DOM_EVENT.CHANGE) {
        selector = this._previousSelector;
      }

      /**
       * Dans les file drop zone lors d'un change input file
       * un click est catché mais on ne veut pas du click car il n'est pas utile
       */
      else if (e.type === DOM_EVENT.CLICK &&
        this._previousMessage.action === DOM_EVENT.CLICK
      ) {
        return;
      }
    } else {
      selector = this._selectorService.find(e.target);
    }

    let comments = '';

    // On vérifie si le sélecteur est ambigu (plus de deux réponses)
    if (document.querySelectorAll(selector).length > 1) {
      comments = `/!\\ Le sélécteur a retourné plus d'un élément, il risque d'y avoir une erreur`;
    }

    // construction du message: IMessage
    let message : IMessage = {
      selector: this._selectorService.standardizeSelector(selector),
      comments,
      value: value ? value : e.target.value,
      tagName: e.target.tagName,
      action: e.type,
      typeEvent: e.type,
      key: e.key ? e.key : null,
      keyCode: e.keyCode ? e.keyCode : null,
      href: e.target.href ? e.target.href : null,
      durancyClick: durationClick ? durationClick : 0,
      clickCoordinates: this._keyDownService.getClickCoordinates(e),
      scrollY: window.pageYOffset,
      scrollX: window.pageXOffset,
      submitterSelector : e.submitter ? this._selectorService.find(e.submitter) : ''
    };

    // On vérifie si un composant est concerné par l'event
    const component = ComponentManager.getComponent(message.typeEvent, e.target);

    // Si c'est le cas et qu'on a un previousElement, c'est que on a une konnect liste, on update donc la value des k list
    if (component) {

      message = EventMessageFactory.buildMessageEvent(component, message, filesUpload);
    }

    // On vérifie si on a eu des keydown ou si on a fini les keydown et dans ce cas on modifie le message car c'est un listkeydown
    this._keyDownService.handleEvent(message, e.target);
    this._previousEvent = e;
    this._previousSelector = selector;

    ChromeService.sendMessage(message);
    this._previousMessage = message;

    this._isEventProcessed = true;
  }

  /**
   * Observer des listener
   */
  private async _listenerObserverAsync(mutationList : any[]) {

    // On bloque l'update du window.saveBody que l'on copie, tant qu'on traite l'event
    try {

      while (!(window as any).eventRecorder._isEventProcessed) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (err) {
    }

    // On bind la méthode de record des events
    const boundedRecordEvent = ((window as any).eventRecorder as EventRecorder)._recordEvent.bind(
      (window as any).eventRecorder
    );

    for (let i = 0 ; i < mutationList.length ; i++) {

      const mutation = mutationList[i];

      for (let j = 0 ; j < mutation.addedNodes.length; j++ ) {

        const child = mutation.addedNodes[j];

        // Si on a une iframe on rajoute les listener car de base il n'y en pas
        if (child.tagName === TAG_NAME.IFRAME.toUpperCase() && child.contentDocument) {
          Object.keys(DOM_EVENT).forEach(key => {
            const type = DOM_EVENT[key];
            child.contentDocument.addEventListener(type, boundedRecordEvent, true);
          });
        }

        // Si on a un input file on rajoute le listener des change
        if (child.tagName === TAG_NAME.INPUT.toUpperCase() && child.type === 'file') {
          child.addEventListener(DOM_EVENT.CHANGE, boundedRecordEvent, false);
        }
      }
    }

    (window as any).saveBody = document.cloneNode(true);
  }

  /** Ajout des listners */
  private _addAllListeners() : void {

    (window as any).document.pptRecorderAddedControlListeners = true;

    this._boundedMessageControl = this._redirectMessage.bind(this);
    ChromeService.addOnMessageListener(this._boundedMessageControl);

    this._boundedSendPollyResult = this._sendPollyResult.bind(this);
    WindowService.addEventListener('message', this._boundedSendPollyResult, false);

    // écoute de l'évènement before unload
    this._boundedOnBeforeUnload = this._onBeforeUnload.bind(this);
    WindowService.addEventListener('beforeunload', this._boundedOnBeforeUnload);

    this._boundedRecordEvent = this._recordEvent.bind(this);

    // Debounce du scroll
    this._boundedScrollEvent = DebounceService.debounce(event => {

      // Message pour un event scoll
      const message : IMessage = {
        selector: this._selectorService.standardizeSelector(this._selectorService.find(event.target)),
        tagName: event.target.tagName,
        action: event.type,
        typeEvent: event.type,
        // Si on a un scrollLeft c'est que c'est un element et sinon c'est la window donc on utilise pageXOffset
        scrollX: event.target.scrollLeft ? event.target.scrollLeft : window.pageXOffset,
        scrollY: event.target.scrollTop ? event.target.scrollTop : window.pageYOffset,
      };

      // On verfie si il y a eu un keydown avant pour envoyer l'event list keydown si le keydown est fini
      this._keyDownService.handleEvent(message, event.target);

      // Envoi du scroll
      ChromeService.sendMessage(message);

    }, 150);

    Object.keys(DOM_EVENT).forEach(key => {
      const type = DOM_EVENT[key];
      if (type !== DOM_EVENT.SCROLL) {
        WindowService.addEventListener(type, this._boundedRecordEvent, true);
      } else {
        WindowService.addEventListener(type, this._boundedScrollEvent, true);
      }
    });
  }

  /**
   * Supprime les listeners de la page
   */
  private _deleteAllListeners() : void {

    Object.keys(DOM_EVENT).forEach(key => {
      const type = DOM_EVENT[key];
      if (type !== DOM_EVENT.SCROLL) {
        WindowService.removeEventListener(type, this._boundedRecordEvent, true);
      } else {
        WindowService.removeEventListener(type, this._boundedScrollEvent, true);
      }
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
    StorageService.setData({ loadingPage: true });
    this._getResult();
    this._deleteAllListeners();
  }

  /**
   * Mise à jour des options
   */
  private _updateOptions(options : {[key : string] : any}) : void {
    StorageService.setData({ useRegexForDataAttribute : options.useRegexForDataAttribute });
  }

  /**
   * Permet d'envoyer le résultat de pollyJS
   */
  private _sendPollyResult(event) : void {

    // On demande à récupérer le har
    if (event?.data.action === EVENT_MSG.GOT_HAR) {

      const data = new File([event.data.payload.result], 'har.json', { type: 'text/json;charset=utf-8' });

      // On diffuse le message
      ChromeService.sendMessage({
        control : EVENT_MSG.GET_RESULT,
        recordingId : event.data.payload.recordingId,
        resultURL : URLService.createURLObject(data)
      });
    }

    /* Si on récupère le résultat de PollyJS c'est qu'on a terminé
     * donc on peut delete les listeners
     */
    this._deleteAllListeners();
  }

  /** Récupère les résultats de pollyJS */
  private _getResult() : void {

    WindowService.dispatchEvent(new CustomEvent(EVENT_MSG.GET_HAR));

    // Si on n'enregistre pas les requêtes on peut directement supprimer les listeners
    if (!this._recordHttpRequest) {
      this._deleteAllListeners();
    }
  }

  /**
   * Envoi un event à Polly pour mettre le record en pause
   */
  private _doPause() : void {
    WindowService.dispatchEvent(new CustomEvent(EVENT_MSG.PAUSE));
  }

  /**
   * Envoi un event à Polly pour reprendre l'enregistrement
   */
  private _doUnPause() : void {
    WindowService.dispatchEvent(new CustomEvent(EVENT_MSG.UNPAUSE));
  }
}

(window as any).eventRecorder = new EventRecorder();
(window as any).eventRecorder.start();
