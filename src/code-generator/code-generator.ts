import { UtilityService } from '../services/utility/utility-service';
import { default as pptrActions} from '../constants/pptr-actions';
import { ScenarioFactory } from '../factory/code-generator/scenario-factory';
import { IMessage } from '../interfaces/i-message';
import { Block } from './block';
import { IOption } from '../interfaces/i-options';
import { FooterFactory } from '../factory/code-generator/footer-factory';
import { HeaderFactory } from '../factory/code-generator/header-factory';


/**
 * Classe qui permet de générer le scénario à partir des événements enregistrés
 */
export default class CodeGenerator {

  /** Options du plugin */
  private _options : IOption;

  /** Liste des Block du scénario */
  private _blocks : Block[] = [];

  /** Frame courante */
  private _frame : string = 'page';

  /** Id de la framess */
  private _frameId : number = 0;

  /** Liste des frames */
  private _allFrames : any = {};

  /** Permet de savoir si il y a eu une navigation */
  private _hasNavigation = false;

  constructor(options : IOption ) {
    this._options = options;
  }

  public generate(events : IMessage[]) : string {
    return HeaderFactory.generateHeader(
      this._options.recordHttpRequest,
      this._options.wrapAsync,
      this._options.headless,
      this._options.regexHTTPrequest
      )
     + this._parseEvents(events)
     + FooterFactory.generateFooter(this._options.wrapAsync);
  }

  /**
   * On génère le code à partir des events enregistrés
   */
  private _parseEvents(events : IMessage[]) : string {

    let result = '';

    let newBlock : Block;
    // 1- On parcourt la liste de tous les event sauvegardés pour générer les blocks
    for (let i = 0; i < events.length; i++) {

      const currentEvent = events[i];

      // On update les frames
      this._setFrames(currentEvent.frameId, currentEvent.frameUrl);
      // On parse l'event en block
      newBlock = ScenarioFactory.parseEvent(currentEvent, this._frameId, this._frame, this._options);

      if (newBlock) {

        /* Si l'option custom Line before event est utilisée et que ce n'est pas un action puppeteer
           Alors on rajoute la ligne customisé
        */
        if (this._options.customLinesBeforeEvent &&
          !UtilityService.isValueInObject(pptrActions, currentEvent.action)) {

          this._blocks.push(ScenarioFactory.generateCustomLineBlock(this._frameId, this._options.customLinesBeforeEvent));
        }

        /* Si l'event contient un commentaire alors on rajoute un block de commentaire */
        if (currentEvent.comments) {
          this._blocks.push(ScenarioFactory.generateCommentsBlock(newBlock, currentEvent.comments));
        } else {
          this._blocks.push(newBlock);
        }
      }

      // Si l'action détéctée est un navigation alors on met la navigation à true
      if  (currentEvent.action === pptrActions.NAVIGATION) {
        this._hasNavigation = true;
      }

    }
    // On rajoute une custome ligne avant la fin pour attendre des dernières interactions
    if (this._options.customLinesBeforeEvent) {

      this._blocks.push(ScenarioFactory.generateCustomLineBlock(this._frameId, this._options.customLinesBeforeEvent));
    }

    /* Si il y a eu une navigation et que l'option pour wait la navigation est activée
       Alors on rajoute le block de navigation
    */
    if (this._hasNavigation && this._options.waitForNavigation) {
      this._blocks.unshift(ScenarioFactory.generateVarNavigationBlock(this._frameId));
    }

    // 2- on effectue les opération post processs
    this._postProcess();

    const indent = this._options.wrapAsync ? '  ' : '';
    const newLine = `\n`;
    // 3- on récupère le result
    for (let i = 0; i < this._blocks.length; i++) {

      const lines = this._blocks[i].getLines();
      for (let j = 0; j < lines.length; j++) {
        result += `${indent}${lines[j].value}${newLine}`;
      }
    }
    return result;
  }

  /**
   * Modifie la frame
   */
  private _setFrames(frameId : number, frameUrl : string) : void {

    if (frameId && frameId !== 0) {
      this._frameId = frameId;
      this._frame = `frame_${frameId}`;
      this._allFrames[frameId] = frameUrl;
    } else {
      this._frameId = 0;
      this._frame = 'page';
    }
  }

  /**
   * Effectue des opérations après le parsage en block des events,
   * pour set les frames et ajouter une ligne blanche
   */
  private _postProcess() {
    // quand les event sont record à partir des différentes frames, on va ajouter la bonne frame
    if (Object.keys(this._allFrames).length > 0) {
      this._postProcessSetFrames();
    }

    if (this._options.blankLinesBetweenBlocks && this._blocks.length > 0) {
      this._postProcessAddBlankLines();
    }
  }

  /**
   *  Set les frames
   */
  private _postProcessSetFrames() : void {
    for (const [i, block] of this._blocks.entries()) {

      const result = ScenarioFactory.generateSetFrame(block, block[i], this._allFrames);
      this._allFrames = result.allFrames ;
      block[i] = result.block;
    }
  }

  /**
   * Ajoute des lignes blanches entre chaque block
   */
  private _postProcessAddBlankLines() : void {

    let i = 0;
    while (i <= this._blocks.length) {

      const blankLine = ScenarioFactory.generateBlankLineBlock();
      this._blocks.splice(i, 0, blankLine);
      i += 2;
    }
  }

}
