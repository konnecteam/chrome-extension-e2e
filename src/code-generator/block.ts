import { ILineBlockModel } from '../models/i-line-block-model';

/**
 * Un block est une partie du scenario que l'on va exporter
 */
export class Block {

  /** Numéro de la frame */
  private _frameId : number;
  /** Ligne du Block */
  private _lines : ILineBlockModel[];

  constructor(frameId? : number, line? : ILineBlockModel) {
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
  public addLineToTop(line : ILineBlockModel) {
    line.frameId = this._frameId;
    this._lines.unshift(line);
  }

  /**
   * Ajout d'une ligne
   */
  public addLine(line : ILineBlockModel) {
    line.frameId = this._frameId;
    this._lines.push(line);
  }

  /**
   * Récuperer toutes les lignes du block
   */
  public getLines() : ILineBlockModel[] {
    return this._lines;
  }
}