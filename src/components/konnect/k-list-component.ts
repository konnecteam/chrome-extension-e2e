import { SelectorService } from './../../services/selector/selector-service';
import { IMessage } from '../../interfaces/i-message';
import componentName from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import elementsTagName from '../../constants/elements/tag-name';
import { ElementService } from '../../services/element/element-service';
import customEvents from '../../constants/events/events-custom';

/**
 * Composant qui permet de gérer les konnect list
 */
export class KListComponent {

  /** Types de liste */
  private static readonly _DROPDOWN = 'Dropdown';

  private static readonly _MULTISELECT = 'Multiselect';

  /**
   * Récupère un component konnect list
   * @param element
   * @param previousElement
   */
  public static getKList(
    element : HTMLElement,
    previousElement : { selector : string; typeList : string; element : Element; }
    ) : IComponent {

    // On récupère l'élement correspondant à la liste
    const dropdownElement : Element = ElementService.findListComponent(element, elementsTagName.KONNECT_DROPDOWNLIST);
    const multiselectListElement : Element = ElementService.findListComponent(element, elementsTagName.KONNECT_MULTISELECT);

    // si c'est une dropdown
    if (dropdownElement) {

      return this._getKListComponent(
        dropdownElement as HTMLElement,
        {
          selector : SelectorService.find(dropdownElement as HTMLElement),
          element : dropdownElement,
          typeList: this._DROPDOWN
        }
      );
    }

    // si c'est une mulitple
    if (multiselectListElement) {

      return this._getKListComponent(
        multiselectListElement as HTMLElement,
        {
          selector : SelectorService.find(multiselectListElement as HTMLElement),
          element : multiselectListElement,
          typeList: this._MULTISELECT
        }
      );
    }

    // Si on a déjà cliqué sur une liste alors on peut acceder aux éléments qu'elle contient
    if (previousElement && (previousElement.typeList === this._DROPDOWN || previousElement.typeList === this._MULTISELECT)) {
      // On vérifie si c'est un input
      const input = ElementService.isInputKList(element);

      if (input) {
        return this._getKListComponent(input as HTMLElement, previousElement);
      }
      // On vérifie si c'est un element ul
      const listUL = ElementService.isUlListElement(element);
      if (listUL) {
        return this._getKListComponent(listUL, previousElement);
      }
    }
  }

  /*
   * Retourne un Klist component
   * @param element
   * @param previousElement
   */
  private static _getKListComponent(element : HTMLElement, previousElement : {selector : string, element : Element, typeList : string }) : IComponent {
    return {
      component : componentName.KLIST,
      element,
      previousElement
    };
  }

  /**
   * On modifie l'event model en fonction de l'action voulue
   * @param event
   * @param component
   */
  public static editKlistMessage(event : IMessage, component : IComponent) : IMessage {

    // Si click list item
    if (ElementService.isUlListElement(component.element)) {

      event.action = customEvents.CLICK_LIST_ITEM;
      event.scrollElement = SelectorService.find(component.element);
      event.scrollXElement = component.element.parentElement.scrollLeft;
      event.scrollYElement = component.element.parentElement.scrollTop;
      return event;
    }

    /* Si input click
     * OU
     * Si ce n'est pas un click input et un click list item
     * alors on vérifie si c'est une multiselect car
     * pour l'ouvir il faut faire un click mouse
    */
    if (ElementService.isInputKList(component.element) || component.previousElement.typeList === this._MULTISELECT) {
      event.action = customEvents.CLICK_MOUSE;
      return event;
    }

    return event;
  }

}