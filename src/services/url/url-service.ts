/**
 * Service qui permet de gérer la création d'une url à partir d'un object
 */
export class URLService {

  /**
   * Création d'une url à partir d'un objet
   * @param object
   */
  public static createURLObject(object : any) : string {
    return URL.createObjectURL(object);
  }

  /**
   * Permet de retirer une url
   * @param url
   */
  public static revokeURL(url : string) : void {
    URL.revokeObjectURL(url);
  }
}

