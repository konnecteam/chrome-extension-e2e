import { PollyService } from './../../services/polly/polly-service';
import { PollyFactory } from './polly-factory';
import 'jest';

let pollyService : PollyService;

const harEmpty = 'No request recorded';
const idEmpty = 'emptyResult';

describe('Test de Polly Factory', () => {

  // Mise en place des instances
  beforeAll(() => {
    pollyService = PollyService.Instance;
  });

  test('Polly Id vide', () => {
    pollyService.har = 'content';

    expect(
      PollyFactory.buildResultObject()
    ).toEqual(
      { folderName : idEmpty , har : 'content'}
    );
  });

  test('Polly HAR vide', () => {
    // On reset les attributs
    pollyService.flush();

    pollyService.id = 'id';

    expect(
      PollyFactory.buildResultObject()
    ).toEqual(
      { folderName : 'id' , har : harEmpty}
    );
  });


  test('Polly Id et HAR vides', () => {

    pollyService.flush();

    expect(
      PollyFactory.buildResultObject()
    ).toEqual(
      { folderName : idEmpty , har : harEmpty}
    );

  });

  test('Polly Id et HAR', () => {
    pollyService.har = 'har content';
    pollyService.id = 'PollyID';

    expect(
      PollyFactory.buildResultObject()
    ).toEqual(
      { folderName : 'PollyID' , har : 'har content'}
    );

  });
});