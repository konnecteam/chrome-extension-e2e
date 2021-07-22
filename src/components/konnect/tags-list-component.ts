import { ECustomEvent } from './../../enum/events/events-custom';
import { SelectorService } from '../../services/selector/selector-service';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import { IMessage } from '../../interfaces/i-message';
import { EComponentName } from '../../enum/component/component-name';

/**
 * Permet de gérer les tags list
 */
export class TagsListComponent {

  /**
   * Récupère le IComponent tagsList
   */
  public static getElement(element : HTMLElement) : IComponent {

    const tagsListElement = ElementService.getTagsList(element);

    // Si on est dans un tags list
    if (tagsListElement) {

      return { component : EComponentName.TAGS_LIST, element : tagsListElement };
    } else {

      return null;
    }
  }

  /**
   * Modifie l'event pour un tags list
   */
  public static editTagsListComponentMessage(event : IMessage, component : IComponent) : IMessage {

    // On a besoin du Taglist element pour le scénario
    event.selector = SelectorService.Instance.find(component.element);
    event.tagName = component.element.tagName;

    event.action =  ECustomEvent.CHANGE_TAGS_LIST;

    return event;
  }
}