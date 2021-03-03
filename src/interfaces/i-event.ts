/**
 * Interface représentant un Event
 */
export interface IEvent {

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

  /** Id de la frame */
  frameId? : number;

  /** Url de la frame */
  frameUrl? : string;

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

  /** Coordonées */
  coordinates? : {x : number, y : number};

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

  /** Sélecteur de header du calendar */
  calendarHeader? : string;

  /** Sélécteur de la view du calendar */
  calendarView? : string;

  /** Sélecteur de l'élément date */
  dateSelector? : string;

}