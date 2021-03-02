import { KeydownEventComponent } from '../components/components-event/keydown-event-component';
import { ClickEventComponents } from '../components/components-event/click-event-components';
import { ComponentModel } from './../models/component-model';
import domEventsToRecord from '../constants/dom-events-to-record';
import { DropEventComponents } from '../components/components-event/drop-event-components';
import { ChangeEventComponents } from '../components/components-event/change-event-components';

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
  }) : ComponentModel {

    // En fonction de l'événement déclancheur
    switch (event) {
      // Si c'est un click
      case domEventsToRecord.CLICK:
        return ClickEventComponents.determinateClickComponent(element, previousElement);
      // Si c'est un drop
      case domEventsToRecord.DROP:
        return DropEventComponents.determinateDropComponent(element);
      // Si c'est un change
      case domEventsToRecord.CHANGE:
        return ChangeEventComponents.determinateChangeComponent(element);
      // Si c'est un keydown
      case domEventsToRecord.KEYDOWN:
        return KeydownEventComponent.determinateKeydownComponent(element);
    }
  }
}