import { PollyService } from './../../services/polly/polly-service';
import { PollyFactory } from './polly-factory';
import 'mocha';
import * as assert from 'assert';

let pollyService : PollyService;

const harEmpty = 'No request recorded';
const idEmpty = 'emptyResult';

describe('Test de Polly Factory', () => {

  before('Mise en place des instances', () => {
    pollyService = PollyService.Instance;
  });

  it('Polly Id vide', () => {
    pollyService.har = 'content';

    assert.deepStrictEqual(
      PollyFactory.buildResultObject(),
      { folderName : idEmpty , har : 'content'}
    );

  });

  it('Polly HAR vide', () => {
    // On reset les attributs
    pollyService.flush();

    pollyService.id = 'id';

    assert.deepStrictEqual(
      PollyFactory.buildResultObject(),
      { folderName : 'id' , har : harEmpty}
    );
  });


  it('Polly Id et HAR vides', () => {

    pollyService.flush();

    assert.deepStrictEqual(
      PollyFactory.buildResultObject(),
      { folderName : idEmpty , har : harEmpty}
    );

  });

  it('Polly Id et HAR', () => {
    pollyService.har = 'har content';
    pollyService.id = 'PollyID';

    assert.deepStrictEqual(
      PollyFactory.buildResultObject(),
      { folderName : 'PollyID' , har : 'har content'}
    );

  });
});