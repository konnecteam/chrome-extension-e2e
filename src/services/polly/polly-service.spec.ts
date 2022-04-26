import { PollyService } from './polly-service';
import 'jest';

let pollyService : PollyService;
describe('Test de Polly Service', () => {

  beforeAll(function() {
    pollyService = PollyService.Instance;
  });

  test('Test du reset des attributs du service', () => {
    const resultExcepted = { har : '', id : ''};

    pollyService.record.har = 'testHAR';
    pollyService.record.id = 'ID';
    pollyService.flush();

    expect({ har : pollyService.record.har, id : pollyService.record.id }).toEqual(resultExcepted);
  });
});