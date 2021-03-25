import { IOption } from 'interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { DropFactory } from './drop-factory';
import { defaults } from '../../../constants/default-options';
import 'jest';
import customEvents from '../../../constants/events/events-custom';
import { ClickFactory } from './click-factory';
import { ChangeFactory } from './change-factory';

/** frame utilisée pour les tests */
let frame : string;
let frameId : number;
// options des tests
let options : IOption;

describe('Test de Drop Block Factory', () => {

  // Initialisation
  beforeAll(() => {

    options = JSON.parse(JSON.stringify(defaults));
    frameId = 0;
    frame = 'page';
  });

  test('Généré un Drop Block', () => {
    const eventMessage : IMessage = {
      action : customEvents.DROP_FILE,
      selector: '#test',
      files : 'text.txt'
    };

    // On rajoute d'abord la partie du click du file dropzone
    const exceptedResult = ClickFactory.buildclickFileDropZoneBlock(
      options,
      frameId,
      frame,
      eventMessage.selector
    );
    // On rajoute la partie acceptation du fichier
    const chooserFile = ChangeFactory.buildAcceptUploadFileChangeBlock(
      frameId,
      eventMessage.files
    );
    exceptedResult.addLine(chooserFile.getLines()[0]);

    expect(
      DropFactory.generateBlock(
        eventMessage,
        frameId,
        frame,
        defaults
      )
    ).toEqual(
      exceptedResult
    );
  });
});