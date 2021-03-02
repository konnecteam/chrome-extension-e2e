import { IframeComponent } from '../konnect/iframe-component';
import { IComponentModel } from '../../models/i-component-model';

/**
 * EventComponents qui permet de gérer les Keydown
 */
export class KeydownEventComponent {

  /**
   * Détermine sur quel composant il y a eu un keydown
   */
  public static determinateKeydownComponent(element : HTMLElement) : IComponentModel {

    return IframeComponent.isIframe(element);
  }
}