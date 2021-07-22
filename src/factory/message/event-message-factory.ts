import { TagsListComponent } from '../../components/konnect/tags-list-component';
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
import { EComponentName } from '../../enum/component/component-name';

/**
 * Factory qui permet de générer le message IMessage pour le code generator
 */
export class EventMessageFactory {

  /** Construit un message event */
  public static buildMessageEvent(component : IComponent, event : IMessage, filesUpload : FileList) : IMessage {

    switch (component.component) {
      // Si c'est un file drop zone component
      case EComponentName.FILE_DROPZONE :
        return FileDropZoneComponent.editFileDropZoneComponentMessage(event, filesUpload);
      // Si c'est un input de fichier
      case EComponentName.INPUT_FILE :
        return InputFilesComponent.editInputFileComponentMessage(event, (component.element as HTMLInputElement).files);
      // Si c'est un input numeric
      case EComponentName.INPUT_NUMERIC :
        return InputNumericComponent.editInputNumericComponentMessage(event, component);
      // Si c'est un k select (les flêches à coté de l'input numeric)
      case EComponentName.K_SELECT :
        return KSelectComponent.editKSelectComponentMessage(event);
      // Si c'est un switch
      case EComponentName.KM_SWITCH :
        return KmSwitchComponent.editKmSwitchComponentMessage(event, component);
      // Si c'est une frame
      case EComponentName.IFRAME :
        return IframeComponent.editIframeComponentMessage(event, component);
      // Si c'est un input list
      case EComponentName.INPUT_LIST :
        return InputListComponent.editInputListComponentMessage(event);
      // Si c'est un checkbox
      case EComponentName.CHECKBOX :
        return CheckboxComponent.editCheckboxComponentMessage(event);
      // Si c'est un radio group
      case EComponentName.RADIO_GROUP :
        return RadioGroupComponent.editRadioGroupComponentMessage(event);
      // Si c'est un popover
      case EComponentName.POPOVER :
        return PopoverComponent.editPopoverComponentMessage(event);
      // Si c'est un tags list
      case EComponentName.TAGS_LIST :
        return TagsListComponent.editTagsListComponentMessage(event, component);
      default :
        return null;
    }
  }
}