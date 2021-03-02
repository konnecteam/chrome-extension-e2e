/**
 * Model représentant une ligne du Block
 */
export class ILineBlockModel {

  /** FrameId du block */
  public frameId? : number;

  /** Type d'event à enregistrer */
  public type? : string;

  /** Valeur de la ligne du block */
  public value? : string;
}