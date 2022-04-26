/**
 * Interface représentant les messages de communication entre background et content-script
 */
export interface IMessage {

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

  /** Nom d'un fichier  */
  filename? : string;

  /** Contenu du fichier */
  content? : string | ArrayBuffer;

  // Information concernant l'event :

  /** Action de l'événement */
  action? : string;

  /** Type d'event */
  typeEvent? : string;

  /** Selector de l'élément concerné */
  selector? : string;

  /** Valeur de l'événement */
  value? : any;

  /** Href de l'event */
  href? : string;

  /** Keycode détécté */
  keyCode? : number;

  /** Touche surlaquelle l'user a cliqué */
  key? : string;

  /** Tagname de l'element */
  tagName? : string;

  /** commentaires */
  comments? : string;

  /** Position du scroll horizontal */
  scrollY? : number;

  /** Position du scroll vertical */
  scrollX? : number;

  /** Index de l'élément d'une liste déroulante */
  listItemIndex? : string;

  /** Sélécteur de la liste déroulante */
  sourceSelector? : string;

  /** Sélécteur de l'iframe */
  iframe? : string;

  /** Durée d'un click */
  durancyClick? : number;

  /** Liste des noms de fichiers à uplaoder séparés par des ';' */
  files? : string;

  /** Sélécteur de l'input à focus pour l'input numeric */
  selectorFocus? : string;

  /** Height de la page */
  height? : number;

  /** Width de la page */
  width? : number;

  /** Sélécteur d'un élément à faire scroller */
  scrollElement? : string;

  /** Scroll horizontal de l'élément à faire scroller */
  scrollYElement? : number;

  /** Scroll Verticale de l'élément à faire scroll */
  scrollXElement? : number;

  /** Coordonées du click */
  clickCoordinates? : { x : number, y : number };

  /**
   * Quand on traite un submit on a besoin de l'emetteur de l'event,
   * donc on va garder le selecteur de l'emetteur
   */
  submitterSelector? : string;
}