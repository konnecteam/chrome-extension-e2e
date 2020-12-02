import { InputCalendarComponent } from '../components/input-calendar-component';
import { KListComponent } from '../components/k-list-component';
import { KmSwitchComponent } from '../components/km-switch- component';
import { KSelectComponent } from '../components/k-select-component';
import { ComponentModel } from './../../models/component-model';
import { FileDropZoneComponent } from '../components/file-drop-zone-component';
import { EventModel } from '../../models/event-model';

/**
 * EventsComponents qui permet de gérer les Click
 */
export class ClickEventComponents {

  /**
   * Permet de déterminer sur quel composant on a cliqué
   */
  public static determinateClickComponent(element : HTMLElement, elementSelector : string,
     previousSelector : string, previousElement : { selector : string, typeList : string, element : Element}) : ComponentModel {

    return FileDropZoneComponent.isFileDropZone(element) ||
    KSelectComponent.isKSelect(element) || KmSwitchComponent.isKmSwitch(element) ||
    KListComponent.isKlist(elementSelector, element, previousSelector, previousElement)
    || InputCalendarComponent.isInputCalendar(element);
  }
}