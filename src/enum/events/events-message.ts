/**
 * Message envoyé entre le recording controller, content-script, PolyRecorder
 */
export enum EEventMessage {

  /**
   * Event entre le recording-controller et
   * Content-script
   */

  /** Event de récupération du résultat de polly */
  GET_RESULT = 'get-result',

  /** Event de récupréation d'un fichiser uploadé */
  GET_NEW_FILE = 'get-newFile',

  /** Event de récupération de l'url courant */
  GET_CURRENT_URL = 'get-current-url',

  /** Event de récupération de la taille de la fenêtre */
  GET_VIEWPORT_SIZE = 'get-viewport-size',

  /** Event de commencement de l'enregistrement */
  EVENT_RECORDER_STARTED = 'event-recorder-started',

  /**
   * Event entre le Polly Recorder et
   * Content-script
   */

  /** Event de récupération du fichier HAR */
  GET_HAR = 'GET-HAR',

  /** Event de récupération du résultat du record */
  GOT_HAR = 'GOT-HAR',

  /** Event pause */
  PAUSE = 'do-pause',

  /** Event unpause */
  UNPAUSE = 'do-unpause',

  /** Event du status de polly */
  POLLY_READY = 'polly-ready',

  /** Event du status du startup config */
  SETUP_READY = 'setup-ready'
}