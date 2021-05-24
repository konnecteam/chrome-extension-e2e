import { ElementService } from './../services/element/element-service';
import { IComponent } from '../interfaces/i-component';
import domEventsToRecord from '../constants/events/events-dom';

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
    previousElement : {selector : string, element : Element, typeList : string
  }) : IComponent {

    // En fonction de l'événement déclancheur
    switch (event) {
      // Si c'est un click
      case domEventsToRecord.CLICK:
        return ElementService.getClickComponent(element, previousElement);
      // Si c'est un drop
      case domEventsToRecord.DROP:
        return ElementService.getDropComponent(element);
      // Si c'est un change
      case domEventsToRecord.CHANGE:
        return ElementService.getChangeComponent(element);
      // Si c'est un keydown
      case domEventsToRecord.KEYDOWN:
        return ElementService.getKeydownComponent(element);
      default:
        return null;
    }
  }
}