/**
 * Service qui permet de faire des requêtes XMLHttpRequest
 */
export class HttpService {

  /**
   * Permet d'exécuter une requête XMLHttpRequest
   * @param url
   * @param loadhandle
   */
  public static async getRequest(url : string) : Promise<string> {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, err) => {
      xhr.open('GET', url, true);
      xhr.responseType = 'text';
      xhr.onload = ( ) => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          err('empty response');
        }
      };
      xhr.send();
    });
  }
}