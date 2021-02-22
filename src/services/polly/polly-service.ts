/**
 * Service qui permet la gestion des enregistrements depuis le background
 */
export class PollyService {

  // Event entre content-script et le script injecté

  /** GET_HAR event */
  public static readonly GET_HAR_ACTION = 'GET_HAR';

  /** GOT_HAR event */
  public static readonly GOT_HAR_ACTION = 'GOT_HAR';

  /** Pause/Unpause event */
  public static readonly DO_PAUSE = 'do-pause';

  public static readonly DO_UNPAUSE = 'do-unpause';

  /** Path du script à injecter */
  public static readonly POLLY_SCRIPT_PATH = './polly-build/polly.js';

  /** Instance de classe */
  public static instance : PollyService;

  /** Id de l'enregristrement Polly */
  public id : string;

  /** Har de l'enregistrement */
  public har : string;

  constructor() {
    this.id = '';
    this.har = '';
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
  public getId() : string {
    return this.id;
  }

  /**
   * Getter pour har
   */
  public getHar() : string {
    return this.har;
  }

  /**
   * Réinitialise les datas
   */
  public flush() : void {
    this.id = '';
    this.har = '';
  }

  /**
   * Permet d'écouter les messages de pollyJS
   */
  public listen(window : Window, callback : () => void) : void {
    window.addEventListener('message', callback, false);
  }
}