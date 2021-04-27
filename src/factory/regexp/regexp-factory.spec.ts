import 'jest';
import { RegExpFactory } from './regexp-factory';

// tslint:disable: no-identical-functions
describe('Test de RegExp Factory', () => {

  test('RegExp bien formatée', () => {

    expect(
      RegExpFactory.buildRegeExp('/*.localhost.*/g')
    ).toEqual(
      { regexp: '*.localhost.*', flags: 'g'}

    );
  });


  test('RegExp mal formatée', () => {

    expect(
      RegExpFactory.buildRegeExp('/*.localhost.*')
    ).toEqual(
      { regexp: '', flags: ''}
    );
  });


  test('RegExp sans flag', () => {

    expect(
      RegExpFactory.buildRegeExp('/*.localhost.*/')
    ).toEqual(
      { regexp: '*.localhost.*', flags: ''}
    );
  });
});