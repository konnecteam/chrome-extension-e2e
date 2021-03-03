/**
 * Interface représentant une ligne du Block
 */
export class ILineBlock {

  /** FrameId du block */
  frameId? : number;

  /** Type d'event à enregistrer */
  type? : string;

  /** Valeur de la ligne du block */
  value? : string;
}