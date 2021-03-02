import { InputFilesComponent } from './../components/input-file-component';
import { InputNumericComponent } from '../konnect/input-numeric-component';
import { ChangeEventComponents} from './change-event-components';
import * as path from 'path';
import 'jest';
import { FileService } from '../../services/file/file-service';

/**
 * Path qui contient le body d'un input numeric
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-input-numeric.html');

describe('Test de change event component', () => {

  beforeAll(async () => {
    // On init le body
    const content = await FileService.readFileAsync(pathFile);

    document.body.innerHTML =
    `<div>
    <input id="inFile" type="file"> </input>
    </div>` + content;

  });

  test('Determiner change d\'un input file', () => {
    const element  = document.getElementById('inFile');

    // On doit trouver que l'on est sur un input file
    expect(
      ChangeEventComponents.determinateChangeComponent(element as HTMLInputElement)
    ).toEqual(InputFilesComponent.isInputFile(element as HTMLInputElement)
    );
  });


  test('Determiner change d\'un input numeric', () => {
    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');
    // On doit trouver que l'on est dans un input numeric
    expect(
      ChangeEventComponents.determinateChangeComponent(element as HTMLElement)
    ).toEqual(InputNumericComponent.isInputNumeric(element as HTMLElement)
    );
  });
});