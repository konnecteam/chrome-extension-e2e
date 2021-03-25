import { DataURLFactory } from './../factory/data-url/data-url-factory';
import { StorageService } from '../services/storage/storage-service';
import { defaults as code } from '../constants/default-options';
import { ZipService } from '../services/zip/zip-service';
import { FileService } from '../services/file/file-service';
import { ChromeService } from '../services/chrome/chrome-service';
import { IMessage } from '../interfaces/i-message';
import pptrActions from '../constants/pptr-actions';
import { PollyService } from '../services/polly/polly-service';
import { PollyFactory } from '../factory/polly/polly-factory';
import packageJsonZip from '../constants/package-json-zip';
import { HttpService } from '../services/http/http-service';
import controlActions from '../constants/control/control-actions';
import controlMSG from '../constants/control/control-message';
import badgeStates from '../constants/badge-states';
/**
 * Background du Plugin qui permet de gérer le recording
 */
class RecordingController {

  // Constante
  /** Nom du fichier scénario que l'on va exporter */
  private static readonly _FILENAME : string = 'scenario.zip';

  /** Mime type du fichier zip */
  private static readonly _MIMETYPE : string = 'application/zip';

  /** type de data utilisé pour créé le data url du fichier zip */
  private static readonly _TYPEDATA : string = 'base64';

  /** Path du script fake time buildé et qui se situe dans dist */
  private static readonly _FAKE_TIME_SCRIPT_PATH : string = './lib/scripts/fake-time/fake-time.js';

  /** Nom du fichier content script */
  private static readonly _CONTENT_SCRIPT_FILENAME = 'content-script.js';

  /** Nom du fichier qui contiendra les requêtes http */
  private static readonly _RECORDING_FILENAME = 'recording.har';

  /** Nom du fichier qui contiendra le scénario */
  private static readonly _SCENARIO_FILNAME = 'script.js';

  /** Nom du fichier qui contiendra le package json */
  private static readonly _PACKAGE_JSON = 'package.json';

  /** Nom du fichier qui contiendra le script pour fake le temps */
  private static readonly _FAKE_TIME_FILNAME = 'fake-time-script.js';

  // Modèle custom
  /** évenements récéptionnés */
  private _recording : IMessage[] = [];

  // Methodes

  /** Bind de la méthode handleMessage */
  private _boundedMessageHandler : () => void = null;

  /** Bind de la méthode handleNavigation */
  private _boundedNavigationHandler : () => void = null;

  /** Bind de la méthode handleWait */
  private _boundedWaitHandler : () => void = null;

  /** Bind de la méthode handleScript */
  private _boundedScriptHandler : () => void = null;

  // String

  /** Contient le contenu du scéario à exporter */
  private _zipContent : File;

  /** Contenu du fichier Fake Time service buildé */
  private _contentFakeTimeServiceBuild : string;
  // Boolean
  /** Permet de savoir si on est en pause ou non */
  private _isPaused : boolean = false;

  /** Permet de savoir si on a déjà récupéré le résultat */
  private _isResult : boolean = false;

  /** Permet de savoir si il faut record les requêtes http */
  private _recordHttpRequest : boolean = false;

  // Services
  /** Permet de faire la gestion du fichier zip que l'on va exporter  */
  private _zipService : ZipService;

  /** Permet de faire la gestions des fichiers uplaodé  */
  private _fileService : FileService;

  /** Permet de faire la gestion des enregistrements PollyJS */
  private _pollyService : PollyService;

  /**
   * Constructeur
   */
  constructor() {

    this._recording = [];
    this._zipContent = null;

    // Service
    this._zipService = ZipService.Instance;
    this._fileService = FileService.Instance;
    this._pollyService = PollyService.Instance;

    this._initStorageOptions();
  }

  /**
   * Initialisation du storage
   */
  private _initStorageOptions() {
    StorageService.setData({ 'options' : { code } });
  }

  /**
   * Exécuté à l'installation du plugin
   */
  public boot() {
    (chrome.extension as any).onConnect.addListener(port => {
      port.onMessage.addListener(msg => {
        switch (msg.action) {
          case controlActions.START :
            this._start();
            break;
          case controlActions.STOP :
            this._stop();
            break;
          case controlActions.CLEANUP:
            this._cleanUp();
            break;
          case controlActions.PAUSE :
            this._pause();
            break;
          case controlActions.UNPAUSE :
            this._unPause();
            break;
          case controlActions.EXPORT_SCRIPT :
            this._exportScriptAsync();
            break;
        }
      });
    });
  }

