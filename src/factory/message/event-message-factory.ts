import { RadioGroupComponent } from '../../components/konnect/radio-group-component';
import { CheckboxComponent } from '../../components/konnect/checkbox-component';
import { IframeComponent } from '../../components/konnect/iframe-component';
import { KmSwitchComponent } from '../../components/konnect/km-switch- component';
import { KSelectComponent } from '../../components/konnect/k-select-component';
import { InputNumericComponent } from '../../components/konnect/input-numeric-component';
import { InputFilesComponent } from '../../components/components/input-file-component';
import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import  componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { KListComponent } from '../../components/konnect/k-list-component';

/**
 * Factory qui permet de générer le message IMessage pour le code generator
 */
export class EventMessageFactory {

  // Créér un IMessage en fonction des paramètres donnés
  public static buildMessageEvent (component : IComponent, event : IMessage, filesUpload : FileList) : IMessage {
    switch (component.component) {

      // Si c'est un file drop zone component
      case componentName.FILE_DROPZONE :
        return FileDropZoneComponent.editFileDropZoneMessage(event, filesUpload);
      // Si c'est le bouton ajouter des fichiers
      case componentName.BUTTON_ADD_FILE_DROPZONE :
        return FileDropZoneComponent.editFileDropZoneButtonMessage(event);
      // Si c'est un input de fichier
      case componentName.INPUT_FILE :
        return InputFilesComponent.editInputFileMessage(event, (component.element as HTMLInputElement).files);
      // Si c'est un input numeric
      case componentName.INPUT_NUMERIC :
        return InputNumericComponent.editInputNumericMessage(event, component);
      // Si c'est un k select (les flêches à coté de l'input numeric)
      case componentName.K_SELECT :
        return KSelectComponent.editKSelectMessage(event);
      // Si c'est un switch
      case componentName.KM_SWITCH :
        return KmSwitchComponent.editKmSwitchMessage(event, component);
      // Si c'est une frame
      case componentName.IFRAME :
        return IframeComponent.editIframeMessage(event, component);
      // Si c'est une konnect liste
      case componentName.KLIST :
        return KListComponent.editKlistMessage(event, component);
      // Si c'est un checkbox
      case componentName.CHECKBOX :
        return CheckboxComponent.editCheckboxMessage(event);
      // Si c'est un radio group
      case componentName.RADIO_GROUP :
        return RadioGroupComponent.editRadioGroupMessage(event);
      default :
        return null;
    }
  }
}