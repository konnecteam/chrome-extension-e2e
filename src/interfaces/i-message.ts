/**
 * Interface représentant les messages de communication entre background et content-script
 */
export class IMessage {

  /** Label identifiant l'événement */
  control? : string;


  /** Identifiant de la frame actuelle */
  frameId? : number;

  /** Url de la frame actuelle */
  frameUrl? : string;

  /** Taille de l'écran */
  coordinates? : {
    width : number,
    height : number
  };

  /** URL du résultat des requêtes de PollyJS */
  resultURL? : any;

  /** Identifiant de l'enregistrement génère via PollyJs */
  recordingId? : string;

  /** Sélécteur de l'élément */
  selector? : string;

  /** Valeur du sélécteur */
  value? : any;

  /** Action à effectuer */
  action? : string;

  /** Nom d'un fichier  */
  filename? : string;

  /** Contenu du fichier */
  content? : string;

  /** Type de l'événement */
  typeEvent? : string;
}