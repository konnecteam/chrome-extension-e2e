/**
 * Model représentant les messages de communication entre background et content-script
 */
export class IMessageModel {

  /** Label identifiant l'événement */
  public control? : string;


  /** Identifiant de la frame actuelle */
  public frameId? : number;

  /** Url de la frame actuelle */
  public frameUrl? : string;

  /** Taille de l'écran */
  public coordinates? : {
    width : number,
    height : number
  };

  /** URL du résultat des requêtes de PollyJS */
  public resultURL? : any;

  /** Identifiant de l'enregistrement génère via PollyJs */
  public recordingId? : string;

  /** Sélécteur de l'élément */
  public selector? : string;

  /** Valeur du sélécteur */
  public value? : any;

  /** Action à effectuer */
  public action? : string;

  /** Nom d'un fichier  */
  public filename? : string;

  /** Contenu du fichier */
  public content? : string;

  /** Type de l'événement */
  public typeEvent? : string;
}