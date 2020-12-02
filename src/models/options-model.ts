/**
 * Model représentant les options de l'utilisateur
 */
export class OptionModel {

  /** Mettre le scénario dans une fonction async */
  public wrapAsync : boolean;

  /** Affichage du scénario */
  public headless : boolean;

  /** Mettre les waitForNavigation */
  public waitForNavigation : boolean;

  /** Faire un witForSelector après chaque click */
  public waitForSelectorOnClick : boolean;

  /** Mettre une ligne entre chaque block */
  public blankLinesBetweenBlocks : boolean;

  /** Utiliser une regex pour les custom attributes */
  public useRegexForDataAttribute : boolean;

  /** Prendre en compte les requêtes http */
  public recordHttpRequest : boolean;

  /** Regex des data attributes */
  public dataAttribute : string;

  /** Ligne à écrire après chaque click */
  public customLineAfterClick : string;

  /** regex pour filtrer les requêtes http */
  public regexHTTPrequest : string;

  /** Ligne customisée à rajouter avant le block d'un event */
  public customLineBeforeEvent : string;
}