import { SelectorService } from './../../services/selector/selector-service';
import { EventModel } from './../../models/event-model';
import componentName from '../../constants/component-name';
import { ComponentModel } from '../../models/component-model';
import elementsTagName from '../../constants/elements-tagName';
import { ElementFinderService } from '../../services/finder/element-finder-service';
import actionEvents from '../../constants/action-events';

/**
 * Composant qui permet de gérer les konnect list
 */
export class KListComponent {

  /** TagName des lists */
  private static readonly  _DROPDOWN_LIST_TAGNAME = 'konnect-dropdownlist';
  private static readonly _MULTIPLE_LIST_TAGNAME = 'konnect-multiselect';

  /** Attribut Role d'un HTMLElement */
  private static readonly  _ROLE = 'role';

  /** Valeur de l'attribut role */
  private static readonly _ROLE_VALUE = 'listbox';

  /** Id d'un HTMLElement */
  private static readonly _ID = 'ID';

  /** Valeur de l'id */
  private static readonly _ID_LIST_VALUE = 'kdp';

  /** Types de liste */
  private static readonly _DROPDOWN = 'Dropdown';

  private static readonly _MULTIPLESELECT = 'Multiselect';

  /**
   * Verifie si c'est une konnect list
   * @param element
   * @param previousElement
   */
  public static isKList(
    element : HTMLElement,
    previousElement : { selector : string; typeList : string; element : Element; }
    ) : ComponentModel {

    // On récupère l'élement correspondant à la liste
    const dropdownElement : Element = this._findListComponent(element, this._DROPDOWN_LIST_TAGNAME);
    const multipleListElement : Element = this._findListComponent(element, this._MULTIPLE_LIST_TAGNAME );

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
    if (multipleListElement) {

      return this._getKListComponent(
        multipleListElement as HTMLElement,
        {
          selector : SelectorService.find(multipleListElement as HTMLElement),
          element : multipleListElement,
          typeList: this._MULTIPLESELECT
        }
      );
    }

    // Si on a déjà cliqué sur une liste alors on peut acceder aux éléments qu'elle contient
    if (previousElement && (previousElement.typeList === this._DROPDOWN || previousElement.typeList === this._MULTIPLESELECT)) {
      // On vérifie si c'est un input
      const input = this._isClickInputKList(element);

      if (input) {
        return this._getKListComponent(input as HTMLElement, previousElement);
      }
      // On vérifie si c'est un element ul
      const listUL = this._isInUlElement(element);
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
  private static _getKListComponent(element : HTMLElement, previousElement : {selector : string, element : Element, typeList : string }) : ComponentModel {
    return {
      component : componentName.KLIST,
      element,
      previousElement
    };
  }

  /**
   * Trouve l'element liste si on a clické sur une liste
   * @param element
   */
  private static _findListComponent(element : HTMLElement, listTagname : string) : Element {

    return ElementFinderService.findParentElementWithTagName(
      element, listTagname.toUpperCase(), 8
    );
  }

  /**
   * Vérifie si on a cliqué sur un item de la liste
   */
  private static _isInUlElement(element : HTMLElement) : HTMLElement {

    return ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.LIST_ELEMENT.toUpperCase(),
      this._ID,
      this._ID_LIST_VALUE,
      15
    );
  }

  /**
   * Vérifie si on a cliqué sur l'input d'une liste
   */
  private static _isClickInputKList(element : HTMLElement) : Element {

    return ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.INPUT.toUpperCase(),
      this._ROLE,
      this._ROLE_VALUE,
      2
    );
  }

  /**
   * On modifie l'event model en fonction de l'action voulue
   * @param event
   * @param component
   */
  public static editKlistMessage(event : EventModel, component : ComponentModel) : EventModel {

    // Si click list item
    if (this._isInUlElement(component.element)) {

      event.action = actionEvents.CLICK_ITEMLIST;
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
    if (this._isClickInputKList(component.element) || component.previousElement.typeList === 'Multiselect') {
      event.action = actionEvents.CLICKMOUSE;
      return event;
    }

    return event;
  }

}