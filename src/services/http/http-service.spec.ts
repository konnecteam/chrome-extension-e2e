import 'jest';
import { HttpService } from './http-service';

let isFinish = false;

/**
 * Permet de verifier que la request est fini
 */
async function isXMLHttpRequestFinishAsync() : Promise<void> {

  return new Promise(resolve => {
    /**
     * On vérifie tous les 350 ms si on a fini la request
     */
    const interv = setInterval(() => {
      if (isFinish) {
        resolve();
        clearInterval(interv);
      }
    }, 350);
  });
}

/**
 * On set isFinish avec la value passée en paramètre
 */
function setFinish(value : boolean) : any {
  isFinish = value;
}

describe('Test de du Service HttpService', function() {

  test('Test de execute request', async() => {

    const xhr = new XMLHttpRequest();
    // Si il y a une erreur (en cas de lien inaccessible)
    xhr.onerror = setFinish(true);
    // on execute la request
    HttpService.getRequest(xhr, 'https://jsonplaceholder.typicode.com/users', setFinish(true));
    // On attent que la request soit fini
    await isXMLHttpRequestFinishAsync();
    // isFinish doit être à true
    expect(isFinish).toBeTruthy();
  });
});