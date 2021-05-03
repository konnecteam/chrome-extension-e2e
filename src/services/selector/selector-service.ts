import { ObjectService } from '../object/object-service';
import finder from '@medv/finder';
import { StorageService } from '../../services/storage/storage-service';

/**
 * Service qui permet la gestion des sélecteurs
 */
export class SelectorService {

  /** Id à ignorer */
  private static readonly _ID_TO_IGNORE_REG  = new RegExp('([A-Za-z0-9]+-){4}', 'g');
  private static readonly _ID_TO_IGNORE = ['formv', 'kdp', 'mv', 'tabs'];

  private _dataAttributes : any[] | string[];
  private _useRegex : boolean;

  private static _instance : SelectorService;

  constructor() {
    this._dataAttributes = null;
    this._useRegex = false;
    this._getOption();
  }

  /**
   * Récupère les options du plugin pour savoir si il faut utiliser des
   * custom selectors
   */
  private async _getOption() : Promise<void> {
    const opt = await StorageService.getDataAsync(['options']);
    if (opt) {
      this._useRegex = opt.options.code.useRegexForDataAttribute;

      this._dataAttributes = opt.options.code.dataAttribute.split(' ').filter(f => f !== '').map(f => {
        if (this._useRegex) {
          return new RegExp(f);
        } else {
          return f;
        }
      });
    }
  }

  /**
   * Cherche les custom attributs d'un element pour les utiliser en tant que selecteur
   * @param element
   * @returns
   */
  private _getCustomAttributes(element : HTMLElement) : string[] {
    const listCustomAttribute = [];

    // Gestion des cutom attributes
    if (this._dataAttributes && this._dataAttributes.length && element.hasAttribute) {

      // On recherche les custom attributes
      const targetAttributes = element.attributes;

      for (const patternAttr of this._dataAttributes) {

        const regexp = RegExp(patternAttr);

        // On test chaque attribute avec le pattern
        for (let i = 0; i < targetAttributes.length; i++) {
          // Regex ou string test
          if (this._useRegex ? regexp.test(targetAttributes[i].name) : patternAttr === targetAttributes[i].name) {

            // La recherche est terminée
            // On traite les cas spéciaux des customs attributes
            listCustomAttribute.push(this.manageSpecialCase(targetAttributes[i].name));
          }
        }
      }
    }

    return listCustomAttribute;
  }

  /**
   * Récupération de l'instance de la classe
   */
  public static get Instance() : SelectorService {
    if (SelectorService._instance == null) {
      SelectorService._instance = new SelectorService();
    } else {
      // on met à jour les options car elles peuvent avoir changées
      SelectorService._instance._getOption();
    }
    return SelectorService._instance;
  }

  /**
   * Récupère le selector d'un élément html
   */
  public find(element : HTMLElement) : string {
    // On récupère les custom attributs d'un élément si il y en a
    const customAttributes : string[] = this._getCustomAttributes(element);

    // On verifie si on peut utiliser ses custom attribut pour faire le selecteur
    if (this._dataAttributes && this._useRegex && customAttributes.length > 0) {
      const customSelector = this._findCustomSelector(element, customAttributes);

      // Si on trouve plus d'un element avec le customSelector alors on utilise le standard
      if (document.querySelectorAll(customSelector).length > 1) {

        return this._findStandardSelector(element);
      } else {

        return customSelector;
      }
    } else {

      return this._findStandardSelector(element);
    }
  }

  /**
   * Trouve le custom selecteur d'un element
   * @param element
   * @param customAttributes
   * @returns
   */
  private _findCustomSelector(element : HTMLElement, customAttributes : string[]) : string {
    let selector = '';
    for (const customAttribute of customAttributes) {
      selector += this._formatDataOfSelector(element, customAttribute);
    }
    return selector;
  }

  /**
   * Trouve le path selecteur d'un element
   * @param element
   * @returns
   */
  private _findStandardSelector(element : HTMLElement) : string {
    // Gestion de l'id
    if (element.id  && !SelectorService._ID_TO_IGNORE_REG.test(element.id)
     && !ObjectService.isStringStartInTab(element.id, SelectorService._ID_TO_IGNORE) ) {

      return '#' + element.id.split(':').join('\\:');
    }

    try {

       // Si présent dans le dom on le récupère
      return this._finderSelector(document, element);
    } catch (e) {
       // Dans le cas contraire on vérifie dans la sauvegarde du dom
      return this._findSelectorElementInSavedDocument(element);
    }
  }

  /**
   * Récupération du selector d'un élément dans le dom sauvegardé
   */
  private _findSelectorElementInSavedDocument(element : HTMLElement) : string {

    if (!element.tagName) return '';

    // Récupération du tagName
    let selector = element.tagName.toLowerCase();

    // On parcourt la liste des attributs et on construit le sélecteur à la main
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
  private _finderSelector(document : Document, element : HTMLElement) : string {
    return finder(
      element, {
        root : document.body,
        className: name => false, tagName: name => true ,
        idName: name => !ObjectService.isStringStartInTab(name, SelectorService._ID_TO_IGNORE)
         && !name.match(SelectorService._ID_TO_IGNORE_REG) && !SelectorService._ID_TO_IGNORE_REG.test(name),
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
  public manageSpecialCase(attribute : string) : string {
    if (attribute === 'href.bind') {
      attribute = 'href';
    }
    return attribute;
  }

  /**
   * Permet de formater les données d'un sélecteur
   */
  private _formatDataOfSelector(element : HTMLElement, attribute : string) : string {
    return `[${attribute.replace(/[.]/g, '\\\.')}="${element.getAttribute(attribute).replace(/[']/g, '\\\'').replace(/["]/g, '\\\"')}"]`;
  }

  /**
   * Permet de standardiser un sélecteur
   */
  public standardizeSelector(selector : string) : string {
    return selector.replace(/\\\./g, '\\\\.')
    .replace('\n', '\\"').split('\:').join('\\\:')
    /* Quand un sélécteur est trouvé par le finder, au lieu de mettre ":" il met 3A donc
     * il faut transformer le 3A en \\: pour le sélecteur
     */
    .split(new RegExp(/3A[ ]?/gm)).join('\\:');
  }

  /**
   * Permet de trouver le selecteur d'une iframe si l'élément donné s'y trouve
   */
  public findSelectorIframeElement(element : HTMLElement) : string {

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