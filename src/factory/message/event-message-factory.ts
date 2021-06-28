import { KimoceDocumentsComponent } from '../../components/components/kimoce-documents-component';
import { PopoverComponent } from './../../components/konnect/popover-component';
import { RadioGroupComponent } from '../../components/konnect/radio-group-component';
import { CheckboxComponent } from '../../components/konnect/checkbox-component';
import { IframeComponent } from '../../components/konnect/iframe-component';
import { KmSwitchComponent } from '../../components/konnect/km-switch- component';
import { KSelectComponent } from '../../components/konnect/k-select-component';
import { InputNumericComponent } from '../../components/konnect/input-numeric-component';
import { InputFilesComponent } from '../../components/components/input-file-component';
import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { InputListComponent } from '../../components/konnect/input-list-component';

// Constant
import  COMPONENT from '../../constants/component-name';

/**
 * Factory qui permet de générer le message IMessage pour le code generator
 */
export class EventMessageFactory {

  /** Construit un message event */
  public static buildMessageEvent(component : IComponent, event : IMessage, filesUpload : FileList) : IMessage {

    switch (component.component) {
      // Si c'est un file drop zone component
      case COMPONENT.FILE_DROPZONE :
        return FileDropZoneComponent.editFileDropZoneComponentMessage(event, filesUpload);
      // Si c'est le bouton ajouter des fichiers
      case COMPONENT.KIMOCE_DOCUMENTS_ADD_BUTTON :
        return KimoceDocumentsComponent.editKimoceDocumentsComponentMessage(event, component);
      // Si c'est un input de fichier
      case COMPONENT.INPUT_FILE :
        return InputFilesComponent.editInputFileComponentMessage(event, (component.element as HTMLInputElement).files);
      // Si c'est un input numeric
      case COMPONENT.INPUT_NUMERIC :
        return InputNumericComponent.editInputNumericComponentMessage(event, component);
      // Si c'est un k select (les flêches à coté de l'input numeric)
      case COMPONENT.K_SELECT :
        return KSelectComponent.editKSelectComponentMessage(event);
      // Si c'est un switch
      case COMPONENT.KM_SWITCH :
        return KmSwitchComponent.editKmSwitchComponentMessage(event, component);
      // Si c'est une frame
      case COMPONENT.IFRAME :
        return IframeComponent.editIframeComponentMessage(event, component);
      // Si c'est un input list
      case COMPONENT.INPUT_LIST :
        return InputListComponent.editInputListComponentMessage(event, component);
      // Si c'est un checkbox
      case COMPONENT.CHECKBOX :
        return CheckboxComponent.editCheckboxComponentMessage(event);
      // Si c'est un radio group
      case COMPONENT.RADIO_GROUP :
        return RadioGroupComponent.editRadioGroupComponentMessage(event);
      case COMPONENT.POPOVER :
        return PopoverComponent.editPopoverComponentMessage(event);
      default :
        return null;
    }
  }
}