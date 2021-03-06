import { ChromeService } from '../../services/chrome/chrome-service';

/**
 * Service qui permet la gestion des enregistrements depuis le background
 */
export class PollyService {

  /** Path du script à injecter */
  public static readonly POLLY_SCRIPT_PATH = 'lib/scripts/polly/polly.js';

  /** Instance de classe */
  public static instance : PollyService;

  /** PollyJS déjà injecté ? */
  private _scriptAlreadyInjected : boolean = false;

  /**
   * Contient le résultat de l'enregistrement de polly
   */
  public record : {
    id : string,
    har : string
  };

  constructor() {
    this.record = {
      id : '',
      har : ''
    };
  }

  /**
   * Récupération de l'instance de la classe
   */
  public static get Instance() : PollyService {
    if (PollyService.instance == null) {
      PollyService.instance = new PollyService();
    }
    return PollyService.instance;
  }

  /**
   * Getter pour l'id
   */
  public getRecordId() : string {
    return this.record.id;
  }

  /**
   * Getter pour har
   */
  public getRecordHar() : string {
    return this.record.har;
  }

  /**
   * Réinitialise les datas
   */
  public flush() : void {
    this.record.id = '';
    this.record.har = '';
  }

  /**
   * Permet d'écouter les messages de pollyJS
   */
  public listen(window : Window, callback : () => void) : void {
    window.addEventListener('message', callback, false);
  }

  /** Injection du script pollyJS dans la page */
  public injectScript() {

    if (chrome && chrome.extension && !this._scriptAlreadyInjected) {

      const script = document.createElement('script');
      script.async = false;
      script.defer = false;
      script.setAttribute('src', ChromeService.getUrl(PollyService.POLLY_SCRIPT_PATH));
      (document.head || document.documentElement).prepend(script);
      this._scriptAlreadyInjected = true;
    }
  }
}