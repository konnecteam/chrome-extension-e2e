import { WindowService } from '../../../services/window/window-service';
import { Polly } from '@pollyjs/core';
import * as  FetchAdapter from '@pollyjs/adapter-fetch';
import * as XHRAdapter from '@pollyjs/adapter-xhr';
import inMemoryPersister from '../../persister/polly/in-memory-persister';
import controlMSG from '../../../constants/control/control-message';

// On prrécise à polly les adapter et persister utilisés
Polly.register(XHRAdapter);
Polly.register(FetchAdapter);
Polly.register(inMemoryPersister);

/**
 * Permet d'enregistrer des requêtes http de la page web à l'aide de PollyJS
 */
export class PollyRecorder {

  /** Initiateur de requête XmlHTTPRequest  */
  public static readonly XMLHTTREQUEST = 'xmlhttprequest';

  /** Initiateur de requête Fetch */
  public static readonly FETCH = 'fetch';

  /** Requête qui ne sont pas traçables à partir de Performance  */
  private static readonly _requestNotRecorded = [
    '',
    'node_modules/konnect-web-theme/dist/font-awesome5/webfonts/fa-brands-400.woff',
    'node_modules/konnect-web-theme/dist/font-awesome5/webfonts/fa-regular-400.woff',
    'node_modules/konnect-web-theme/dist/kendo/css/web/fonts/glyphs/WebComponentsIcons.woff?gedxeo',
    'node_modules/konnect-web-theme/dist/font-awesome5/webfonts/fa-solid-900.woff',
    'node_modules/konnect-web-theme/dist/font-awesome5/webfonts/fa-brands-400.ttf',
    'node_modules/konnect-web-theme/dist/font-awesome5/webfonts/fa-solid-900.ttf',
    'node_modules/konnect-web-theme/dist/font-awesome5/webfonts/fa-regular-400.ttf',
  ];

  // Contient les chemins de l'url pour récupérer les informations d'un produit
  private static readonly _catalaogProductUrl = [ 'picture/obj' ];

  /** Liste des requêtes enreigstrées */
  public requestRecorded : string[];

  /** Promesses des requêtes éxécutées */
  private _listRequestPromise : Array<Promise<any>>;

  /** PollyJS */
  private _polly : Polly;

  /** Id de l'enregistrement de Polly */
  public recordingId : string;

  /** Permet de savoir si le record est en pause */
  private _paused = false;

  /** Permet d'observer les entrées des requêtes */
  public static observer : PerformanceObserver;

  /** bind des fonctions pour les listeners des messages entre le content script
   * et le Polly Recorder
   */
  private _boundedGetHARResult : () => void = null;
  private _boundedPause : () => void = null;
  private _boundedUnpause : () => void = null;

