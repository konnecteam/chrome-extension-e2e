import componentName from '../../constants/component-name';
import { ComponentModel } from '../../models/component-model';
import { EventModel } from '../../models/event-model';
import { SelectorService } from '../../services/selector/selector-service';
import elementsTagName from '../../constants/elements-tagName';
import { ElementFinderService } from '../../services/finder/element-finder-service';
import actionEvents from '../../constants/action-events';

/**
 * Composant qui permet de gérer les k list à choix simple et les k list à choix multiples
 */
export class KListComponent {


  /** Attribut Role d'un HTMLElement */
  private static readonly  _ROLE = 'role';

  /** Valeur d'un attribut role */
  private static readonly _ROLE_VALUE = 'listbox';

  /** Id d'un HTMLElement */
  private static readonly _ID = 'ID';

  /** Valeur de l'id */
  private static readonly _ID_LIST_VALUE = 'kdp';

  /** Aria-describedy d'un HTMLElement */
  private static readonly _ARIA_DESCRIBEDY = 'aria-describedby';

  /** Aria-owns d'un HTMLElement */
  private static readonly _ARIA_OWNS = 'aria-owns';

  /** Attribut item index d'un HTMLELement */
  private static readonly  _ITEM_INDEX = 'data-offset-index';


  /**
   * Verifie si c'est une KList
   */
  public static isKlist(
    elementSelector : string,
    element : HTMLElement,
    previousSelector : string,
    previousElement : { selector : string; typeList : string; element : Element; }
  ) : ComponentModel {


    //On vérifie si on est dans une k list
    const listUL = this._isInUlElement(element);

    if (previousSelector && listUL) {
      //Si on a cliqué ou écrit dans la simple k list
      let previousEl = this._findKListAriaOwns(previousSelector);
      let isMulti = false;

      if (!previousEl) {
        // On verifie si on est dans le input de la k list
        const el = this._findKListAriaDescribedby(previousSelector);

        // On verifie si avant on a click sur un k list element
        previousEl = el ? el : this._isClickInputKList(previousElement.element as HTMLElement);
        isMulti = true;
      }

      // Si on a un element précédant
      if (previousEl) {
        // Si on a l'attribut aria own on est sur une k list simple
        if (previousEl.getAttribute(this._ARIA_OWNS)) {
          previousElement.typeList = 'simple-list';
        }

        // Si on valide ces conditions on est sur un multiple K list
        if (previousEl.getAttribute(this._ARIA_DESCRIBEDY) ||
          previousEl.getAttribute(this._ROLE) && isMulti) {

          previousElement.typeList = 'multiple-list';
        }

        // On update le previousElement;
        previousElement.selector = SelectorService.find(previousEl as HTMLElement);
        previousElement.element = previousEl;

        previousSelector = SelectorService.find(previousEl as HTMLElement);
      }

      return { component: componentName.KLIST, element, previousSelector, previousElement};
    } else if (this._isClickInputKList(element)) {
      // Sinon on vérifie su c'est un input dans une k list
      previousElement.selector = elementSelector;
      previousElement.element = element;
      return { component: componentName.KLIST, element, previousSelector, previousElement};
    }

    return null;
  }

  /**
   * Permet de trouver l'index de l'élément sur lequel on a cliqué
   */
  private static _findListCustomElementIndex(element : HTMLElement) : string {

    const elementFind = ElementFinderService.findParentElementWithTagNameAndAttribute(
      element,
      elementsTagName.ITEM.toLocaleUpperCase(),
      this._ITEM_INDEX,
      15
    );
    return elementFind.getAttribute(this._ITEM_INDEX);
  }

  /**
   * Trouve l'élément k list simple avec l'attribut aria-owns
   */
  private static _findKListAriaOwns(previousSelector : string) : Element {

    return ElementFinderService.findElementWithSelectorAndAttribute(
      previousSelector,
      this._ARIA_OWNS,
      4
    );
  }

  /**
   * Trouve le multiple klist avec l'attribut aria-sescribery
   */
  private static _findKListAriaDescribedby(previousSelector) : Element {

    return ElementFinderService.findElementWithSelectorAndAttribute(
      previousSelector,
      this._ARIA_DESCRIBEDY,
      4
    );
  }

  /**
   * Vérifie si on a cilqué sur un item de la k list
   */
  private static _isInUlElement(element : HTMLElement) : HTMLElement {

    return ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.LIST_ELEMENT.toLocaleUpperCase(),
      this._ID,
      this._ID_LIST_VALUE,
      15
    );
  }

  /**
   * Vérifie si on a cliqué sur l'input d'une k list
   */
  private static _isClickInputKList(element : HTMLElement) : Element {

    return ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element,
      element.tagName,
      this._ROLE,
      this._ROLE_VALUE,
      2
    );
  }

  /**
   * Editer le message des k lists en fonction du type de liste
   */
  public static editKListMessage(event : EventModel, component : ComponentModel) : EventModel {
    // we edit messsage
    const listUL = this._isInUlElement(component.element);

    if (component.previousElement.typeList === 'simple-list') {

      // On cherche l'index de l'item
      const indexItem = this._findListCustomElementIndex(component.element);

      if (indexItem) {

        event.action = actionEvents.CLICK_SIMPLELIST;
        event.listItemIndex = indexItem;
        event.sourceSelector = component.previousElement.selector;
      }

    } else if (component.previousElement.typeList === 'multiple-list') {

      /* Si c'est un multiple k list on cherche le niveau descroll de la liste
         pour la selection du bon item
      */
      event.action = actionEvents.CLICK_MULTIPLELIST;
      event.scrollElement = SelectorService.find(listUL.parentElement);
      event.scrollXElement = listUL.parentElement.scrollLeft;
      event.scrollYElement = listUL.parentElement.scrollTop;
    } else if (this._isClickInputKList(component.element)) {
      event.action = actionEvents.CLICKMOUSE;
    }

    return event;
  }
}