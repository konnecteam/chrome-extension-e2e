import { ElementService } from './../services/element/element-service';
import { IComponent } from '../interfaces/i-component';

// Constant
import DOM_EVENT from '../constants/events/events-dom';

/**
 * Manager qui fait la gestions des composants
 */
export class ComponentManager {

  /**
   * Détermine sur quel composant se passe l'événement
   */
  public static getComponent(
    event : string,
    element : HTMLElement,
    kListElement : { selector : string, element : Element, typeList : string }
  ) : IComponent {

    // En fonction de l'événement déclancheur
    switch (event) {
      // Si c'est un click
      case DOM_EVENT.CLICK:
        return ElementService.getClickComponent(element, kListElement);
      // Si c'est un drop
      case DOM_EVENT.DROP:
        return ElementService.getDropComponent(element);
      // Si c'est un change
      case DOM_EVENT.CHANGE:
        return ElementService.getChangeComponent(element);
      // Si c'est un keydown
      case DOM_EVENT.KEYDOWN:
        return ElementService.getKeydownComponent(element);
      default:
        return null;
    }
  }
}