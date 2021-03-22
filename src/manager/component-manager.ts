import { ElementService } from './../services/element/element-service';
import { IComponent } from '../interfaces/i-component';
import domEventsToRecord from '../constants/dom-events-to-record';

/**
 * Manager qui fait la gestions des composants
 */
export class ComponentManager {

  /**
   * Détermine sur quel composant se passe l'événement
   */
  public static determinateComponent(
    event : string,
    element : HTMLElement,
    previousElement : {selector : string, element : Element, typeList : string
  }) : IComponent {

    // En fonction de l'événement déclancheur
    switch (event) {
      // Si c'est un click
      case domEventsToRecord.CLICK:
        return ElementService.determinateClickComponent(element, previousElement);
      // Si c'est un drop
      case domEventsToRecord.DROP:
        return ElementService.determinateDropComponent(element);
      // Si c'est un change
      case domEventsToRecord.CHANGE:
        return ElementService.determinateChangeComponent(element);
      // Si c'est un keydown
      case domEventsToRecord.KEYDOWN:
        return ElementService.determinateKeydownComponent(element);
      default:
        return null;
    }
  }
}