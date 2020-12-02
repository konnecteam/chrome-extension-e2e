import { IframeComponent } from '../components/iframe-component';
import { ComponentModel } from '../../models/component-model';

/**
 * EventsComponent qui permet de gérer les Keydown
 */
export class KeydownEventComponent {

  /**
   * Détermine sur quel composant il y a eu un keydown
   */
  public static determinateKeydownComponent(element : HTMLElement) : ComponentModel {

    return IframeComponent.isIframe(element);
  }
}