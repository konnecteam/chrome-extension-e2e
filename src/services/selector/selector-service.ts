import { ObjectComparatorService } from './../object-comparator/object-comparator-service';
import finder from '@medv/finder';

/**
 * Service qui permet la gestion des sélecteurs
 */
export class SelectorService {

  /** Id à ignorer */
  private static readonly _idToIgnoreReg  = new RegExp('([A-Za-z0-9]+-){4}', 'g');
  private static readonly _idToIgnore = ['formv', 'kdp', 'mv'];

  /**
   * Récupère un élément html
   */
  public static find(element : HTMLElement) : string {

    // Gestion de l'id
    if (element.id  && !this._idToIgnoreReg.test(element.id)
    && !ObjectComparatorService.isStringStartInTab(element.id, this._idToIgnore) ) {

      return '#' + element.id.split(':').join('\\:');
    }

    try {

      // Si présent dans le dom on le récupère
      return this._finder(document, element);
    } catch (e) {

      // Dans le cas contraire on vérifie dans la sauvegarde du dom
      return this._findElementInSavedDocument(element);
    }
  }

  /**
   * Récupération d'un élément dans le dom sauvegardé
   */
  private static _findElementInSavedDocument(element : HTMLElement) : string {

    // Récupération du tagName
    let selector = element.tagName.toLowerCase();

    // On parcour las liste des attributs et on construit le sélecteur à la main
    for (let i = 0; i < element.attributes.length; i++) {
      const currentAttribute = element.attributes[i];
      if (currentAttribute.value) {
        // Construction du selecteur
        selector += `[${currentAttribute.name.replace('.', '\\\.')}="${currentAttribute.value}"]`;
      }
    }

    // A partir du selecteur on récupère la liste des éléments
    const elements = (window as any).saveBody.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
      // On compare le contenu de chaque élément afin de trouvé le bon
      if (elements[i].textContent === element.textContent) {
        element = elements[i];
      }
    }

    return this._finder((window as any).saveBody, element);
  }

  /**
   * Récupère le sélecteur unique d'un élément html
   */
  private static _finder(document : Document, element : HTMLElement) : string {
    return finder(
      element, {
        root : document.body,
        className: name => false, tagName: name => true ,
        idName: name => !ObjectComparatorService.isStringStartInTab(name, this._idToIgnore)
         && !name.match(this._idToIgnoreReg) && !this._idToIgnoreReg.test(name),
        seedMinLength : 7,
        optimizedMinLength : 12,
        threshold : 1500,
        maxNumberOfTries : 15000
      } as any
    );
  }

  /**
   * Gestion des attribut spéciale pour un élément
   */
  public static manageSpecialCase(attribute : string) : string {
    if (attribute === 'href.bind') {
      attribute = 'href';
    }
    return attribute;
  }

  /**
   * Permet de formatter les données d'un sélecteur
   */
  public static formatDataOfSelector(element : HTMLElement, attribute : string) : string {
    return `[${attribute.replace(/[.]/g, '\\\.')}="${element.getAttribute(attribute).replace(/[']/g, '\\\'')}"]`;
  }

  /**
   * Permet de standardisé un sélecteur
   */
  public static standardizeSelector(selector : string) : string {
    return selector.replace(/\\\./g, '\\\\.').replace('\n', '\\"').split('\:').join('\\\:');
  }

  /**
   * Permet de trouver le selecteur d'une iframe si l'élément donné s'y trouve
   */
  public static findSelectorIframeElement(element : HTMLElement) : string {

    if (element.ownerDocument.defaultView.location !== window.location) {

      for (let i = 0; i < document.querySelectorAll('iframe').length; i++) {

        const iframe = document.querySelectorAll('iframe')[i];
        if (iframe.contentDocument.contains(element)) {

          return this.find(iframe);
        }
      }
    }

    return '';
  }
}