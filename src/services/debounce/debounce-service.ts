
/**
 * Service qui permet de faire des debounces
 */
export class DebounceService {

  /**
   * Méthode qui permet de faire des debounces
   * @param callback
   * @param timeout
   * @returns
   */
  public static debounce(callback : (e : any) => void, timeout : number) : () => void {
    let debounceTimeoutId : number;
    return function(...args) {
      window.clearTimeout(debounceTimeoutId);
      debounceTimeoutId = window.setTimeout(() => callback.apply(this, args), timeout);
    };
  }
}