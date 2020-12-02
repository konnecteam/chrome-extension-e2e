/**
 * Factory qui permet de crééer un Data url
 */
export class DataURLFactory {

  /**
   * Construit d'un data Url
   */
  public static buildDataURL(mimeType : string, typeData : string, content : string) : string  {
    return `data:${mimeType};${typeData},${content}`;
  }
}