  constructor() {


    this._boundedGetHARResult = this._getHARResult.bind(this);
    this._boundedPause = this._pause.bind(this);
    this._boundedUnpause = this._unpause.bind(this);

    this.requestRecorded = [];
    this._listRequestPromise = [];

    this._polly = this._createPollyInstance();
    this.recordingId = this._polly.recordingId;
    this._start();

    // On send au startup condig que PollyJS est prêt et qu'il peut donc charger les modules
    this._dispatchPollyReadyEvent();

    // On enregistre des requêtes que l'on a pas
    this._fetchRequest('favicon.ico');
    this._fetchRequest(window.location.pathname);

    // le startup config nous dit quand il a exporté les modules
    WindowService.addEventListener(controlMSG.SETUP_READY_EVENT, this._dispatchPollyReadyEvent, false);

    this._dispatchPollyReadyEvent();

    this._addAllListener();

    PollyRecorder.observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        /* Si la requêtes n'est pas initiée par un fetch ou xmlhttprequest et
          que l'enregistrement n'est pas en pause,
          Polly ne la détécte pas donc on fetch pour qu'il l'enregistre
        */
        if ((entry as PerformanceResourceTiming).initiatorType !== PollyRecorder.FETCH
        && (entry as PerformanceNavigationTiming).initiatorType !== PollyRecorder.XMLHTTREQUEST
        && !this._paused
      ) {
          fetch(entry.name);
          this.requestRecorded.push(entry.name);
          /**
           * Pour le catalog des prduits, il y a un lazy load qui execute une requête http
           * pour récupérer un produit qui n'est pas visible sur notre page mais quand même charger dans le dom
           * on récupêre donc sa requête car quand on rejoue le scénario, il nous l'a faut.
           */
          for (let i = 0 ; i < PollyRecorder._requestNotRecorded.length; i++) {
            const catalogURL = PollyRecorder._requestNotRecorded[i];
            if ((entry.name.includes(catalogURL) || new RegExp(/autoroute\/obj\/+\d/g).test(entry.name)) && entry.name ) {

              this._fetchProductCatalogRequest(entry.name);
            }
          }
        }
      });
    });

    PollyRecorder.observer.observe({entryTypes: ['resource', 'mark', 'measure']});
  }

  /**
   * Dispatch l'event PollyReady  au startup config pour qu'il exporte les modules
   */
  private _dispatchPollyReadyEvent() {
    WindowService.dispatchEvent(new CustomEvent(controlMSG.POLLY_READY_EVENT));
  }

  /**
   * Permet de fetch les requêtes lié aux produits
   * CETTE SOLTION N'EST PAS DÉFINITIVE, LE PROBLÈME NE VIENT PAS DE L'ENREGISTREMENT DES REQUÈTES
   */
  private _fetchProductCatalogRequest(url : string) : void {
    const listA = document.querySelectorAll('a');
    // On slip une ancience request pour savoir ou est le product id et pour avoir les bon paramètre
    const splitURL = url.split('/');
    let indexId = -1;

    // Si la requete contient un obj alors on a un product id on le modifie et on fetch
    for (let i = 0; i < splitURL.length; i++) {

      if (splitURL[i] === 'obj') {
        indexId = i + 1;
      }
    }
    for (let i = 0; i < listA.length; i++) {

      const currentLink = listA[i].href;
      const splitLink = currentLink.split('/');
      const productId = parseInt(splitLink[splitLink.length - 1], 10);

      // On vérifie si la requête contient un catalog product et on trouve le product id pour l'utiliser pour la requête
      if (currentLink.includes('catalog_product')) {

        if (!isNaN(productId) && indexId) {

          // On build la requete avec le product id voulu et on fetch
          splitURL[indexId] = `${productId}?${splitURL[indexId].split('?')[1]}`;
          const builtLink = splitURL.join('/');

          if (!this.requestRecorded.includes(builtLink)) {
            try {
              fetch(builtLink);
              this.requestRecorded.push(builtLink);
            }
            catch (err) {}
          }
        }
      }
    }
  }

  /**
   * Créé une instance de pollyjS
   */
  private _createPollyInstance() : Polly {
    return new Polly('scenario', {
      mode: 'record',
      keepUnusedRequests: true,
      recordFailedRequests: true,
      recordIfMissing: true,
      logging: true,
      adapters: ['fetch', 'xhr'],
      adapterOptions: {
        xhr: {
          context: window
        },
        fetch: {
          context: window
        }
      },
      persister: 'in-memory-persister'
    });
  }

  /**
   * On start le record
   */
  private _start() : void {
    this._polly.record();
  }

  /**
   * On met en pause le record
   */
  private _pause() : void {
    this._polly.pause();
    this._paused = true;
  }


  /**
   * On unpause le record
   */
  private _unpause() : void {
    this._polly.play();
    this._paused = false;
  }

  /**
   * Permet de savoir si on est en pause
   */
  public isPaused() : boolean {
    return this._paused;
  }

  /**
   * On stop le record
   */
  private async _stopAsync() : Promise<void> {
    // on enlève la pause pour pouvoir fetch les requests dont on a besoin
    this._unpause();

    const listRequest = window.performance.getEntries();
    let currentReq = null;

    for (let i =  0; i < listRequest.length; i++) {

      currentReq = listRequest[i].toJSON();

      if (currentReq.initiatorType !== PollyRecorder.XMLHTTREQUEST &&
         currentReq.initiatorType !== PollyRecorder.FETCH &&
          !this.requestRecorded.includes(currentReq.name)
      ) {

        this._addToRequestList(currentReq.name);
      }
    }
    // Requête qu'on doit fech car on ne les a pas fetch
    for (let i = 0; i < PollyRecorder._requestNotRecorded.length; i++) {
      this._fetchRequest(PollyRecorder._requestNotRecorded[i]);
    }

    await Promise.all(this._listRequestPromise);
    await this._polly.stop();
  }

  /**
   * Récupère le resultat de PollyJS
   */
  private _getResult(id : string) : string {
    const result = this._polly.persister.findRecording(id);

    if (result) return JSON.stringify(result);

    return ';';
  }

  /**
   * Fetch la requête donnée
   */
  private _fetchRequest(request : string) {
    /*
     * On fetch la request par exemple en fonction de l'url de la page :
       Par exemple si on est dans localhost:3000 :
       http://localhost:3000/requesteQuiNousInteresse
     */
    const requestTofetch = `${window.location.protocol}//${window.location.host}/${request}`;

    // Si on n'a pas la request alors on l'a fetch
    if (!this.requestRecorded.includes(requestTofetch)) {

      this._addToRequestList(requestTofetch);
    }
  }

  /**
   * Ajoute une fetch request dans la liste des request à fatch
   * @param url
   */
  private _addToRequestList(url : string) : void {
    this._listRequestPromise.push(
      fetch(url)
    );
  }

  /**
   * Fonction exécuté lors de la reception de l'event
   * qui permet de récuperer le résultat de polly
   * @param event
   */
  private async _getHARResult(event) : Promise<void> {
    // On atttend que polly ait fini de stopper
    await this._stopAsync();

    // On envoie le résultat au content-script
    window.postMessage(
      {
        action : controlMSG.GOT_HAR_EVENT,
        payload : { result : this._getResult(this.recordingId), recordingId : this.recordingId }
      },
      event.origin
    );

    // On remove les listeners
    this._removeAllListener();
    PollyRecorder.observer.disconnect();
  }

  /**
   * Ajout de tous les listeners d'event entre le polly recorder et le content script
   */
  private _addAllListener() : void {
    WindowService.addEventListener(controlMSG.GET_HAR_EVENT, this._boundedGetHARResult, false);
    WindowService.addEventListener(controlMSG.PAUSE_EVENT, this._boundedPause, false);
    WindowService.addEventListener(controlMSG.UNPAUSE_EVENT, this._boundedUnpause, false);
  }

  /**
   * Remove de tous les listeners entre polly recorder et le content script
   */
  private _removeAllListener() : void {
    WindowService.removeEventListener(controlMSG.GET_HAR_EVENT, this._boundedGetHARResult, false);
    WindowService.removeEventListener(controlMSG.PAUSE_EVENT, this._boundedPause, false);
    WindowService.removeEventListener(controlMSG.UNPAUSE_EVENT, this._boundedUnpause, false);
  }
}

(window as any).polly = new PollyRecorder();