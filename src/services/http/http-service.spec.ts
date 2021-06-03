import 'jest';
import { HttpService } from './http-service';

describe('Test de du Service HttpService', function() {

  test('Test de execute request', async() => {
    // on execute la request
    const result = await HttpService.getRequest('https://jsonplaceholder.typicode.com/users');

    // result doit être à defined
    expect(result).toBeDefined();
  }, 10000);
});