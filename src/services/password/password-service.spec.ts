import { PasswordService } from './password-service';
import 'jest';

describe('Test de Password Service', () => {

  test('Test de la méthode generate', async () => {

    expect(
     PasswordService.generate()
    ).toBeDefined();
  });
});