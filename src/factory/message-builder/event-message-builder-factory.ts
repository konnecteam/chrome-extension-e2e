import { InputCalendarComponent } from '../../components/components/input-calendar-component';
import { KListComponent } from '../../components/components/k-list-component';
import { IframeComponent } from '../../components/components/iframe-component';
import { KmSwitchComponent } from '../../components/components/km-switch- component';
import { KSelectComponent } from '../../components/components/k-select-component';
import { InputNumericComponent } from '../../components/components/input-numeric-component';
import { InputFilesComponent } from '../../components/components/input-file-component';
import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import  componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import { ComponentModel } from '../../models/component-model';

/**
 * Factory qui permet de générer le message EventModel pour le code generator
 */
export class EventMessageBuilderFactory {

  // Créér un EventModel en fonction des paramètre donné
  public static buildMessageEvent (component : ComponentModel, event : EventModel, filesUpload : FileList) : EventModel {
    let newMessage : EventModel;
    switch (component.component) {

      // Si c'est un file drop zone component
      case componentName.FILEDROPZONE :
        newMessage = FileDropZoneComponent.editFileDropZoneMessage(event, filesUpload);
        break;
      // Si c'est le bouton ajouter des fichiers
      case componentName.FILEDROPZONEADD :
        newMessage = FileDropZoneComponent.editFileDropZoneButtonMessage(event);
        break;
      // Si c'est un input de fichier
      case componentName.INPUTFILE :
        newMessage = InputFilesComponent.editInputFileMessage(event, (component.element as HTMLInputElement).files);
        break;
      // Si c'est un input nmeric
      case componentName.INPUTNUMERIC :
        newMessage = InputNumericComponent.editInputNumericMessage(event, component);
        break;
      // Si c'est un k select (les flêches à coté de l'input numeric)
      case componentName.KSELECT :
        newMessage = KSelectComponent.editKSelectMessage(event);
        break;
      // Si c'est un switch
      case componentName.KMSWITCH :
        newMessage = KmSwitchComponent.editKmSwitchMessage(event, component);
        break;
      // Si c'est une frame
      case componentName.IFRAME :
        newMessage = IframeComponent.editIframeMessage(event, component);
        break;
      // Si c'est un k list
      case componentName.KLIST :
        newMessage = KListComponent.editKListMessage(event, component);
        break;
      // Si c'est un input calendar
      case componentName.DATECALENDAR :
        newMessage = InputCalendarComponent.editDateMessage(event, component);
        break;
    }
    return newMessage;

  }
}