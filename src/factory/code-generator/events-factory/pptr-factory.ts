import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import { Block } from '../../../code-generator/block';
import pptrActions from '../../../constants/pptr-actions';

/**
 * Factory qui permet de créér des objets lié aux actions puppeteer
 */
export class PPtrFactory {

  // les attributs sont utilisés pour éviter de les passer aux méthodes

  /** Options du plugin */
  public static options : IOption;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;

  /**
   * Génère le block lié à une action pupeteer
   */
  public static generateBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, value} = event;

    this.frame = frame;
    this.frameId = frameId;
    this.options = options;
    // En fonction de l'action de l'event
    switch (action) {
      // Si l'action est un goto
      case pptrActions.GOTO:
        return this.buildGotoBlock(value);
      // Si l'action est la récupération du viewport
      case pptrActions.VIEWPORT:
        return this.buildViewportBlock(
          value.width, value.height);
      // Si l'action est une navigation
      case pptrActions.NAVIGATION:
        return this.buildWaitForNavigationBlock();
    }
  }

  /**
   * Génère l'accès à une page
   */
  public static buildGotoBlock(href : string) : Block {

    const block =  new Block(this.frameId, {
      type: pptrActions.GOTO,
      value: `await ${this.frame}.goto('${href}');`
    });

    // On wait une seconde pour attendre konnect
    block.addLine({
      type: pptrActions.GOTO,
      value: `await page.waitForTimeout(1000);
  await page.evaluate( () => {
    window.konnect.engineStateService.Instance.start();
  });`
    });
    return block;
  }

  /**
   * Génère le block de la taille de la page
   */
  public static buildViewportBlock(width : number, height : number) : Block {

    return new Block(this.frameId, {
      type: pptrActions.VIEWPORT,
      value: `await ${this.frame}.setViewport({ width: ${width}, height: ${height} });`
    });
  }

  /**
   * Génère le block de navigation
   */
  public static buildWaitForNavigationBlock() : Block {
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