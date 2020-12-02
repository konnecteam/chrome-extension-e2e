/**
 * Model représentant un composant
 */
export class ComponentModel {

  /** Nom du composant */
  public component : string;

  /** Element du composant */
  public element : HTMLElement;

  /** Le sélécteur de l'event précédant */
  public previousSelector? : string;

  /** Utile pour déterminer dans quel type de k list on est */
  public previousElement? : {
    selector : string,
    element : Element,
    typeList : string
  };
}