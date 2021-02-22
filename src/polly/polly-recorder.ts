import { Polly } from '@pollyjs/core';
import * as  FetchAdapter from '@pollyjs/adapter-fetch';
import * as XHRAdapter from '@pollyjs/adapter-xhr';
import inMemoryPersister from '../lib/persister/polly/in-memory-persister';

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

  /** GET_HAR event pour communiquer avec content-script */
  public static readonly GET_HAR = 'GET_HAR';

  /** GOT_HAR event pour communiquer avec content-script */
  public static readonly GOT_HAR = 'GOT_HAR';

  /** Event pour communiquer avec le content-script */
  public static readonly DO_PAUSE = 'do-pause';
  public static readonly DO_UNPAUSE = 'do-unpause';

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

  /** Regex pour déterminer si on a une requête pour les produits */
  public static readonly regexAutorouteRequest = new RegExp(/autoroute\/obj\/+\d/g);

  /** Liste des requêtes enreigstrées */
  public requestRecorded : string[];

  /** Promèse des requêtes éxécutées */
  private _listPromise : Array<Promise<any>>;

  /** PollyJS */
  private _polly : Polly;

  /** Id de l'enregistrement de Polly */
  public recordingId : string;

  private _paused = false;
  constructor() {

    this.requestRecorded = [];
    this._listPromise = [];

    this._polly = this._createPollyInstance();
    this.recordingId = this._polly.recordingId;
    this._start();

    // On send au statup condig que PollyJS est prêt et qu'il peut donc charger les modules
    const event = new CustomEvent('PollyReady');
    window.dispatchEvent(event);

    // On enregistre des requêtes que l'on a pas
    this._fetchRequest('favicon.ico');
    this._fetchRequest(window.location.pathname);

    // le Statup config nous dit quand il a exporté les modules
    window.addEventListener('SetupReady', function() {
      window.dispatchEvent(new CustomEvent('PollyReady'));
    } , false);
    window.dispatchEvent(event);

    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        /* Si la requêtes n'est pas initiée par un fetch ou xmlhttprequest,
           Polly ne la détécte pas donc on fetch pour qu'il l'enregistre
        */
        if ((entry as PerformanceResourceTiming).initiatorType !== PollyRecorder.FETCH
        && (entry as PerformanceNavigationTiming).initiatorType !== PollyRecorder.XMLHTTREQUEST
      ) {

          fetch(entry.name);
          this.requestRecorded.push(entry.name);

          //Pour les items du lazy loading à cause d'un item qui veut se charger mais qui ne devrait pas
          if ((entry.name.includes('picture/obj') || PollyRecorder.regexAutorouteRequest.test(entry.name)) && entry.name ) {

            this._fetchProductCatalogRequest(entry.name);
          }
        }
      });
    });

    observer.observe({entryTypes: ['resource', 'mark', 'measure']});
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
          splitURL[indexId] = productId + '?' + splitURL[indexId].split('?')[1];
          const builtLink = splitURL.join('/');

          if (!this.requestRecorded.includes(builtLink)) {

            fetch(builtLink);
            this.requestRecorded.push(builtLink);
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
      expiresIn: '1000000000d',
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
      persister: 'in-memory-persister',
      matchRequestsBy: {
        method: true,
        headers: false,
        body: true,
        order: true,
        url: {
          protocol: false,
          username: false,
          password: false,
          hostname: true,
          port: true,
          pathname: true,
          query: true,
          hash: true
        }
      }
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
  public pause() : void {
    this._polly.pause();
    this._paused = true;
  }


  /**
   * On play le record
   */
  public unpause() : void {
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
  public async stop() : Promise<void> {

    const listRequest = window.performance.getEntries();
    let currentReq = null;

    for (let i =  0; i < listRequest.length; i++) {

      currentReq = listRequest[i].toJSON();

      if (currentReq.initiatorType !== PollyRecorder.XMLHTTREQUEST &&
         currentReq.initiatorType !== PollyRecorder.FETCH &&
          !this.requestRecorded.includes(currentReq.name)
      ) {

        this._listPromise.push(fetch(currentReq.name));
      }
    }
    // Requête qu'on doit fech car on ne les a pas fetch
    for (let i = 0; i < PollyRecorder._requestNotRecorded.length; i++) {
      this._fetchRequest(PollyRecorder._requestNotRecorded[i]);
    }

    await Promise.all(this._listPromise);
    await this._polly.stop();
    Promise.resolve('fini');
  }

  /**
   * Récupère le resultat de PollyJS
   */
  public getResult(id : string) : string {
    const result = this._polly.persister.findRecording(id);

    if (result) return JSON.stringify(result);

    return ';';
  }

  /**
   * Fetch la requête donnée
   */
  private _fetchRequest(request : string) {
    const requestTofetch = window.location.protocol + '//' + window.location.host + '/' + request;

    if (!this.requestRecorded.includes(requestTofetch)) {

      this._listPromise.push(fetch(requestTofetch));
    }
  }
}

(window as any).polly = new PollyRecorder();

// Envoie le résulat au content script
window.addEventListener(PollyRecorder.GET_HAR, function getHARResult(event) {
  const polly = ((window as any).polly as PollyRecorder) ;

  polly.stop().then(function() {

    const har = polly.getResult(polly.recordingId);
    const id = polly.recordingId;
    const resulRecord = {result: har, recordingId: id };
    window.postMessage({action: PollyRecorder.GOT_HAR, payload: resulRecord}, (event as any).origin);
  });
}, false);

window.addEventListener(PollyRecorder.DO_PAUSE, function doPause() {
  const polly = ((window as any).polly as PollyRecorder);
  polly.pause();
}, false);

window.addEventListener(PollyRecorder.DO_UNPAUSE, function doUnPause() {
  const polly = ((window as any).polly as PollyRecorder) ;
  polly.unpause();
}, false);