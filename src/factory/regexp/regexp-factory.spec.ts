import 'mocha';
import * as assert from 'assert';
import { RegExpFactory } from './regexp-factory';

// tslint:disable: no-identical-functions
describe('Test de RegExp Factory', () => {

  it('RegExp bien formatée', () => {

    assert.deepStrictEqual(
      RegExpFactory.buildRegeExp('/*.localhost.*/g'),
      { regexp: '*.localhost.*', flags: 'g'}
    );
  });


  it('RegExp Mal formatée', () => {

    assert.deepStrictEqual(
      RegExpFactory.buildRegeExp('/*.localhost.*'),
      { regexp: '', flags: ''}
    );
  });


  it('RegExp sans flag', () => {

    assert.deepStrictEqual(
      RegExpFactory.buildRegeExp('/*.localhost.*/'),
      { regexp: '*.localhost.*', flags: ''}
    );
  });
});