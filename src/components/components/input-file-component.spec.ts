import { InputFilesComponent } from './input-file-component';
import 'jest';
import { EventModel } from '../../models/event-model';

describe('Test de input file Component', () => {

  beforeAll(async() => {
    // On initialise le body
    document.body.innerHTML =
    `<div>
    <input id="inFile" type="file"> </input>
   </div>`;
  });

  test('Test de isInputFile pour un input sans files', () => {

    // On selectione l'input file
    const element  = document.getElementById('inFile') as HTMLInputElement;

    // On doit trouver null car l'input file n'as pas de fichier (files)
    expect(
      InputFilesComponent.isInputFile(element)
    ).toBeNull();
  });


  test('Test de editInputFileMessage pour un input sans files', () => {

    const element  = document.getElementById('inFile') as HTMLInputElement;

    const event : EventModel = {
      selector : '#id'
    };

    /* On doit trouver un files defined mais vide
     *  car la propriété file de l'input est vide
     */
    expect(
      InputFilesComponent.editInputFileMessage(event, element.files).files
    ).toBeDefined();
  });
});