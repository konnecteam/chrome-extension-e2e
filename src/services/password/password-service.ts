import { v4 as uuidv4 } from 'uuid';

/**
 * Service qui permet de créer un password
 */
export class PasswordService {

  /**
   * Génère un password
   */
  public static generate() : string  {
    return uuidv4();
  }
}