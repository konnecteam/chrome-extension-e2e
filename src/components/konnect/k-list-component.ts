import { SelectorService } from './../../services/selector/selector-service';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';

// Constant
import CUSTOM_EVENT from '../../constants/events/events-custom';
import COMPONENT from '../../constants/component-name';
import TAG_NAME from '../../constants/elements/tag-name';

/**
 * Composant qui permet de gérer les konnect list
 */
export class KListComponent {

  /** Types de liste */
  private static readonly _DROPDOWN = 'Dropdown';

  private static readonly _MULTISELECT = 'Multiselect';

  private static readonly _selectorService = SelectorService.Instance;

  /**
   * Récupère un IComponent konnect list
   */
  public static getElement(
    element : HTMLElement,
    kListElement : { selector : string; typeList : string; element : Element; }
  ) : IComponent {

    // On récupère l'élement correspondant à la liste
    const dropdownElement : Element = ElementService.findListComponent(element, TAG_NAME.KONNECT_DROPDOWNLIST);
    const multiselectListElement : Element = ElementService.findListComponent(element, TAG_NAME.KONNECT_MULTISELECT);

    // si c'est une dropdown
    if (dropdownElement) {

      return this._getKListComponent(
        dropdownElement as HTMLElement,
        {
          selector : this._selectorService.find(dropdownElement as HTMLElement),
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
          selector : this._selectorService.find(multiselectListElement as HTMLElement),
          element : multiselectListElement,
          typeList: this._MULTISELECT
        }
      );
    }

    // Si on a déjà cliqué sur une liste alors on peut acceder aux éléments qu'elle contient
    if (kListElement && (kListElement.typeList === this._DROPDOWN || kListElement.typeList === this._MULTISELECT)) {

      // On vérifie si c'est un input
      const input = ElementService.getInputKList(element);

      if (input) {
        return this._getKListComponent(input as HTMLElement, kListElement);
      }
      // On vérifie si c'est un element ul
      const listUL = ElementService.getUlListElement(element);
      if (listUL) {
        return this._getKListComponent(listUL, kListElement);
      }
    }
  }

  /*
   * Retourne un Klist component
   * @param element
   * @param previousElement
   */
  private static _getKListComponent(element : HTMLElement, kListElement : { selector : string, element : Element, typeList : string }) : IComponent {
    return {
      component : COMPONENT.KLIST,
      element,
      kListElement
    };
  }

  /**
   * On modifie l'event model en fonction de l'action voulue
   */
  public static editKlistComponentMessage(event : IMessage, component : IComponent) : IMessage {

    // Si click list item
    if (ElementService.getUlListElement(component.element)) {

      event.action = CUSTOM_EVENT.CLICK_LIST_ITEM;
      event.scrollElement = this._selectorService.find(component.element);
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
    if (ElementService.getInputKList(component.element) || component.kListElement.typeList === this._MULTISELECT) {
      event.action = CUSTOM_EVENT.CLICK_MOUSE;
      return event;
    }

    return event;
  }

}