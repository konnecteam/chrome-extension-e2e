import { IMessage } from '../interfaces/i-message';
import { Block } from './block';
import { IOption } from '../interfaces/i-options';
import { ScenarioFactory } from '../factory/code-generator/scenario-factory';
import { ScenarioService } from '../services/scenario/scenario-service';

// Constant
import PPTR_ACTIONS from '../constants/pptr-actions';

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

  /** Génération du code du scenario */
  public generate(events : IMessage[]) : string {

    const header = ScenarioFactory.buildHeader(
      this._options.recordHttpRequest,
      this._options.wrapAsync,
      this._options.headless,
      this._options.regexHTTPrequest
    );

    return `${header}${this._parseEvents(events)}${ScenarioService.getFooter(this._options.wrapAsync)}`;
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

      // On contruit le block de code à partir de l'évènement enregistré
      newBlock = ScenarioFactory.buildBlock(currentEvent, this._frameId, this._frame, this._options);

      if (newBlock) {

        /**
         * Si l'option custom Line before event est utilisée et que ce n'est pas un action puppeteer
         * Alors on rajoute la ligne customisé
         */
        if (this._options.customLinesBeforeEvent && Object.values(PPTR_ACTIONS).indexOf(currentEvent.action) === -1) {

          this._blocks.push(ScenarioFactory.buildCustomLineBlock(this._frameId, this._options.customLinesBeforeEvent));
        }

        /* Si l'event contient un commentaire alors on rajoute un block de commentaire */
        if (currentEvent.comments) {

          this._blocks.push(ScenarioFactory.buildCommentBlock(newBlock, currentEvent.comments));
        } else {

          this._blocks.push(newBlock);
        }
      }

      // Si l'action détéctée est un navigation alors on met la navigation à true
      if (currentEvent.action === PPTR_ACTIONS.NAVIGATION) {
        this._hasNavigation = true;
      }
    }

    /**
     * Ici on rajoute un await afin de pouvoir visualiser la fin du scénario
     * Note : Peut être supprimé si options non nécessaire
     */
    if (this._options.customLinesBeforeEvent) {

      this._blocks.push(ScenarioFactory.buildCustomLineBlock(this._frameId, this._options.customLinesBeforeEvent));
    }

    /**
     * Si une navigation à eu lieux et que l'option 'attendre la navigation est activé'
     * alors on rajoute un block de code permettant de gérer la naviation
     */
    if (this._hasNavigation && this._options.waitForNavigation) {
      this._blocks.unshift(ScenarioFactory.buildNavigationBlock(this._frameId));
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
   * Set les frames
   */
  private _postProcessSetFrames() : void {

    for (const [i, block] of this._blocks.entries()) {

      const result = ScenarioFactory.buildSetFrame(block, block[i], this._allFrames);
      this._allFrames = result.allFrames ;
      block[i] = result.block;
    }
  }

  /**
   * Ajoute des lignes blanches entre chaque block
   */
  private _postProcessAddBlankLines() : void {

    // On utilise i+2 éviter de séparer les lignes de code
    for (let i = 0; i <= this._blocks.length; i += 2) {
      const blankLine = ScenarioFactory.buildBlankLineBlock();
      this._blocks.splice(i, 0, blankLine);
    }
  }
}