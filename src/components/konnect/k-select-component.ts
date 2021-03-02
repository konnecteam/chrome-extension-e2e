import elementsTagName  from '../../constants/elements-tagName';
import { ComponentModel } from '../../models/component-model';
import { ElementFinderService } from '../../services/finder/element-finder-service';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
import componentName from '../../constants/component-name';


/**
 * Composant qui permet la gestion des K select
 */
export class KSelectComponent {

  /** Class d'un composant KSelect  */
  private static readonly _K_SELECT_CLASSNAME = 'k-select';

  /** Attribut class d'un HTMLElement */
  private static readonly _CLASS = 'class';

  /**
   * Verifie si l'element est un k select et retourne le composant associé
   */
  public static isKSelect(element : HTMLElement) : ComponentModel {

    // Si c'est un k select qui se situe dans input numeric
    if (this._isNumericElement(element) && this._isKSelectElement(element)) {
      return { component: componentName.KSELECT, element };
    }

    return null;
  }

  /**
   * Vérfiie si c'est un k select element
   */
  private static _isKSelectElement(element) : Element {

    return ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element, elementsTagName.SPAN.toUpperCase(), this._CLASS, this._K_SELECT_CLASSNAME, 5
    );
  }

  /**
   * Verifie si il est dans un numeric element
   */
  private static _isNumericElement(element) : Element {

    return ElementFinderService.findParentElementWithTagName(element, elementsTagName.NUMERIC.toUpperCase(), 8);
  }

  /**
   * Edit le message pour les k select
   */
  public static editKSelectMessage(event : EventModel) : EventModel {
    event.action = actionEvents.CLICKMOUSE_INPUTNUMERIC;
    return event;
  }
}