import { v4 as uuidv4 } from 'uuid';

/**
 * Factory qui permet de créer un password
 */
export class PasswordFactory {

  /**
   * Génère un password
   */
  public static generate() : string  {
    return uuidv4();
  }
}