import { EDomEvent } from '../../enum/events/events-dom';
import { SelectorService } from '../../services/selector/selector-service';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import { IMessage } from '../../interfaces/i-message';
import { EComponent } from '../../enum/component/component';

/**
 * Permet de gérer les text editor
 */
export class TextEditorComponent {


  private static readonly _CLASS_EDITOR_CONTENT = '.ql-editor';

  /**
   * Récupère le IComponent text editor
   */
  public static getElement(element : HTMLElement) : IComponent {

    const elementTextEditor = ElementService.getTextEditor(element);

    // Si on est dans un text editor
    if (elementTextEditor) {

      const editorContent : HTMLElement = ElementService.findElementChildWithSelector(elementTextEditor, this._CLASS_EDITOR_CONTENT) as HTMLElement;

      // Si on a un text editor content
      if (editorContent) {
        return { component : EComponent.TEXT_EDITOR, element: editorContent };
      } else {
        return null;
      }
    } else {

      return null;
    }
  }

  /**
   * Modifie l'event pour un text editor
   */
  public static editTextEditorComponentMessage(event : IMessage, component : IComponent) : IMessage {

    // On récupèrer le text editor car on en a besoin lorsque l'on va rejouer le scénario
    const elementTextEditor = ElementService.getTextEditor(component.element);

    event.selector = elementTextEditor ? SelectorService.Instance.find(elementTextEditor) : '';
    event.typeEvent = EDomEvent.KEYDOWN;
    // On récupère le contenu du text editor content
    event.value = component.element.innerHTML;
    event.action =  EDomEvent.KEYDOWN;

    return event;
  }
}
