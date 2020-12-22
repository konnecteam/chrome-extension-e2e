import { PollyService } from './polly-service';
import 'jest';

let pollyService : PollyService;
describe('Test de Polly Service', () => {

  beforeAll(function() {
    pollyService = PollyService.Instance;
  });

  test('Test du reset des attributs du service', () => {
    const resultExcepted = { har : '', id : ''};

    pollyService.har = 'testHAR';
    pollyService.id = 'ID';
    pollyService.flush();

    expect({har : pollyService.har, id : pollyService.id}).toEqual(resultExcepted);
  });
});