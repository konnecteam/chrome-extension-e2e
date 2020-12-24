import { FileDropZoneComponent } from './../components/file-drop-zone-component';
import { DropEventComponents} from './drop-event-components';
import * as path from 'path';
import 'jest';
import { FileService } from '../../services/file/file-service';

/**
 * Met à jour le body
 * @param pathDoc
 */
async function changeBodyDocument(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await FileService.readFileAsync(pathFile);
  document.body.innerHTML = content;
}

describe('Test de drop event component', () => {

  test('Determiner drop d\'un FileDropZoneComponent', async () => {
    // on inti le body
    await changeBodyDocument('./../../../static/test/dom/dom-filedropzone.html');

    // On doit trouver un component file drop zine
    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');
    expect(
      DropEventComponents.determinateDropComponent(element as HTMLElement)
    ).toEqual(FileDropZoneComponent.isFileDropZone(element as HTMLElement));
  });
});