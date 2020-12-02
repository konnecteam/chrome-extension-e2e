import { KeydownEventComponent } from '../components/components-event/keydown-event-component';
import { ClickEventComponents } from '../components/components-event/click-event-components';
import { ComponentModel } from './../models/component-model';
import { FileDropZoneComponent } from '../components/components/file-drop-zone-component';
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
    elementSelector : string,
    previousSelector : string,
    previousElement : {selector : string, element : Element, typeList : string
  }) : ComponentModel {

    let componentFinded : ComponentModel;
    // En fonction de l'événement déclancheur
    switch (event) {
      // Si c'est un click
      case domEventsToRecord.CLICK:
        componentFinded = ClickEventComponents.determinateClickComponent(element, elementSelector, previousSelector, previousElement);
        break;
      // Si c'est un drop
      case domEventsToRecord.DROP:
        componentFinded = DropEventComponents.determinateDropComponent(element);
        break;
      // Si c'est un change
      case domEventsToRecord.CHANGE:
        componentFinded = ChangeEventComponents.determinateChangeComponent(element);
        break;
      // Si c'est un keydown
      case domEventsToRecord.KEYDOWN:
        componentFinded = KeydownEventComponent.determinateKeydownComponent(element);
        break;
    }

    return componentFinded;
  }
}