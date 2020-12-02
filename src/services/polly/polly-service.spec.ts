import { PollyService } from './polly-service';
import 'mocha';
import * as assert from 'assert';

let pollyService : PollyService;
describe('Test de Polly Service', () => {

  before(function() {
    pollyService = PollyService.Instance;
  });

  it('Test du reset des attributs du service', () => {
    const resultExcepted = { har : '', id : ''};

    pollyService.har = 'testHAR';
    pollyService.id = 'ID';
    pollyService.flush();

    assert.deepStrictEqual({har : pollyService.har, id : pollyService.id}, resultExcepted);
  });
});