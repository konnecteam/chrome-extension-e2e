import { ElementService } from './../services/element/element-service';
import { IComponent } from '../interfaces/i-component';
import { EDomEvent } from '../enum/events/events-dom';

/**
 * Manager qui fait la gestions des composants
 */
export class ComponentManager {

  /**
   * Détermine sur quel composant se passe l'événement
   */
  public static getComponent(
    event : string,
    element : HTMLElement
  ) : IComponent {

    // En fonction de l'événement déclancheur
    switch (event) {
      // Si c'est un click
      case EDomEvent.CLICK :
        return ElementService.getClickComponent(element);
      // Si c'est un drop
      case EDomEvent.DROP :
        return ElementService.getDropComponent(element);
      // Si c'est un change
      case EDomEvent.CHANGE :
        return ElementService.getChangeComponent(element);
      // Si c'est un keydown
      case EDomEvent.KEYDOWN :
        return ElementService.getKeydownComponent(element);
      default :
        return null;
    }
  }
}