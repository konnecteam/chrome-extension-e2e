import { ScrollFactory } from './events-factory/scroll-factory';
import { KeydownFactory } from './events-factory/keydown-factory';
import { SubmitFactory } from './events-factory/submit-factory';
import { DropFactory } from './events-factory/drop-factory';
import { ChangeFactory } from './events-factory/change-factory';
import domEventsToRecord from '../../constants/events/events-dom';
import { ClickFactory } from './events-factory/click-factory';
import { IOption } from '../../interfaces/i-options';
import { Block } from '../../code-generator/block';
import { IMessage } from '../../interfaces/i-message';
import pptrActions from '../../constants/pptr-actions';
import { PPtrFactory } from './events-factory/pptr-factory';

/**
 * Factory qui génére le contenu du scnénario
 */
export class ScenarioFactory {

  /**
   * Renvoie le block issue d'une custom ligne
   */
  public static generateCustomLineBlock(framedID : number, customLine : string) : Block {
    return new Block(framedID, {frameId: framedID, type: 'custom-line' , value: customLine });
  }

  /**
   * on set une frame
   */
  public static generateSetFrame(blockRead : Block, blockToAddLine : Block, allFrames : any) : any {

    const lines = blockRead.getLines();
    for (let i = 0; lines.length; i++) {
      const line = lines[i];

      if (line.frameId && Object.keys(allFrames).includes(line.frameId.toString())) {

        const declaration = `const frame_${line.frameId} = frames.find(f => f.url() === '${allFrames[line.frameId]}')`;
        blockToAddLine.addLineToTop(({
          type: pptrActions.FRAME_SET,
          value: declaration
        }));

        blockToAddLine.addLineToTop({
          type: pptrActions.FRAME_SET,
          value: 'let frames = await page.frames()'
        });

        delete allFrames[line.frameId];
        break;
      }
    }
    return { allFrames, block : blockToAddLine };
  }

  /**
   * Génère une ligne blanche, utilisée pour faire un saut de ligne entre les blocs de code
   */
  public static generateBlankLineBlock() : Block {

    const blankLine = new Block();
    blankLine.addLine({
      type: null,
      value: ''
    });

    return blankLine;
  }

  /**
   * Génère le scroll
   */
  public static generateScrollBlock(frameId : number, frame : string,
     scrollX : number, scrollY : number) : Block {

    const block = new Block(frameId);
    block.addLine({
      type: 'scroll',
      value: ` await ${frame}.evaluate( async function(){
        window.scroll(${scrollX}, ${scrollY});
        return Promise.resolve('finish');
      });`
    });

    return block;
  }

  /**
   * Génère la variable navigationPromise en cas de navigation
   */
  public static generateVarNavigationBlock(frameId : number) : Block {
    return new Block(frameId, {
      type: pptrActions.NAVIGATION_PROMISE,
      value: 'const navigationPromise = page.waitForNavigation();'
    });
  }

  /**
   * Ajoute le commentaire dans le block donné
   */
  public static generateCommentsBlock(block : Block, comments : string) : Block {
    block.addLineToTop({
      value: `/** ${comments} */`
    });
    return block;
  }


  /**
   * Parser un événement en Block
   */
  public static parseEvent(event : IMessage, frameId : number, frame : string, options : IOption) : Block {
    // Pour chaque type d'event possible
    const { typeEvent } = event;
    // En fonction du typeEvent déclancheur
    switch (typeEvent) {
      // Si c'est un click
      case domEventsToRecord.CLICK:
        return ClickFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un change
      case domEventsToRecord.CHANGE :
        return ChangeFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un drop
      case domEventsToRecord.DROP :
        return DropFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un submit
      case domEventsToRecord.SUBMIT:
        return SubmitFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un keydown
      case domEventsToRecord.KEYDOWN:
        return KeydownFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un scroll
      case domEventsToRecord.SCROLL:
        return ScrollFactory.generateBlock(event, frameId, frame);
      // Si c'est une action pupeteer
      case pptrActions.PPTR:
        return PPtrFactory.generateBlock(event, frameId, frame, options);
      default : return null;
    }
  }
}