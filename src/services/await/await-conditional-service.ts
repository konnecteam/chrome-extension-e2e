/**
 * Service qui permet d'attendre que la condition soit valide
 */
export class AwaitConditionalService {

  /**
   * Permet d'attendre que la condition soit valide
   */
  private static _waitForCondition(condition : () => any,
    onSuccess : () => void,
    interval : number = 200,
    onError : () => void = () => { }
  ) : { dispose : () => void; } {

    if (condition()) {

      onSuccess();
      return {
        dispose : () => { }
      };
    } else {

      const _waitForInterval = setInterval(() => {
        if (condition()) {

          clearInterval(_waitForInterval);
          onSuccess();
        }
        else {

          clearInterval(_waitForInterval);
          onError();
        }
      }, interval);
      return {

        dispose : () => clearInterval(_waitForInterval)
      };
    }
  }

  /**
   * Permet d'attendre que la condition soit valide en asynchrone
   */
  public static waitForConditionAsync(condition : () => any, interval : number = 200) : Promise<any> {

    return new Promise( (resolve, reject ) => {
      return AwaitConditionalService._waitForCondition(condition, resolve as (() => void), interval, reject);
    });
  }
}