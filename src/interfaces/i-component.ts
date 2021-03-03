/**
 * Interface représentant un composant
 */
export interface IComponent {

  /** Nom du composant */
  component : string;

  /** Element du composant */
  element : HTMLElement;

  /** Le sélécteur de l'event précédant */
  previousSelector? : string;

  /** Utile pour déterminer dans quel type de konnect liste on se situe */
  previousElement? : {
    selector : string,
    element : Element,
    typeList : string
  };
}