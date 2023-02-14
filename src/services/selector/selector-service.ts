import finder from '@medv/finder';
import { StorageService } from '../../services/storage/storage-service';

/**
 * Service qui permet la gestion des sélecteurs
 */
export class SelectorService {

  /** Id à ignorer */
  private static readonly _ID_TO_IGNORE_REG  = new RegExp('([A-Za-z0-9]+-){4}', 'g');
  private static readonly _ID_TO_IGNORE = ['formv', 'kdp', 'mv', 'tabs', 'rg', 'ckb', 'cm', 'ktagslist'];

  /**
   * Data attribute contient les customs attribute que l'utilisateur veut utiliser
   * C'est soit des string soit des RegExp
   */
  private _dataAttributes : RegExp[] | string[] = null;

  /**
   * Ce boolean permet de savoir si on utilise des regexp ou des strings
   */
  private _useRegex : boolean;

  /** Instance singleton */
  public static instance : SelectorService;

  constructor() {
    this._useRegex = false;
    this._getOptionAsync();
  }

  /**
   * Récupère les options du plugin pour savoir si il faut utiliser des
   * custom selectors
   */
  private async _getOptionAsync() : Promise<void> {

    try {

      const opt = await StorageService.getDataAsync(['options']);

      if (opt) {

        this._useRegex = opt.options.useRegexForDataAttribute;

        this._dataAttributes = opt.options.dataAttribute.split(' ').filter(element => element !== '').map(element => {
          if (this._useRegex) {
            return new RegExp(element);
          } else {
            return element;
          }
        });
      }

    } catch (err) {
      console.error('Problem with options recovery : ', err);
    }

  }

  /**
   * Cherche les custom attributs d'un element pour les utiliser en tant que selecteur
   */
  private _getCustomAttributes(element : HTMLElement) : string[] {

    const customAttributes = [];

    // Gestion des cutom attributes
    if (this._dataAttributes && this._dataAttributes.length) {

      // On recherche les custom attributes
      const targetAttributes = element.attributes;

      for (let i = 0;  i < this._dataAttributes.length; i++) {

        const patternAttr = this._dataAttributes[i];

        // On test chaque attribute avec le pattern
        if (targetAttributes) {

          for (let j = 0; j < targetAttributes.length; j++) {

            // Regex ou string test
            if (this._useRegex ? (patternAttr as RegExp).test(targetAttributes[j].name) : patternAttr === targetAttributes[j].name) {
              // La recherche est terminée
              // On traite les cas spéciaux des customs attributes
              customAttributes.push(this.manageSpecialCase(targetAttributes[j].name));
            }
          }
        }
      }
    }

    return customAttributes;
  }

  /**
   * Récupération de l'instance de la classe
   */
  public static get Instance() : SelectorService {
    if (SelectorService.instance == null) {
      SelectorService.instance = new SelectorService();
    }
    return SelectorService.instance;
  }

  /**
   * Récupère le selector d'un élément html
   */
  public find(element : HTMLElement) : string {

    // On verifie si on peut utiliser ses custom attribut pour faire le selecteur
    if (this._dataAttributes && this._dataAttributes.length > 0) {

      // On récupère les custom attributs d'un élément si il y en a
      const customAttributes : string[] = this._getCustomAttributes(element);

      // On construit le custom selector
      const customSelector = customAttributes.length > 0 ? this._findCustomSelector(element, customAttributes) : '';

      // Si le customSelector est vide ou qu'on trouve plus d'un element alors on utilise le standard
      if (customSelector === '' || document.querySelectorAll(customSelector).length > 1) {

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
   */
  private _findCustomSelector(element : HTMLElement, customAttributes : string[]) : string {
    let selector = '';
    for (const customAttribute of customAttributes) {
      selector = `${selector}${this._formatDataOfSelector(element, customAttribute)}`;
    }
    return selector;
  }

  /**
   * Trouve le path selecteur d'un element
   */
  private _findStandardSelector(element : HTMLElement) : string {
    // Gestion de l'id
    if (element.id && !SelectorService._ID_TO_IGNORE_REG.test(element.id) && !SelectorService._ID_TO_IGNORE.some(v => element.id.includes(v))) {

      return `#${element.id.split(':').join('\\:')}`;
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
  private _findSelectorElementInSavedDocument(element : HTMLElement) : string {

    if (!element.tagName) {
      return '';
    }

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
        className : name => false, tagName : name => true ,
        idName : name => !SelectorService._ID_TO_IGNORE.some(v => name.includes(v)) && !name.match(SelectorService._ID_TO_IGNORE_REG) && !SelectorService._ID_TO_IGNORE_REG.test(name),
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
   * Entré : element : un element qui a la propriété attribute passée en paramètre
   * et attribute : click.delegate
   * Sortie : [click\.delegate="modalGdprVM.close()"]
   */
  private _formatDataOfSelector(element : HTMLElement, attribute : string) : string {
    return `[${attribute.replace(/[.]/g, '\\\.')}="${element.getAttribute(attribute).replace(/[']/g, '\\\'').replace(/["]/g, '\\\"')}"]`;
  }

  /**
   * Permet de standardiser un sélecteur
   * Entré : collapse-panel > div > div > div > div:nth-child(2) > div > input
   * Sortie : collapse-panel > div > div > div > div\:nth-child(2) > div > input
   */
  public standardizeSelector(selector : string) : string {
    return selector.replace(/\\\./g, '\\\\\.')
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