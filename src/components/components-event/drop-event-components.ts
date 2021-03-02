import { IComponentModel } from '../../models/i-component-model';
import { FileDropZoneComponent } from '../components/file-drop-zone-component';

/**
 * EventComponents qui permet de gérer les Drop
 */
export class DropEventComponents {

  /**
   * Détermine sur quel composant il y a eu un drop
   */
  public static determinateDropComponent(element : HTMLElement) : IComponentModel {

    return FileDropZoneComponent.isFileDropZone(element);
  }

}