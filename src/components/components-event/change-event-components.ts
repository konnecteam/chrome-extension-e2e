import { InputFilesComponent } from './../components/input-file-component';
import { InputNumericComponent } from '../components/input-numeric-component';
import { ComponentModel } from '../../models/component-model';
/**
 * EventComposent qui permet de gérer les event de change
 */
export class ChangeEventComponents {

  /**
   * Permet determiner sur quel élément est le change
   */
  public static determinateChangeComponent(element : HTMLElement) : ComponentModel {

    return InputFilesComponent.isInputFile(element as HTMLInputElement) || InputNumericComponent.isInputNumeric(element);
  }
}