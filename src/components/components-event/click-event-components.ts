import { KmSwitchComponent } from '../konnect/km-switch- component';
import { KSelectComponent } from '../konnect/k-select-component';
import { ComponentModel } from './../../models/component-model';
import { FileDropZoneComponent } from '../components/file-drop-zone-component';
import { KListComponent } from '../konnect/k-list-component';

/**
 * EventComponents qui permet de gérer les Click
 */
export class ClickEventComponents {

  /**
   * Permet de déterminer sur quel composant on a cliqué
   */
  public static determinateClickComponent(element : HTMLElement, previousElement : { selector : string, typeList : string, element : Element}) : ComponentModel {

    return FileDropZoneComponent.isFileDropZone(element) ||
    KSelectComponent.isKSelect(element) || KmSwitchComponent.isKmSwitch(element) ||
    KListComponent.isKList(element, previousElement);
  }
}