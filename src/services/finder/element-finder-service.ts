/**
 * Service global permetant de trouver les éléments dans le dom
 */
export class ElementFinderService {

  /**
   * Trouver le parent avec son tagname
   */
  public static findParentElementWithTagName(
    element : HTMLElement,
    tagName : string,
    nbLevel : number
  ) : HTMLElement {

    let currentElement = element;

    for (let i = 0; i < nbLevel; i++) {

      if (currentElement && currentElement.tagName === tagName) {
        return currentElement;
      }
      if (currentElement && currentElement.parentElement) {
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
    attribute : string,
    nbLevel : number
  ) : HTMLElement {

    let currentElement = element;

    for (let i = 0; i < nbLevel; i++) {

      if (currentElement && currentElement.tagName === tagName && currentElement.getAttribute(attribute)) {
        return currentElement;
      }

      if (currentElement && currentElement.parentElement) {
        currentElement = currentElement.parentElement;
      }
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
    attributeValue : string,
    nbLevel : number
  ) : HTMLElement {

    let currentElement = element;

    for (let i = 0; i < nbLevel; i++) {


      if (currentElement &&
        currentElement.tagName === tagName
        && currentElement.getAttribute(attribute)
        && currentElement.getAttribute(attribute).includes(attributeValue)) {

        return currentElement;
      }

      if (currentElement && currentElement.parentElement) {
        currentElement = currentElement.parentElement;
      }
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
   * Permet de trouver un élément  à partir d'un selecteur et avec son attribut
   */
  public static findElementWithSelectorAndAttribute(
    selector : string,
    attribute : string,
    nbLevel : number
  ) : Element {

    let currentElement = document.querySelector(selector);

    for (let i = 0; i < nbLevel; i++) {

      if (currentElement && currentElement.getAttribute(attribute)) {
        return currentElement;
      }

      if (currentElement && currentElement.parentElement) {

        currentElement = currentElement.parentElement;
      }
    }

    return null;
  }

  /**
   * Permet de trouver un élément avec son selecteur
   */
  public static findElementChildWithSelector(element : HTMLElement, queryselector : string) : Element {

    return element.querySelector(queryselector);
  }
}