/**
 * Service qui permet de faire des requêtes XMLHttpRequest
 */
export class HttpService {

  /** Permet d'exécuter une requête XMLHttpRequest de type GET */
  public static async getRequestAsync(url : string) : Promise<any> {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('empty response');
        }
        return response.json();
      })
      .catch(error => {
        throw error;
      });
  }
}