import { DataURLFactory } from './../factory/data-url/data-url-factory';
import { StorageService } from '../services/storage/storage-service';
import { ZipService } from '../services/zip/zip-service';
import { FileService } from '../services/file/file-service';
import { ChromeService } from '../services/chrome/chrome-service';
import { IMessage } from '../interfaces/i-message';
import { PollyService } from '../services/polly/polly-service';
import { HttpService } from '../services/http/http-service';
import { EBadgeState } from '../enum/badge/e-badge-states';
import { EControlAction } from '../enum/action/control-actions';
import { ScenarioService } from '../services/scenario/scenario-service';
import { EEventMessage } from '../enum/events/events-message';
import { EPptrAction } from '../enum/action/pptr-actions';

// Constant
import ZIP_CONTENT from '../constants/package-json-zip';

/**
 * Background du Plugin qui permet de gérer le recording
 */
class RecordingController {

  /** Nom du fichier scénario que l'on va exporter */
  private static readonly _SCENARIO_ZIP_NAME : string = 'scenario.zip';

  /** Mime type du fichier zip */
  private static readonly _MIMETYPE : string = 'application/zip';

  /** type de data utilisé pour créé le data url du fichier zip */
  private static readonly _TYPEDATA : string = 'base64';

  /** Nom du fichier content script */
  private static readonly _CONTENT_SCRIPT_FILENAME : string = 'content-script.js';

  /** Nom du fichier qui contiendra les requêtes http */
  private static readonly _RECORDING_FILENAME : string = 'recording.har';

  /** Nom du fichier qui contiendra le scénario */
  private static readonly _SCENARIO_FILNAME : string = 'script.js';

  /** Nom du fichier qui contiendra le package json */
  private static readonly _PACKAGE_JSON : string = 'package.json';

  /** Nom du fichier qui contiendra le script pour fake le temps */
  private static readonly _FAKE_TIME_SCRIPT_FILNAME : string = 'fake-time-script.js';

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

  /** Contient le contenu du scéario à exporter */
  private _zipContent : File;

  /** Contenu du fichier Fake Time service buildé */
  private _contentFakeTimeServiceBuilded : string;

  /** Permet de savoir si on est en pause ou non */
  private _isPaused : boolean = false;

  /** Permet de savoir si on a déjà récupéré le résultat */
  private _isResult : boolean = false;

  /** Permet de savoir si il faut record les requêtes http */
  private _recordHttpRequest : boolean = false;

  /** Permet de savoir si il faut supprimer le cache du site */
  private _deleteSiteData : boolean = false;

  /** Permet de faire la gestion du fichier zip que l'on va exporter  */
  private _zipService : ZipService;

  /** Permet de faire la gestions des fichiers uplaodé  */
  private _fileService : FileService;

  /** Permet de faire la gestion des enregistrements PollyJS */
  private _pollyService : PollyService;

  /** Contenu des fichiers de services du scénario */
  private _scenarioDependencies : string[] = [];

  /**
   * Constructeur
   */
  constructor() {
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

    StorageService.setData( {
      options :  {
        wrapAsync : true,
        headless : false,
        waitForNavigation : true,
        waitForSelectorOnClick : true,
        blankLinesBetweenBlocks : true,
        dataAttribute : `^data\-value$ ^title$ ^data\-offset\-index$ ^e2e\-id$ ^src$ ^route-href$ ^[a-z\-]*\.trigger$ ^[a-z\-]*\.delegate$ ^[a-z\-]*\.bind$ ^[a-z\-]*\.two-way$ ^[a-z\-]*\.one-way$`,
        useRegexForDataAttribute : true,
        customLineAfterClick : '',
        recordHttpRequest : true,
        regexHTTPrequest : '',
        customLinesBeforeEvent : `await page.evaluate(async() => {
    await konnect.engineStateService.Instance.waitForAsync(1);
  });`,
        deleteSiteData : true,
      }
    });
  }

