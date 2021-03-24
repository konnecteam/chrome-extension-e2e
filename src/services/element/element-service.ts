import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import { InputFilesComponent } from '../../components/components/input-file-component';
import { CheckboxComponent } from '../../components/konnect/checkbox-component';
import { IframeComponent } from '../../components/konnect/iframe-component';
import { InputNumericComponent } from '../../components/konnect/input-numeric-component';
import { KListComponent } from '../../components/konnect/k-list-component';
import { KSelectComponent } from '../../components/konnect/k-select-component';
import { KmSwitchComponent } from '../../components/konnect/km-switch- component';
import { RadioGroupComponent } from '../../components/konnect/radio-group-component';
import { IComponent } from '../../interfaces/i-component';
import elementsTagName from '../../constants/elements/tag-name';
import { SelectorService } from '../selector/selector-service';

/**
 * Service global permetant de trouver les éléments dans le dom
 */
export class ElementService {

  /** Attribut titre d'un HTMLELement */
  private static readonly _TITLE_ATTRIBUTE = 'title';

  /** Id d'un HTMLElement */
  private static readonly _ID_ATTRIBUTE = 'ID';

  /** Attribut Role d'un HTMLElement */
  private static readonly  _ROLE_ATTRIBUTE = 'role';

  /** Attribut class d'un HTMLElement */
  private static readonly _CLASS_ATTIBUTE = 'class';

  /** Valeur de l'id d'une konnect list */
  private static readonly _ID_ATTRIBUTE_LIST_VALUE = 'kdp';

  /** Valeur de l'attribut role d'une liste */
  private static readonly _ROLE_ATTRIBUTE_LIST_VALUE = 'listbox';

  /** Class d'un composant KSelect  */
  private static readonly _CLASS_ATTIBUTE_K_SELECT = 'k-select';

  /** Contenu de la class d'un KmSwitch handle */
  private static readonly _CLASS_ATTIBUTE_KMSWITCH_HANDLE = 'km-switch-handle';

  /** Contenu de class d'un KmSwitch */
  private static readonly _CLASS_ATTIBUTE_KMSWITCH = 'km-switch';

  /**  Contenu de class d'un KmSwitch conteneur */
  private static readonly _CLASS_ATTIBUTE_KMSWITCH_CONTAINER = 'km-switch-container';

  /**
   * Trouver le parent avec son tagname
   */
  public static findParentElementWithTagName(
    element : HTMLElement,
    tagName : string
  ) : HTMLElement {

    let currentElement = element;

    while (currentElement) {

      if (currentElement.tagName === tagName) {
        return currentElement;
      } else {
        currentElement = currentElement.parentElement;
      }

    }

    return null;
  }

  /**
   * Trouver un élément parent avec son tagName et son attribut
   */
  public static findParentElementWithTagNameAndAttribute(
    element : HTMLElement,
    tagName : string,
    attribute : string
  ) : HTMLElement {

    let currentElement = element;

    while (currentElement) {

      if (currentElement.tagName === tagName && currentElement.getAttribute(attribute)) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;

    }

    return null;
  }

  /**
   * Permet de trouver un élément parent à l'aide de son tagname,
   *  de son attribut et de la value de l'attribut
   */
  public static findParentElementWithTagNameAndValueAttribute(
    element : HTMLElement,
    tagName : string,
    attribute : string,
    attributeValue : string
  ) : HTMLElement {

    let currentElement = element;

    while (currentElement) {

      if (currentElement.tagName === tagName
        && currentElement.getAttribute(attribute)
        && currentElement.getAttribute(attribute).includes(attributeValue)) {

        return currentElement;
      }

      currentElement = currentElement.parentElement;

    }

    return null;
  }

  /**
   * Permet de trouver le fils d'un élément donné
   */
  public static findElementChildWithTagNameAndAttribute(
    element : HTMLElement,
    tagname : string,
    attrbbute : string
  ) : Element {

    const listOfElement = element.getElementsByTagName(tagname);

    for (let i = 0; i < listOfElement.length; i++) {

      const currentElement = listOfElement[i];

      if (currentElement.getAttribute(attrbbute)) {
        return currentElement;
      }
    }

    return null;
  }

  /**
   * Permet de trouver un élément à partir d'un selecteur et avec son attribut
   */
  public static findElementWithSelectorAndAttribute(
    selector : string,
    attribute : string
  ) : Element {

    let currentElement = document.querySelector(selector);

    while (currentElement) {

      if (currentElement.getAttribute(attribute)) {
        return currentElement;
      }

      currentElement = currentElement.parentElement;
    }

    return null;
  }

  /**
   * Permet de trouver un élément avec son selecteur
   */
  public static findElementChildWithSelector(element : HTMLElement, queryselector : string) : Element {

    return element.querySelector(queryselector);
  }

