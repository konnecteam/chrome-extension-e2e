import { LineBlockModel } from './../models/line-block-model';

/**
 * Un block est une partie du scenario que l'on va exporter
 */
export class Block {

  /** Numéro de la frame */
  private _frameId : number;
  /** Ligne du Block */
  private _lines : LineBlockModel[];

  constructor(frameId? : number, line? : LineBlockModel) {
    this._lines = [];
    this._frameId = frameId;

    if (line) {
      line.frameId = this._frameId;
      this._lines.push(line);
    }
  }

  /**
   * Ajout d'une ligne au début du tableau
   */
  public addLineToTop(line : LineBlockModel) {
    line.frameId = this._frameId;
    this._lines.unshift(line);
  }

  /**
   * Ajout d'une ligne
   */
  public addLine(line : LineBlockModel) {
    line.frameId = this._frameId;
    this._lines.push(line);
  }

  /**
   * Récuperer toutes les lignes du block
   */
  public getLines() : LineBlockModel[] {
    return this._lines;
  }
}