  /**
   * Permet d'exporter les scripts et les requêtes http au format ZIP
   */
  private async _exportScriptAsync() : Promise<void> {

    // 1 - On vérifie que la requête est bien récupérer et l'option de record des requêtes à true
    if (!this._isResult && this._recordHttpRequest) {
      alert('We haven\'t finish to get result, wait few seconds');
      return;
    }

    // 2 - On vérifie que le contenu du zip n'est pas vide
    if (this._zipContent) {
      // Mise à jour de la barre de progression
      ChromeService.sendMessage({
        valueLoad: 100
      });

      ChromeService.download(this._zipContent, RecordingController._FILENAME);
      return Promise.resolve();
    }

    // 3 - Recupération du code dans le local storage
    const result  = await StorageService.getDataAsync(['code', 'dateTimeStart']);
    if (result) {
      // Ajout du fichier script.js dans l'archive
      this._zipService.addFileInFolder(RecordingController._SCENARIO_FILNAME, result.code);

      // Ajout du package Json
      this._zipService.addFileInFolder(
        RecordingController._PACKAGE_JSON,
        new File([packageJsonZip.PACKAGE_JSON_CONTENT], RecordingController._PACKAGE_JSON)
      );

      // changement de la barre de progression
      ChromeService.sendMessage({
        valueLoad: 15
      });

      // Recupère la liste des fichiers qui seront dans le zip
      const files = this._fileService.getFilesList();
      for (let i = 0; i < files.length; i++) {
        this._zipService.addFileInFolder(`recordings/files/${files[i].name}`, files[i]);
      }

      // On remplace 0 par la time de départ du record
      const contentBuilFakeTimeWithDate = this._contentFakeTimeServiceBuild.replace('now:0', `now:${result.dateTimeStart}`);
      // On créé le fil à ajouter dans le zip
      const buildFakeTimeScript = new File([contentBuilFakeTimeWithDate], RecordingController._FAKE_TIME_FILNAME );
      // On ajoute le fake script permettant de fake le time dans le zip
      this._zipService.addFileInFolder(`recordings/scripts-build/${buildFakeTimeScript.name}`, buildFakeTimeScript);

      // changement de la barre de progression
      ChromeService.sendMessage({
        valueLoad: 35
      });

      if (this._recordHttpRequest) {
        const recording = PollyFactory.buildResultObject();

        // changement de la barre de progression
        ChromeService.sendMessage({
          valueLoad: 65
        });
        // Ajoute le recording dans le zip
        this._zipService.addFileInFolder(
          `recordings/${recording.folderName}/${RecordingController._RECORDING_FILENAME}`,
          new File([recording.har],
          RecordingController._RECORDING_FILENAME
        ));
      }

      // changement de la barre de progression
      ChromeService.sendMessage({
        valueLoad: 75
      });

      try {
        const zipInNodeBuffer = await this._zipService.generateAsync();

        // changement de la barre de progression
        ChromeService.sendMessage({
          valueLoad: 100
        });

        // Création d'un data url pour pouvoir transformer en File
        const dataURLZip = DataURLFactory.buildDataURL(
          RecordingController._MIMETYPE,
          RecordingController._TYPEDATA,
          zipInNodeBuffer.toString(RecordingController._TYPEDATA)
        );

        this._zipContent = FileService.Instance.buildFile(RecordingController._FILENAME, dataURLZip);
        // Téléchargement du fichier
        ChromeService.download(this._zipContent, RecordingController._FILENAME);
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  /**
   * Gestion de la reprise du recording
   */
  private _unPause() : void {

    ChromeService.setBadgeText(badgeStates.REC);
    this._isPaused = false;
    ChromeService.sendMessageToContentScript(controlMSG.UNPAUSE_EVENT);
  }

  /**
   * Mise en pause du recording
   */
  private _pause() : void {

    ChromeService.setBadgeText(badgeStates.PAUSE);
    this._isPaused = true;
    ChromeService.sendMessageToContentScript(controlMSG.PAUSE_EVENT);
  }

  /**
   * Clean des données
   * @param callback
   */
  private async _cleanUp(callback? : () => void) : Promise<void> {

    this._recording = [];
    this._contentFakeTimeServiceBuild = '';
    ChromeService.setBadgeText('');
    await StorageService.removeDataAsync('recording');
    callback();
  }

  /**
   * permet de gérer le stop du recording
   */
  private _stop() : void {

    // 1 - met à jour le badge state
    ChromeService.setBadgeText(this._recording.length > 0 ? badgeStates.RESULT_NOT_EMPTY : '');

    // 2 - Supprime les listener
    ChromeService.removeOnCompletedListener(this._boundedNavigationHandler);
    ChromeService.removeOnBeforeNavigateListener(this._boundedWaitHandler);
    ChromeService.removeOnCommittedListener(this._boundedScriptHandler);

    // 3 - Mise à jour du visuel
    ChromeService.setIcon('../assets/images/icon-black.png');
    ChromeService.setBadgeBackgroundColor('#45C8F1');

    // 4 - Met à jour le recording dans le local storage
    StorageService.setData({ recording : this._recording });

    // 5 - On récupère le résultat
    ChromeService.sendMessageToContentScript(controlMSG.GET_RESULT_EVENT);

    // 6 - Si on record pas les requêtes on peut mettre à true isRemovedListener
    if (!this._recordHttpRequest) {
      StorageService.setData({
        isRemovedListener: true
      });
    }
  }

  /**
   * Démarre l'enregistrement d'un scénario
   */
  private async _start() : Promise<void> {

    // 1 - On clean les data et remove le message listerner
    /**
     * Si l'utilisateur à reload alors
     * on n'a pas les données de pollyJS
     * donc on remove le listener car il n'a pas été remove
     */
    if (this._pollyService.record.id === '') {
      ChromeService.removeOnMessageListener(this._boundedMessageHandler);
    }
    this._zipContent = null;
    this._isResult = false;
    this._fileService.clearList();
    this._recording = [];
    this._zipService.resetZip();
    this._pollyService.flush();
    this._isPaused = false;

    // 2 - Set du badge texte
    chrome.browserAction.setBadgeText({ text : '' });

    // 3 - Suppression du recording en local storage
    // On met isRemovedListener à false car on démarre le record
    await StorageService.removeDataAsync('recording');

    StorageService.setData({
      isRemovedListener: false
    });

    // 4 - On récupère le contenu du fichier fake-timer-service build
    this._getFakeTimeScriptContent();

    // 5 - Inject le script
    await ChromeService.executeScript({
      file : RecordingController._CONTENT_SCRIPT_FILENAME,
      allFrames : false,
      runAt : 'document_start'
    });

    // listening après injection
    const currentTab = await ChromeService.getCurrentTabId();
    // Récupération du viewport
    chrome.tabs.sendMessage(currentTab, {
      control: controlMSG.GET_VIEWPORT_SIZE_EVENT
    });
    // Récupération de l'url
    chrome.tabs.sendMessage(currentTab, {
      control: controlMSG.GET_CURRENT_URL_EVENT
    });

    this._boundedMessageHandler = this._handleMessage.bind(this);
    this._boundedNavigationHandler = this._handleNavigation.bind(this);
    this._boundedWaitHandler = this._handleAction.bind(this, this._handleWait.bind(this));
    this._boundedScriptHandler = this._handleAction.bind(this, this._injectScript.bind(this));

    ChromeService.addOnMessageListener(this._boundedMessageHandler);
    ChromeService.addOnCompletedListener(this._boundedNavigationHandler);
    ChromeService.addOnBeforeNavigateListener(this._boundedWaitHandler);
    ChromeService.addOnCommittedListener(this._boundedScriptHandler);
    ChromeService.setIcon('../assets/images/icon-green.png');
    ChromeService.setBadgeText(badgeStates.REC);
    ChromeService.setBadgeBackgroundColor('#FF0000');

    // On récupère l'option des requêtes http
    const data = await StorageService.getDataAsync(['options']);
    if  (data) {
      this._recordHttpRequest = data.options.code.recordHttpRequest;
    }
  }

  /**
   * Permet de récupérer le contenu du fake time script buildé
   */
  private _getFakeTimeScriptContent() : void {
    /* Pour lire un fichier dans un plugin chrome
       il faut qu'il soit accessible et
       il faut fetch l'url pour récupérer le résultat
    */
    fetch(ChromeService.getUrl(RecordingController._FAKE_TIME_SCRIPT_PATH))
    .then(response => response.text())
    .then(value => {
      this._contentFakeTimeServiceBuild = value;
    });
  }

  /**
   * Permet de gérer la navigation
   */
  private _handleNavigation(frameId : number) : void {
    if (frameId === 0) {
      this._recordNavigation();
      ChromeService.setBadgeText(badgeStates.REC);
    }
  }

  /**
   * Permet si la frame est la frame courante d'éffecuer le callback
   */
  private _handleAction(callback : () => void, frameId = null) : void {
    if (frameId === 0 && callback) {
      callback();
    }
  }

  /**
   * Gère le wait
   */
  private _handleWait() {
    ChromeService.setBadgeText(badgeStates.WAIT);
  }

  /**
   * Permet d'injecter le script
   */
  private async _injectScript(callback? : () => void) : Promise<void> {
    await ChromeService.executeScript({
      file : RecordingController._CONTENT_SCRIPT_FILENAME,
      allFrames : false,
      runAt : 'document-start'
    });
    callback();
  }

  /**
   * Permet d'enregistrer la navigation
   */
  private _recordNavigation() : void {
    this._handleMessage({
      typeEvent : pptrActions.PPTR,
      selector: undefined,
      value: undefined,
      action: pptrActions.NAVIGATION
    });
  }

  /**
   * Permet de gérer les messages reçus du content script
   */
  private _handleMessage(
    message : IMessage,
    sender? : { frameId : number, url : string }
  ) : void {

    // On vérifie qu'on à pas un message de type "controle"
    if (message.control) {
      return this._handleControlMessage(message);
    }

    message.frameId = sender ? sender.frameId : null;
    message.frameUrl = sender ? sender.url : null;

    // Si le record n'est pas en pause
    if (!this._isPaused) {
      this._recording.push(message);
      StorageService.setData({ recording : this._recording });
    }
  }

  /**
   * Permet de gérer les messages de "type" contrôle
   */
  private _handleControlMessage(message : IMessage) : void {
    switch (message?.control) {
      case controlMSG.EVENT_RECORDER_STARTED_EVENT :
        ChromeService.setBadgeText(badgeStates.REC);
        break;
      case controlMSG.GET_VIEWPORT_SIZE_EVENT :
        this._recordCurrentViewportSizeAsync(message.coordinates);
        break;
      case controlMSG.GET_CURRENT_URL_EVENT :
        this._recordCurrentUrlAsync(message.frameUrl);
        break;
      case controlMSG.GET_RESULT_EVENT :
        this._getHARcontent(message);
        break;
      case controlMSG.GET_NEW_FILE_EVENT :
        this._recordNewFile(message);
    }
  }

  /**
   * Enregistre la taille de l'écran
   */
  private _recordCurrentViewportSizeAsync(value : { width : number, height : number }) : void {
    this._handleMessage({ typeEvent: pptrActions.PPTR, selector: undefined, value, action: pptrActions.VIEWPORT });
  }

  /**
   * Enregistre l'url courante
   */
  private _recordCurrentUrlAsync(value : string) : void {
    this._handleMessage({ typeEvent: pptrActions.PPTR, selector: undefined, value, action: pptrActions.GOTO });
  }

  /**
   * Permet de récupérer le fichier HAR généré
   * (fichier contient toutes les requêtes enregistrées)
   */
  private async _getHARcontent(message : IMessage) : Promise<void> {

    // on vérifie si on a le résultat de la séquence et on affecte à polly
    if (message.resultURL) {
      this._pollyService.record.id = message.recordingId;

      const recordHAR = await HttpService.getRequest(message.resultURL);

      if (recordHAR) {
        this._pollyService.record.har = recordHAR;
      }
      URL.revokeObjectURL(message.resultURL);
      this._isResult = true;
    }

    const badge = await ChromeService.getBadgeText();

    // Si on a le résultat du record
    if (badge === badgeStates.RESULT_NOT_EMPTY || badge === '') {
      ChromeService.removeOnMessageListener(this._boundedMessageHandler);
      // On stock que l'on a supprimé le listener
      StorageService.setData({
        isRemovedListener: true
      });
    }
  }

  /**
   * Permet d'enregistrer un fichier uploadé par l'utilisateur dans un tableau
   * afin de pouvoir rejouer au scénario
   */
  private _recordNewFile(message : IMessage) : void {

    // on vérifie que le fichier uploadé à bien un nom et un contenu
    // et que le record n'est pas en pause
    if (message.filename && message.content && !this._isPaused) {
      this._fileService.addfile(message.filename, message.content as string);
    }
  }
}

(window as any).recordingController = new RecordingController();
(window as any).recordingController.boot();