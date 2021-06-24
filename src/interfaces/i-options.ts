/**
 * Interface représentant les options de l'utilisateur
 */
export interface IOption {

  /** Mettre le scénario dans une fonction async */
  wrapAsync : boolean;

  /** Affichage du scénario */
  headless : boolean;

  /** Mettre les waitForNavigation */
  waitForNavigation : boolean;

  /** Faire un witForSelector après chaque click */
  waitForSelectorOnClick : boolean;

  /** Mettre une ligne entre chaque block */
  blankLinesBetweenBlocks : boolean;

  /** Utiliser une regex pour les custom attributes */
  useRegexForDataAttribute : boolean;

  /** Prendre en compte les requêtes http */
  recordHttpRequest : boolean;

  /** Regex des data attributes */
  dataAttribute : string;

  /** Ligne à écrire après chaque click */
  customLineAfterClick : string;

  /** regex pour filtrer les requêtes http */
  regexHTTPrequest : string;

  /** Ligne customisée à rajouter avant le block d'un event */
  customLinesBeforeEvent : string;

  /**
   * Supprimer le cache du site
   */
  deleteSiteData : boolean;

}