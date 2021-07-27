import { ScrollFactory } from './events-factory/scroll-factory';
import { KeydownFactory } from './events-factory/keydown-factory';
import { SubmitFactory } from './events-factory/submit-factory';
import { DropFactory } from './events-factory/drop-factory';
import { ChangeFactory } from './events-factory/change-factory';
import { ClickFactory } from './events-factory/click-factory';
import { IOption } from '../../interfaces/i-options';
import { Block } from '../../code-generator/block';
import { IMessage } from '../../interfaces/i-message';
import { PPtrFactory } from './events-factory/pptr-factory';
import { ScenarioService } from '../../services/scenario/scenario-service';
import { RegExpFactory } from '../../factory/regexp/regexp-factory';
import { EPptrAction } from '../../enum/action/pptr-actions';
import { EDomEvent } from '../../enum/events/events-dom';

// Constant
import HEADER from '../../constants/code-generate/header-code';

/**
 * Factory qui génére le contenu du scnénario
 */
export class ScenarioFactory {

  /** Construction du header du scenario */
  public static buildHeader(
    includeHttpRequest : boolean,
    includeWrapAsync : boolean,
    isHeadless : boolean,
    httpRegex : string
  ) : string {

    // Récupération des imports
    const importedPackage = ScenarioService.getImport(includeHttpRequest);
    let header = ScenarioService.getHeader(includeWrapAsync);
    header = isHeadless ? header : header.replace('launch()', 'launch({ headless : false })');

    let regex = '';

    // Si les options contiennent une regex on récupère la regex et son flag
    if (httpRegex) {

      const regexObject = RegExpFactory.buildRegexpAndFlag(httpRegex);

      if (regexObject && regexObject.regexp) {

        // On créé les paramètres pour l'objet RegExp
        regex = `${regex}'${regexObject.regexp}'${regexObject.flag ? `,'${regexObject.flag}'` : ''}`;
      }
    }

    // Les requêtes http doivent être incluse dans le header ?
    if (includeHttpRequest) {

      header = `${header}${HEADER.REQUEST_LISTENER.replace('**httpregex**', regex ? `, new RegExp(${regex})` : '')}`;
    } else {

    // Si on une regex et pas l'option de record activé, on utilise le listener de la page pour les requêtes en live
      header = `${header}${HEADER.LIVE_REQUEST_LISTENER.replace('**httpregex**', regex ? `, new RegExp(${regex})` : '')}`;
    }

    return `${importedPackage}${header}`;
  }

  /**
   * Construit le code personnalisé définit par les options utilisateur
   */
  public static buildCustomLineBlock(framedID : number, customLine : string) : Block {
    return new Block(framedID, { frameId : framedID, type : 'custom-line', value : customLine });
  }

  /**
   * on set une frame
   */
  public static buildSetFrame(blockRead : Block, blockToAddLine : Block, allFrames : any) : any {

    const lines = blockRead.getLines();
    for (let i = 0; lines.length; i++) {
      const line = lines[i];

      if (line.frameId && Object.keys(allFrames).includes(line.frameId.toString())) {

        const declaration = `const frame_${line.frameId} = frames.find(f => f.url() === '${allFrames[line.frameId]}')`;
        blockToAddLine.addLineToTop(({
          type : EPptrAction.FRAME_SET,
          value : declaration
        }));

        blockToAddLine.addLineToTop({
          type : EPptrAction.FRAME_SET,
          value : 'let frames = await page.frames()'
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
  public static buildBlankLineBlock() : Block {

    const blankLine = new Block();
    blankLine.addLine({
      type : null,
      value : ''
    });

    return blankLine;
  }

  /**
   * Construit la variable navigationPromise en cas de navigation
   */
  public static buildNavigationBlock(frameId : number) : Block {
    return new Block(frameId, {
      type : EPptrAction.NAVIGATION_PROMISE,
      value : 'const navigationPromise = page.waitForNavigation();'
    });
  }

  /**
   * Construit un commentaire à ajouté dans le code
   */
  public static buildCommentBlock(block : Block, comments : string) : Block {
    block.addLineToTop({ value : `/** ${comments} */` });
    return block;
  }

  /**
   * Permet de construire un block de code correspondant à l'événèment donnée
   */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    // Pour chaque type d'event possible
    const { typeEvent } = event;

    // En fonction du typeEvent déclancheur
    switch (typeEvent) {

      // Si c'est un click
      case EDomEvent.CLICK :
        return ClickFactory.buildBlock(event, frameId, frame, options);
      // Si c'est un change
      case EDomEvent.CHANGE :
        return ChangeFactory.buildBlock(event, frameId, frame, options);
      // Si c'est un drop
      case EDomEvent.DROP :
        return DropFactory.buildBlock(event, frameId, frame, options);
      // Si c'est un submit
      case EDomEvent.SUBMIT :
        return SubmitFactory.buildBlock(event, frameId, frame, options);
      // Si c'est un keydown
      case EDomEvent.KEYDOWN :
        return KeydownFactory.buildBlock(event, frameId, frame, options);
      // Si c'est un scroll
      case EDomEvent.SCROLL :
        return ScrollFactory.buildBlock(event, frameId, frame);
      // Si c'est une action pupeteer
      case EPptrAction.PPTR :
        return PPtrFactory.buildBlock(event, frameId, frame, options);
      default : return null;
    }
  }
}