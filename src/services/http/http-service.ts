/**
 * Service qui permet de faire des requêtes XMLHttpRequest
 */
export class HttpService {

  /** Permet d'exécuter une requête XMLHttpRequest de type GET */
  public static async getRequestAsync(url : string, type : XMLHttpRequestResponseType = 'text') : Promise<string> {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.open('GET', url, true);
      xhr.responseType = type;
      xhr.onload = ( ) => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject('empty response');
        }
      };
      xhr.send();
    });
  }
}