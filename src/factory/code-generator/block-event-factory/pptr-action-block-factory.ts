import { EventModel } from '../../../models/event-model';
import { OptionModel } from '../../../models/options-model';
import ActionEvents from '../../../constants/action-events';
import { Block } from '../../../code-generator/block';
import pptrActions from '../../../constants/pptr-actions';

/**
 * Factory qui génère les block lié aux actions pptr
 */
export class PPtrActionBlockFactory {

  // les attributs sont utilisés pour éviter de les passer aux méthodes

  /** Options du plugin */
  public static options : OptionModel;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;

  /**
   * Génère le block lié à une action pupeteer
   */
  public static generateBlock(event : EventModel, frameId : number, frame : string, options : OptionModel) : Block {

    const { action, value} = event;

    this.frame = frame;
    this.frameId = frameId;
    this.options = options;
    // En fonction de l'action de l'event
    switch (action) {
      // Si l'action est un goto
      case ActionEvents.GOTO:
        return this.buildGoto(value);
        break;
      // Si l'action est la récupération du viewport
      case ActionEvents.VIEWPORT:
        return this.buildViewport(
          value.width, value.height);
        break;
      // Si l'action est une navigation
      case ActionEvents.NAVIGATION:
        return this.buildWaitForNavigation();
        break;
    }
  }

  /**
   * Génère l'accès à une page
   */
  public static buildGoto(href : string) : Block {

    return new Block(this.frameId, {
      type: pptrActions.GOTO,
      value: `await ${this.frame}.goto('${href}');`
    });
  }

  /**
   * Génère le block de lataille de la page
   */
  public static buildViewport(width : number, height : number) : Block {

    return new Block(this.frameId, {
      type: pptrActions.VIEWPORT,
      value: `await ${this.frame}.setViewport({ width: ${width}, height: ${height} });`
    });
  }
  /**
   * Génère le block de navigation
   */
  public static buildWaitForNavigation() : Block {
    const block = new Block(this.frameId);
    if (this.options.waitForNavigation) {
      block.addLine({
        type: pptrActions.NAVIGATION,
        value: `await navigationPromise`
      });
    }
    return block;
  }
}