  /**
   * Exécuté à l'installation du plugin
   */
  public boot() {
    (chrome.extension as any).onConnect.addListener(port => {
      port.onMessage.addListener(msg => {
        switch (msg.action) {
          case EControlAction.START :
            this._startAsync();
            break;
          case EControlAction.STOP :
            this._stop();
            break;
          case EControlAction.CLEANUP :
            this._cleanUpAsync();
            break;
          case EControlAction.PAUSE :
            this._pause();
            break;
          case EControlAction.UNPAUSE :
            this._unPause();
            break;
          case EControlAction.EXPORT_SCRIPT :
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


    try {
      // 1 - On vérifie que la requête est bien récupérer et l'option de record des requêtes à true
      if (!this._isResult && this._recordHttpRequest) {
        alert('We haven\'t finish to get result, wait few seconds');
        return;
      }

      // 2 - On vérifie que le contenu du zip n'est pas vide
      if (this._zipContent) {

        // Mise à jour de la barre de progression
        ChromeService.sendMessage({ valueLoad : 100 });

        await ChromeService.download(this._zipContent, RecordingController._SCENARIO_ZIP_NAME);
        return;
      }

      // 3 - Recupération du code dans le local storage
      const result  = await StorageService.getDataAsync(['code', 'dateTimeStart']);
      if (result) {

        // Ajout du fichier script.js dans l'archive
        this._zipService.addFileInFolder(RecordingController._SCENARIO_FILNAME, result.code);

        // Ajout du package Json
        this._zipService.addFileInFolder(
            RecordingController._PACKAGE_JSON,
            new File([ZIP_CONTENT.PACKAGE_JSON_CONTENT], RecordingController._PACKAGE_JSON)
          );

        // changement de la barre de progression
        ChromeService.sendMessage({ valueLoad : 15 });

        // Recupère la liste des fichiers qui seront dans le zip
        const files = this._fileService.getUploadedFiles();
        for (let i = 0; i < files.length; i++) {
          this._zipService.addFileInFolder(`recordings/files/${files[i].name}`, files[i]);
        }

        // On remplace 0 par la time de départ du record
        const contentBuilFakeTimeWithDate = this._contentFakeTimeServiceBuilded.replace('now:0', `now:${result.dateTimeStart}`);

        // On créé le fichier à ajouter dans le zip
        const buildFakeTimeScript = new File([contentBuilFakeTimeWithDate], RecordingController._FAKE_TIME_SCRIPT_FILNAME);

        // On ajoute le fake script permettant de fake le time dans le zip
        this._zipService.addFileInFolder(`recordings/scripts-build/${buildFakeTimeScript.name}`, buildFakeTimeScript);


        // On parcourt tous les services pour les ajouter au zip
        for (let index = 0; index < ScenarioService.SCENARIO_SERVICE_DEPENDENCIES.length; index++) {

          const filename = ScenarioService.SCENARIO_SERVICE_DEPENDENCIES[index];
          const contentFile = this._scenarioDependencies[index];
          const file = new File([contentFile], filename );

          // On ajoute le service au zip
          this._zipService.addFileInFolder(`recordings/services/${file.name}`, file);
        }

        // changement de la barre de progression
        ChromeService.sendMessage({ valueLoad : 35 });

        if (this._recordHttpRequest) {

          const recording = {
            folderName : this._pollyService.getRecordId() !== '' ? this._pollyService.getRecordId() : 'emptyResult',
            har : this._pollyService.getRecordHar() !== '' ? this._pollyService.getRecordHar() : 'No request recorded'
          };

          // changement de la barre de progression
          ChromeService.sendMessage({
            valueLoad : 65
          });

          // Ajoute le recording dans le zip
          this._zipService.addFileInFolder(
              `recordings/${recording.folderName}/${RecordingController._RECORDING_FILENAME}`,
              new File([recording.har],
              RecordingController._RECORDING_FILENAME
          ));
        }

          // changement de la barre de progression
        ChromeService.sendMessage({ valueLoad : 75 });

        const zipInNodeBuffer = await this._zipService.generateAsync();

        // changement de la barre de progression
        ChromeService.sendMessage({ valueLoad : 100 });

        // Création d'un data url pour pouvoir transformer en File
        const dataURLZip = DataURLFactory.buildDataURL(
          RecordingController._MIMETYPE,
          RecordingController._TYPEDATA,
          zipInNodeBuffer.toString((RecordingController._TYPEDATA) as BufferEncoding)
        );

        this._zipContent = FileService.Instance.buildFile(RecordingController._SCENARIO_ZIP_NAME, dataURLZip);

        // Téléchargement du fichier
        await ChromeService.download(this._zipContent, RecordingController._SCENARIO_ZIP_NAME);
      }
    } catch (err) {
      alert('Problem with exported script');
    }
  }

  /**
   * Gestion de la reprise du recording
   */
  private _unPause() : void {

    ChromeService.setBadgeText(EBadgeState.REC);
    this._isPaused = false;
    ChromeService.sendMessageToContentScriptAsync(EEventMessage.UNPAUSE);
  }

  /**
   * Mise en pause du recording
   */
  private _pause() : void {

    ChromeService.setBadgeText(EBadgeState.PAUSE);
    this._isPaused = true;
    ChromeService.sendMessageToContentScriptAsync(EEventMessage.PAUSE);
  }

  /**
   * Clean des données
   */
  private async _cleanUpAsync(callback? : () => void) : Promise<void> {

    this._recording = [];
    this._contentFakeTimeServiceBuilded = '';
    ChromeService.removeOnMessageListener(this._boundedMessageHandler);
    ChromeService.setBadgeText('');

    try {

      await StorageService.removeDataAsync('recording');
    } catch (err) {
    }

    if (callback) {
      callback();
    }
  }

  /**
   * permet de gérer le stop du recording
   */
  private _stop() : void {

    // 1 - met à jour le badge state
    ChromeService.setBadgeText(this._recording.length > 0 ? EBadgeState.RESULT_NOT_EMPTY : '');

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
    ChromeService.sendMessageToContentScriptAsync(EEventMessage.GET_RESULT);

    // 6 - Si on record pas les requêtes on peut mettre à true isRemovedListener et le isResult
    if (!this._recordHttpRequest) {
      StorageService.setData({ isRemovedListener : true });
      this._isResult = true;
      StorageService.setData({ isResult : this._isResult });
    }
  }

  /**
   * Démarre l'enregistrement d'un scénario
   */
  private async _startAsync() : Promise<void> {

    /**
     * Si l'utilisateur à reload alors
     * on n'a pas les données de pollyJS
     * donc on remove le listener car il n'a pas été remove
     */
    if (this._pollyService.record.id === '') {
      ChromeService.removeOnMessageListener(this._boundedMessageHandler);
    }

    // 1 - On clean les data et remove le message listerner
    this._zipContent = null;
    this._isResult = false;
    this._fileService.clearUploadedFiles();
    this._recording = [];
    this._zipService.resetZip();
    this._pollyService.flush();
    this._isPaused = false;
    chrome.browserAction.setBadgeText({ text : '' });

    try {

      const currentTab = await ChromeService.getCurrentTabIdAsync();

      // 2 - On récupère les options
      const data = await StorageService.getDataAsync(['options']);
      if (data) {
        this._recordHttpRequest = data.options.recordHttpRequest;
        this._deleteSiteData = data.options.deleteSiteData;
      }

      // Si l'option deleteSiteDate est activé, on supprime les données du site
      if (this._deleteSiteData) {
        await ChromeService.removeBrowsingDataAsync(currentTab.url);
      }

      // 3 - Suppression du recording en local storage
      await StorageService.removeDataAsync('recording');

      StorageService.setData({ isRemovedListener : false });
      StorageService.setData({ isResult : this._isResult });

      // 4 - On récupère les fichiers liées au scénario
      this._scenarioDependencies = ScenarioService.getScenarioFilesContent();
      this._contentFakeTimeServiceBuilded = await ScenarioService.getFakeTimeScriptContentAsync();

      // 5 - Inject le script
      await ChromeService.executeScript({
        file : RecordingController._CONTENT_SCRIPT_FILENAME,
        allFrames : false,
        runAt : 'document_start'
      });

      // Récupération du viewport
      chrome.tabs.sendMessage(currentTab.id, {
        control : EEventMessage.GET_VIEWPORT_SIZE
      });

      // Récupération de l'url
      chrome.tabs.sendMessage(currentTab.id, {
        control : EEventMessage.GET_CURRENT_URL
      });
    } catch (err) {
    }

    // Binding
    this._boundedMessageHandler = this._handleMessage.bind(this);
    this._boundedNavigationHandler = this._handleNavigation.bind(this);
    this._boundedWaitHandler = this._handleAction.bind(this, this._handleWait.bind(this));
    this._boundedScriptHandler = this._handleAction.bind(this, this._injectScriptAsync.bind(this));

    ChromeService.addOnMessageListener(this._boundedMessageHandler);
    ChromeService.addOnCompletedListener(this._boundedNavigationHandler);
    ChromeService.addOnBeforeNavigateListener(this._boundedWaitHandler);
    ChromeService.addOnCommittedListener(this._boundedScriptHandler);
    ChromeService.setIcon('../assets/images/icon-green.png');
    ChromeService.setBadgeText(EBadgeState.REC);
    ChromeService.setBadgeBackgroundColor('#FF0000');
  }

  /**
   * Permet de gérer la navigation
   */
  private _handleNavigation(frameId : number) : void {
    if (frameId === 0) {
      this._recordNavigation();
      ChromeService.setBadgeText(EBadgeState.REC);
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
    ChromeService.setBadgeText(EBadgeState.WAIT);
  }

  /**
   * Permet d'injecter le script
   */
  private async _injectScriptAsync(callback? : () => void) : Promise<void> {
    try {

      await ChromeService.executeScript({
        file : RecordingController._CONTENT_SCRIPT_FILENAME,
        allFrames : false,
        runAt : 'document-start'
      });

      if (callback) {
        callback();
      }
    } catch (err) {
      alert('Problem with script injection');
    }

  }

  /**
   * Permet d'enregistrer la navigation
   */
  private _recordNavigation() : void {
    this._handleMessage({
      typeEvent : EPptrAction.PPTR,
      selector : undefined,
      value : undefined,
      action : EPptrAction.NAVIGATION
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
      case EEventMessage.EVENT_RECORDER_STARTED :
        ChromeService.setBadgeText(EBadgeState.REC);
        break;
      case EEventMessage.GET_VIEWPORT_SIZE :
        this._recordCurrentViewportSize(message.coordinates);
        break;
      case EEventMessage.GET_CURRENT_URL :
        this._recordCurrentUrl(message.frameUrl);
        break;
      case EEventMessage.GET_RESULT :
        this._getHARcontentAsync(message);
        break;
      case EEventMessage.GET_NEW_FILE :
        this._recordNewFile(message);
      // default
    }
  }

  /**
   * Enregistre la taille de l'écran
   */
  private _recordCurrentViewportSize(value : { width : number, height : number }) : void {
    this._handleMessage({ typeEvent : EPptrAction.PPTR, selector : undefined, value, action : EPptrAction.VIEWPORT });
  }

  /**
   * Enregistre l'url courante
   */
  private _recordCurrentUrl(value : string) : void {
    this._handleMessage({ typeEvent : EPptrAction.PPTR, selector : undefined, value, action : EPptrAction.GOTO });
  }

  /**
   * Permet de récupérer le fichier HAR généré
   * (fichier contient toutes les requêtes enregistrées)
   */
  private async _getHARcontentAsync(message : IMessage) : Promise<void> {

    // on vérifie si on a le résultat de la séquence et on affecte à polly
    if (message.resultURL) {

      this._pollyService.record.id = message.recordingId;
      try {

        // Récupération du fichier har
        const har = await HttpService.getRequestAsync(message.resultURL);

        if (har) {
          this._pollyService.record.har = har;
        }

        URL.revokeObjectURL(message.resultURL);

        this._isResult = true;
        StorageService.setData({ isResult : this._isResult });
      } catch (err) {
      }
    }

    try {

      const badge = await ChromeService.getBadgeTextAsync();

      // Si on a le résultat du record
      if (badge === EBadgeState.RESULT_NOT_EMPTY || badge === '') {

        // On stock que l'on a supprimé le listener
        StorageService.setData({ isRemovedListener : true});
      }
    } catch (err) {
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