import { IframeComponent } from '../konnect/iframe-component';
import { ComponentModel } from '../../models/component-model';

/**
 * EventComponents qui permet de gérer les Keydown
 */
export class KeydownEventComponent {

  /**
   * Détermine sur quel composant il y a eu un keydown
   */
  public static determinateKeydownComponent(element : HTMLElement) : ComponentModel {

    return IframeComponent.isIframe(element);
  }
}