import 'jest';
import { RegExpFactory } from './regexp-factory';

// tslint:disable: no-identical-functions
describe('Test de RegExp Factory', () => {

  test('RegExp bien formatée', () => {

    expect(
      RegExpFactory.buildRegexpAndFlag('/*.localhost.*/g')
    ).toEqual(
      { regexp : '*.localhost.*', flag : 'g'}

    );
  });


  test('RegExp mal formatée', () => {

    expect(
      RegExpFactory.buildRegexpAndFlag('/*.localhost.*')
    ).toEqual(
      { regexp : '', flag : ''}
    );
  });


  test('RegExp sans flag', () => {

    expect(
      RegExpFactory.buildRegexpAndFlag('/*.localhost.*/')
    ).toEqual(
      { regexp : '*.localhost.*', flag : ''}
    );
  });
});