import { IMessage } from '../../../interfaces/i-message';
import { DropFactory } from './drop-factory';
import { defaults } from '../../../constants/default-options';
import 'jest';
import customEvents from '../../../constants/events/events-custom';
import { ClickFactory } from './click-factory';
import { ChangeFactory } from './change-factory';

/** Frame définie pour les tests */
const frame = 'page';
const frameId = 0;

describe('Test de Drop Block Factory', () => {

  // Initialisation
  beforeAll(() => {

    ClickFactory.options = JSON.parse(JSON.stringify(defaults));
    ClickFactory.frameId = frameId;
    ClickFactory.frame = frame;

    ChangeFactory.options = JSON.parse(JSON.stringify(defaults));
    ChangeFactory.frameId = frameId;
    ChangeFactory.frame = frame;
  });

  test('Généré un Drop Block', () => {
    const eventMessage : IMessage = {
      action : customEvents.DROP_FILE,
      selector: '#test',
      files : 'text.txt'
    };

    // On rajoute d'abord la partie du click du file dropzone
    const exceptedResult = ClickFactory.buildclickFileDropZoneBlock(eventMessage .selector);
    // On rajoute la partie acceptation du fichier
    const chooserFile = ChangeFactory.buildAcceptUploadFileChangeBlock(eventMessage .selector, eventMessage .files);

    exceptedResult.addLine(chooserFile.getLines()[0]);

    expect(
      DropFactory.generateBlock(
        eventMessage ,
        frameId,
        frame,
        defaults
      )
    ).toEqual(
      exceptedResult
    );
  });
});