  /**
   * Verifie si c'est une iframe et la retourne
   */
  public static isInIframeElement(element : HTMLElement) : Element  {
    const selector = SelectorService.findSelectorIframeElement(element);
    if (selector) {

      return this.findElementChildWithSelector(document.body, selector);
    } else {
      return null;
    }
  }

  /**
   * Verifie si c'est un input numeric et retourne le bon event
   */
  public static getInputNumericElement(element : HTMLElement) : Element {

    return this.findElementChildWithTagNameAndAttribute(
      element.parentElement,
      elementsTagName.INPUT.toUpperCase(),
      this._TITLE_ATTRIBUTE
    );
  }

  /**
   * Verifie si c'est un numeric element et retourne l'element
   */
  public static isNumericElement(element : HTMLElement) : Element {

    return ElementService.findParentElementWithTagName(
      element,
      elementsTagName.NUMERIC.toUpperCase()
    );
  }

  /**
   * Trouve l'element liste si on a clické sur une liste
   * @param element
   */
  public static findListComponent(element : HTMLElement, listTagname : string) : Element {

    return ElementService.findParentElementWithTagName(
      element, listTagname.toUpperCase()
    );
  }

  /**
   * Vérifie si on a cliqué sur un item de la liste
   */
  public static isUlListElement(element : HTMLElement) : HTMLElement {

    return ElementService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.LIST_ELEMENT.toUpperCase(),
      this._ID_ATTRIBUTE,
      this._ID_ATTRIBUTE_LIST_VALUE
    );
  }

  /**
   * Vérifie si on a cliqué sur l'input d'une liste
   */
  public static isInputKList(element : HTMLElement) : Element {

    return ElementService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.INPUT.toUpperCase(),
      this._ROLE_ATTRIBUTE,
      this._ROLE_ATTRIBUTE_LIST_VALUE
    );
  }

  /**
   * Vérfiie si c'est un k select element
   */
  public static getKSelectElement(element : HTMLElement) : Element {

    return ElementService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.SPAN.toUpperCase(),
      this._CLASS_ATTIBUTE,
      this._CLASS_ATTIBUTE_K_SELECT
    );
  }

  /**
   * Verifie si l'élément est un km switch
   */
  public static getKmSwitchElement(element : HTMLElement) : Element {

    if (ElementService.findParentElementWithTagNameAndValueAttribute(
      element, elementsTagName.SPAN.toUpperCase(), this._CLASS_ATTIBUTE, this._CLASS_ATTIBUTE_KMSWITCH_HANDLE
    )) {

      return element;
    } else {
      return this.findKmSwitchElement(element);
    }
  }

  /**
   * Trouve le km switch si le click est tout proche de lui
   */
  public static findKmSwitchElement(element : HTMLElement) : Element {

    const parentElement = element.parentElement;
    if (ElementService.findParentElementWithTagNameAndValueAttribute(
      parentElement, elementsTagName.SPAN.toUpperCase(), this._CLASS_ATTIBUTE, this._CLASS_ATTIBUTE_KMSWITCH
    )) {

      const container = ElementService.findElementChildWithSelector(parentElement, `.${this._CLASS_ATTIBUTE_KMSWITCH_CONTAINER}`);
      if (container) {

        return ElementService.findElementChildWithSelector(container as HTMLElement, `.${this._CLASS_ATTIBUTE_KMSWITCH_HANDLE}`);
      }
    } else {
      return null;
    }
  }

  /**
   * Permet determiner sur quel élément est le change
   */
  public static determinateChangeComponent(element : HTMLElement) : IComponent {

    return InputFilesComponent.getInputFile(element as HTMLInputElement) || InputNumericComponent.getInputNumeric(element)
    || CheckboxComponent.getCheckboxComponent(element) || RadioGroupComponent.getRadioGroupComponent(element);
  }

  /**
   * Permet de déterminer sur quel composant on a cliqué
   */
  public static determinateClickComponent(element : HTMLElement, previousElement : { selector : string, typeList : string, element : Element}) : IComponent {

    return FileDropZoneComponent.getFileDropZone(element) ||
    KSelectComponent.getKSelect(element) || KmSwitchComponent.getKmSwitch(element) ||
    KListComponent.getKList(element, previousElement);
  }

  /**
   * Détermine sur quel composant il y a eu un drop
   */
  public static determinateDropComponent(element : HTMLElement) : IComponent {

    return FileDropZoneComponent.getFileDropZone(element);
  }


  /**
   * Détermine sur quel composant il y a eu un keydown
   */
  public static determinateKeydownComponent(element : HTMLElement) : IComponent {

    return IframeComponent.getIframe(element);
  }

}