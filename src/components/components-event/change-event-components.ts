import { RadioGroupComponent } from './../konnect/radio-group-component';
import { CheckboxComponent } from '../konnect/checkbox-component';
import { InputFilesComponent } from './../components/input-file-component';
import { InputNumericComponent } from '../konnect/input-numeric-component';
import { IComponentModel } from '../../models/i-component-model';
/**
 * EventComponents qui permet de gérer les event de change
 */
export class ChangeEventComponents {

  /**
   * Permet determiner sur quel élément est le change
   */
  public static determinateChangeComponent(element : HTMLElement) : IComponentModel {

    return InputFilesComponent.isInputFile(element as HTMLInputElement) || InputNumericComponent.isInputNumeric(element)
    || CheckboxComponent.isCheckboxComponent(element) || RadioGroupComponent.isRadioGroupComponent(element);
  }
}