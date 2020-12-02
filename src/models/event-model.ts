/**
 * Model représentant un Event
 */
export class EventModel {

  /** Action de l'événement */
  public action? : string;

  /** Type d'event */
  public typeEvent? : string;

  /** Selector de l'élément concerné */
  public selector? : string;

  /** Valeur de l'événement */
  public value? : any;

  /** Href de l'event */
  public href? : string;

  /** Keycode détécté */
  public keyCode? : number;

  /** Touche surlaquelle l'user a cliqué */
  public key? : string;

  /** Tagname de l'element */
  public tagName? : string;

  /** Id de la frame */
  public frameId? : number;

  /** Url de la frame */
  public frameUrl? : string;

  /** commentaires */
  public comments? : string;

  /** Position du scroll horizontal */
  public scrollY? : number;

  /** Position du scroll vertical */
  public scrollX? : number;

  /** Index de l'élément d'une liste déroulante */
  public listItemIndex? : string;

  /** Sélécteur de la liste déroulante */
  public sourceSelector? : string;

  /** Sélécteur de l'iframe */
  public iframe? : string;

  /** Durée d'un click */
  public durancyClick? : number;

  /** Liste des noms de fichiers à uplaoder séparés par des ';' */
  public files? : string;

  /** Sélécteur de l'input à focus pour l'input numeric */
  public selectorFocus? : string;

  /** Coordonées */
  public coordinates? : {x : number, y : number};

  /** Height de la page */
  public height? : number;

  /** Width de la page */
  public width? : number;

  /** Sélécteur d'un élément à faire scroller */
  public scrollElement? : string;

  /** Scroll horizontal de l'élément à faire scroller */
  public scrollYElement? : number;

  /** Scroll Verticale de l'élément à faire scroll */
  public scrollXElement? : number;

  /** Sélecteur de header du calendar */
  public calendarHeader? : string;

  /** Sélécteur de la view du calendar */
  public calendarView? : string;

  /** Sélecteur de l'élément date */
  public dateSelector? : string;

}