import { KeydownBlockFactory } from './block-event-factory/keydown-block-factory';
import { SubmitBlockFactory } from './block-event-factory/submit-block-factory';
import { DropBlockFactory } from './block-event-factory/drop-block-factory';
import { ChangeBlockFactory } from './block-event-factory/change-block-factory';
import domEventsToRecord from '../../constants/dom-events-to-record';
import { ClickBlockFactory } from './block-event-factory/click-block-factory';
import { IOptionModel } from '../../models/i-options-model';
import { Block } from '../../code-generator/block';
import { IEventModel } from '../../models/i-event-model';
import pptrActions from '../../constants/pptr-actions';
import { PPtrActionBlockFactory } from './block-event-factory/pptr-action-block-factory';

/**
 * Factory qui génére le contenu du scnénario
 */
export class ScenarioFactory {

  /**
   * Renvoie le block issue d'une custom ligne
   */
  public static generateCustomLine(framedID : number, customLine : string) : Block {
    return new Block(framedID, {frameId: framedID, type: 'custom-line' , value: customLine });
  }

  /**
   * on set une frame
   */
  public static generateSetFrame(blockRead : Block, blockToAddLine : Block, allFrames : any) : any {

    const lines = blockRead.getLines();

    for (const line of lines) {

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
    return {allFrames, block : blockToAddLine};
  }

  /**
   * Génère une ligne blanche
   */
  public static generateBlankLine() : Block {

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
  public static generateScroll(frameId : number, frame : string,
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
  public static generateNavigationVar(frameId : number) : Block {
    return new Block(frameId, {
      type: pptrActions.NAVIGATION_PROMISE,
      value: 'const navigationPromise = page.waitForNavigation();'
    });
  }

  /**
   * Ajoute le commentaire dans le block donné
   */
  public static generateComments(block : Block, comments : string) : Block {
    block.addLineToTop({
      value: `/** ${comments} */`
    });
    return block;
  }


  /**
   * Parser un événement en Block
   */
  public static parseEvent(event : IEventModel, frameId : number, frame : string, options : IOptionModel) : Block {
    // Pour chaque type d'event possible
    const { typeEvent } = event;
    // En fonction du typeEvent déclancheur
    switch (typeEvent) {
      // Si c'est un click
      case domEventsToRecord.CLICK:
        return ClickBlockFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un change
      case domEventsToRecord.CHANGE :
        return ChangeBlockFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un drop
      case domEventsToRecord.DROP :
        return DropBlockFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un submit
      case domEventsToRecord.SUBMIT:
        return SubmitBlockFactory.generateBlock(event, frameId, frame, options);
      // Si c'est un keydown
      case domEventsToRecord.KEYDOWN:
        return KeydownBlockFactory.generateBlock(event, frameId, frame, options);
      // Si c'est une action pupeteer
      case pptrActions.pptr:
        return PPtrActionBlockFactory.generateBlock(event, frameId, frame, options);
      default : return null;
    }
  }
}