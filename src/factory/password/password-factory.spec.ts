import { PasswordFactory } from './password-factory';
import 'jest';

describe('Test de Password factory', () => {

  test('Test de la méthode generate', async () => {

    expect(
     PasswordFactory.generate()
    ).toBeDefined();
  });
});