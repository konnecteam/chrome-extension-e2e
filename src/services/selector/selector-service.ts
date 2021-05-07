import { UtilityService } from '../utility/utility-service';
import finder from '@medv/finder';

/**
 * Service qui permet la gestion des sélecteurs
 */
export class SelectorService {

  /** Id à ignorer */
  private static readonly _ID_TO_IGNORE_REG  = new RegExp('([A-Za-z0-9]+-){4}', 'g');
  private static readonly _ID_TO_IGNORE = ['formv', 'kdp', 'mv', 'tabs'];

  /**
   * Récupère le selector d'un élément html
   */
  public static find(element : HTMLElement) : string {

    // Gestion de l'id
    if (element.id  && !this._ID_TO_IGNORE_REG.test(element.id)
    && !UtilityService.isStringStartInTab(element.id, this._ID_TO_IGNORE) ) {

      return '#' + element.id.split(':').join('\\:');
    } else {
      try {

        // Si présent dans le dom on le récupère
        return this._finderSelector(document, element);
      } catch (e) {

        // Dans le cas contraire on vérifie dans la sauvegarde du dom
        return this._findSelectorElementInSavedDocument(element);
      }
    }
  }

  /**
   * Récupération du selector d'un élément dans le dom sauvegardé
   */
  private static _findSelectorElementInSavedDocument(element : HTMLElement) : string {

    if (!element.tagName) return '';

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
      // On compare le contenu de chaque élément afin de trouver le bon
      if (elements[i].textContent === element.textContent) {
        element = elements[i];
      }
    }

    return this._finderSelector((window as any).saveBody, element);
  }

  /**
   * Récupère le sélecteur unique d'un élément html
   */
  private static _finderSelector(document : Document, element : HTMLElement) : string {
    return finder(
      element, {
        root : document.body,
        className: name => false, tagName: name => true ,
        idName: name => !UtilityService.isStringStartInTab(name, this._ID_TO_IGNORE)
         && !name.match(this._ID_TO_IGNORE_REG) && !this._ID_TO_IGNORE_REG.test(name),
        seedMinLength : 7,
        optimizedMinLength : 12,
        threshold : 1500,
        maxNumberOfTries : 15000
      } as any
    );
  }

  /**
   * Gestion des attributs spéciaux pour un élément
   */
  public static manageSpecialCase(attribute : string) : string {
    if (attribute === 'href.bind') {
      attribute = 'href';
    }
    return attribute;
  }

  /**
   * Permet de formater les données d'un sélecteur
   * Entré : element : un element qui a la propriété attribute passée en paramètre
   * et attribute : click.delegate
   * Sortie : [click\.delegate="modalGdprVM.close()"]
   */
  public static formatDataOfSelector(element : HTMLElement, attribute : string) : string {
    return `[${attribute.replace(/[.]/g, '\\\.')}="${element.getAttribute(attribute).replace(/[']/g, '\\\'')}"]`;
  }

  /**
   * Permet de standardiser un sélecteur
   * Entré : collapse-panel > div > div > div > div:nth-child(2) > div > input
   * Sortie : collapse-panel > div > div > div > div\:nth-child(2) > div > input
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