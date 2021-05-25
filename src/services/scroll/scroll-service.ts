import { SelectorService } from './../selector/selector-service';
import { ChromeService } from '../../services/chrome/chrome-service';

/**
 * Service qui permet de gérer le scroll
 */
export class ScrollService {


  /** Instance de classe */
  public static instance : ScrollService;

  /** Timeout executer */
  private _scrolling : number;

  /** Instance de selecteur service */
  private _selectorService : SelectorService;

  /**
   * Constructeur
   */
  constructor() {
    this._selectorService = SelectorService.Instance;
  }


  /**
   * Singleton
   */
  public static get Instance() : ScrollService {
    if (ScrollService.instance == null) {
      ScrollService.instance = new ScrollService();
    }
    return ScrollService.instance;
  }

  /**
   * Permet de gérer la capture des events scroll
   * @param event
   */
  public handleEvent(event : any) : void {

    /* On clear le timeout. Si il y a encore un scroll capturé
     * cela veut dire qu'on est entrain de continuer de scroller
     * On fait cela pour éviter de récupérer plein de fois l'event scroll
     * pour le même scroll car lors d'un scroll il y a plusieurs event scroll capturés
     */
    window.clearTimeout( this._scrolling );

    /* On set un timeout à executer après le scroll
     * si c'est le dernier event scroll il sera send
     * sinon il sera clear lors de la reception du scroll suivant
     */
    this._scrolling = window.setTimeout(() => {

      // Envoi du scroll
      ChromeService.sendMessage({
        selector: this._selectorService.standardizeSelector(this._selectorService.find(event.target)),
        tagName: event.target.tagName,
        action: event.type,
        typeEvent: event.type,
        // Si on a un scrollLeft c'est que c'est un element et sinon c'est la window donc on utilise pageXOffset
        scrollX: event.target.scrollLeft ? event.target.scrollLeft : window.pageXOffset,
        scrollY: event.target.scrollTop ? event.target.scrollTop : window.pageYOffset,
      });
    }, 150);

  }
}