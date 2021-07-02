import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import { Block } from '../../../code-generator/block';

// Constant
import PPTR_ACTION from '../../../constants/pptr-actions';

/**
 * Factory qui permet de créér des objets lié aux actions puppeteer
 */
export class PPtrFactory {

  /**
   * Génère le block lié à une action pupeteer
   */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, value} = event;

    // En fonction de l'action de l'event
    switch (action) {
      // Si l'action est un goto
      case PPTR_ACTION.GOTO :
        return this.buildGotoBlock(frameId, frame, value);
      // Si l'action est la récupération du viewport
      case PPTR_ACTION.VIEWPORT :
        return this.buildViewportBlock(frameId, frame, value.width, value.height);
      // Si l'action est une navigation
      case PPTR_ACTION.NAVIGATION :
        return this.buildWaitForNavigationBlock(options, frameId);
      default : return null;
    }
  }

  /**
   * Génère l'accès à une page
   */
  public static buildGotoBlock(
    frameId : number,
    frame : string,
    href : string
  ) : Block {

    const block =  new Block(frameId, {
      type : PPTR_ACTION.GOTO,
      value : `await ${frame}.goto('${href}');`
    });

    // On wait une seconde pour attendre konnect
    block.addLine({
      type : PPTR_ACTION.GOTO,
      value : `await page.waitForTimeout(1000);
  await page.evaluate( () => {
    window.konnect.engineStateService.Instance.start();
  });`
    });

    return block;
  }

  /**
   * Génère le block de la taille de la page
   */
  public static buildViewportBlock(
    frameId : number,
    frame : string,
    width : number,
    height : number
  ) : Block {

    return new Block(frameId, {
      type : PPTR_ACTION.VIEWPORT,
      value : `await ${frame}.setViewport({ width: ${width}, height: ${height} });`
    });
  }

  /**
   * Génère le block de navigation
   */
  public static buildWaitForNavigationBlock(
    options : IOption,
    frameId : number
  ) : Block {

    const block = new Block(frameId);

    if (options.waitForNavigation) {

      block.addLine({
        type : PPTR_ACTION.NAVIGATION,
        value : `await navigationPromise`
      });
    }

    return block;
  }
}