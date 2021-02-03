/**
 * Service qui permet de faire des requêtes XMLHttpRequest
 */
export class XMLHttpRequestService {

  /**
   * Permet d'exécuter une requête XMLHttpRequest
   * @param url
   * @param loadhandle
   */
  public static executeRequest(xhr : XMLHttpRequest, url : string, loadhandle : any) : void {
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = loadhandle;
    xhr.send();
  }
}