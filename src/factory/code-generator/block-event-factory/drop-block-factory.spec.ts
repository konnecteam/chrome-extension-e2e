import { DropBlockFactory } from './drop-block-factory';
import { defaults } from '../../../constants/default-options';
import 'jest';
import actionEvents from '../../../constants/action-events';
import { ClickBlockFactory } from './click-block-factory';
import { ChangeBlockFactory } from './change-block-factory';

/** Frame définie pour les tests */
const frame = 'page';
const frameId = 0;

describe('Test de Drop Block Factory', () => {

  // Initialisation
  beforeAll(() => {

    ClickBlockFactory.options = JSON.parse(JSON.stringify(defaults));
    ClickBlockFactory.frameId = frameId;
    ClickBlockFactory.frame = frame;

    ChangeBlockFactory.options = JSON.parse(JSON.stringify(defaults));
    ChangeBlockFactory.frameId = frameId;
    ChangeBlockFactory.frame = frame;
  });

  test('Généré un Drop Block', () => {
    const eventModel  = {
      action : actionEvents.DROP_DROPZONE,
      selector: '#test',
      files : 'text.txt'
    };

    // On rajoute d'abord la partie du click du file drop zone
    const exceptedResult = ClickBlockFactory.buildclickFileDropZone(eventModel.selector);
    // On rajoute la partie acceptation du fichier
    const chooserFile = ChangeBlockFactory.buildAcceptUploadFileChange(eventModel.selector, eventModel.files);

    exceptedResult.addLine(chooserFile.getLines()[0]);

    expect(
      DropBlockFactory.generateBlock(
        eventModel,
        frameId,
        frame,
        defaults
      )
    ).toEqual(
      exceptedResult
    );
  });
});