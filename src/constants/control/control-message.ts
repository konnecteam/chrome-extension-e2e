/**
 * Controle entre recording-controller, content-script, Polly Recorder
 */
export default {

  /**
   * Event entre le recording-controller et
   * Content-script
   */
  // Récupérer le résultat de Polly
  GET_RESULT_EVENT : 'get-result',

  // Récupérer un fichier uploadé
  GET_NEW_FILE_EVENT : 'get-newFile',

  // Récupère l'url courante
  GET_CURRENT_URL_EVENT : 'get-current-url',

  // Récupère la taille de l'écran
  GET_VIEWPORT_SIZE_EVENT : 'get-viewport-size',

  // Commencement de l'enregistrement
  EVENT_RECORDER_STARTED_EVENT : 'event-recorder-started',

  /**
   * Event entre le Polly Recorder et
   * Content-script
   */
  // GET_HAR event pour récupérer le préparer le fichier har
  GET_HAR_EVENT : 'GET-HAR',

  // GOT_HAR event pour récupérer le résultat du record
  GOT_HAR_EVENT : 'GOT-HAR',

  // Event pour mettre pause ou unpause
  PAUSE_EVENT : 'do-pause',
  UNPAUSE_EVENT : 'do-unpause',

  // Event pour savoir si polly est prêt
  POLLY_READY_EVENT : 'polly-ready',
  // Event pour savoir si startupconfig est prêt
  SETUP_READY_EVENT : 'setup-ready'

};