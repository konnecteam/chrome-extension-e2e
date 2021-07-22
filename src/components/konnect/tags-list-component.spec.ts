import { ECustomEvent } from './../../enum/events/events-custom';
import { TagsListComponent } from '../../components/konnect/tags-list-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { EComponentName } from '../../enum/component/component-name';

/**
 * chemin du fichier html qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-tags-list.html');

describe('Test de TagsList', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement', () => {

    // Selecteur du l'inut qui est dans le tagslist
    const element = document.querySelector('input');

    // On doit trouver la RadioGroup
    expect(
       TagsListComponent.getElement(element).component
    ).toEqual(EComponentName.TAGS_LIST);
  });

  test('Test de editTagsListComponentMessage', () => {

    // Selecteur du l'inut qui est dans le tagslist
    const element = document.querySelector('input');

    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      action : 'change'
    };

    // On doit trouver l'action Click
    expect(
       TagsListComponent.
      editTagsListComponentMessage(eventCatched, TagsListComponent.getElement(element)).action
    ).toEqual(ECustomEvent.CHANGE_TAGS_LIST);
  });
});