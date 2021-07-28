import { TagsListComponent } from '../../components/konnect/tags-list-component';
import { PopoverComponent } from './../../components/konnect/popover-component';
import { ElementService } from './element-service';
import 'jest';
import * as path from 'path';
import { FileService } from '../../services/file/file-service';
import { InputListComponent } from '../../components/konnect/input-list-component';
import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import { KSelectComponent } from '../../components/konnect/k-select-component';
import { KmSwitchComponent } from '../../components/konnect/km-switch- component';
import { IframeComponent } from '../../components/konnect/iframe-component';
import { InputFilesComponent } from '../../components/components/input-file-component';
import { InputNumericComponent } from '../../components/konnect/input-numeric-component';
import { ETagName } from '../../enum/elements/tag-name';

const FILE_DROP_ZONE_PATH = '/static/test/dom/dom-filedropzone.html';
const K_SELECT_PATH = '/static/test/dom/dom-k-select.html';
const KM_SWITCH_PATH = '/static/test/dom/dom-km-switch.html';
const INPUT_LIST_PATH = '/static/test/dom/dom-input-list.html';
const POPOVER_PATH = '/static/test/dom/dom-popover.html';
const INPUT_NUMERIC = '/static/test/dom/dom-input-numeric.html';
const TAGS_LIST = '/static/test/dom/dom-tags-list.html';
/**
 * Selecteurs
 */
const FILE_DROP_ZONE_SELECTOR = 'div > file-dropzone > div > div > span\:nth-child(3)';
const INPUT_NUMERIC_SELECTOR = 'numeric > div > span > span > input\:nth-child(2)';
const K_SELECT_SELETOR = 'span > span > span > span\:nth-child(1) > span';
const INPUT_LIST = 'input';
const POPOVER = '.konnect-popover-content-margin-neg';
const KM_SWITCH_SELECTOR = 'switch > div > span > span:nth-child(3) > span';
const KM_SWITCH_HANDLE = '.km-switch-handle';

/**
 * Permet de changer le contenu du body
 */
async function changeBodyDocumentAsync(pathDoc : string) {
  const PATH_DOM = path.join(__dirname, `/../../..${pathDoc}` );

  const content = await FileService.readFileAsync(PATH_DOM);
  document.body.innerHTML = content;
}

describe('Test des méthodes de recherche d\'element du Element Service', () => {

  // On initialise le contenu de document.body
  beforeAll(() => {
    document.body.innerHTML =
    '<div>' +
    '  <span id="username" />' +
    '  <button id="button" />' +
    '  <label> Label de test </label>' +
    '  <div id="DivTitle"> <h1> Titre </h1> </div>' +
    '</div>';
  });

  test('Test de la fonction findParentElementWithTagName', () => {

    // Point d'entrée de la recherche
    const startResearchElement : HTMLElement = document.querySelector('div > h1');

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementService.findParentElementWithTagName(
        startResearchElement,
        'DIV'
      ).innerHTML
    ).toEqual(exceptedResult);

  });

  test('Test de la fonction findParentElementWithTagNameAndAttribute', () => {

    const startResearchElement : HTMLElement = document.querySelector('div > h1');

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementService.findParentElementWithTagNameAndAttribute(
        startResearchElement,
        'DIV',
        'id'
      ).innerHTML
    ).toEqual(exceptedResult);

  });

  test('Test de la fonction findParentElementWithTagNameAndValueAttribute', () => {

    const startResearchElement : HTMLElement = document.querySelector('div > h1');

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementService.findParentElementWithTagNameAndValueAttribute(
        startResearchElement,
        'DIV',
        'id',
        'DivTitle'
      ).innerHTML
    ).toEqual(exceptedResult);

  });

  test('Test de la fonction findElementChildWithTagNameAndAttribute', () => {

    const startResearchElement : HTMLElement = document.querySelector('div');

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementService.findElementChildWithTagNameAndAttribute(
        startResearchElement,
        'DIV',
        'id'
      ).innerHTML
    ).toEqual(exceptedResult);

  });

  test('Test de la fonction findElementWithSelectorAndAttribute', () => {

    const startResearchElementSelector : string = 'div > h1';

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementService.findElementWithSelectorAndAttribute(
        startResearchElementSelector,
        'id'
      ).innerHTML
    ).toEqual(exceptedResult);

  });

  test('Test de la fonction findElementChildWithSelector', () => {

    const startResearchElement : HTMLElement = document.querySelector('div');

    const exceptedResult : string  = document.querySelector('div > h1').innerHTML;
    expect(
      ElementService.findElementChildWithSelector(
        startResearchElement,
        'div > h1'
      ).innerHTML
    ).toEqual(exceptedResult);

  });

  test('Test de la fonction getIframeElement', () => {

    // Ajout d'une iframe
    const iframe = document.createElement('iframe');
    const iframeContent = '<body> <h1> IFRAME </h1> </body>';
    document.body.appendChild(iframe);
    const docIframe = document.querySelector('iframe').contentWindow.document;
    docIframe.open();
    docIframe.write(iframeContent);
    docIframe.close();

    expect(ElementService.getIframeElement(docIframe.body)).toBeDefined();
  });

  test('Test de la fonction getInputNumericElement', async () => {

    await changeBodyDocumentAsync(INPUT_NUMERIC);

    expect(ElementService.getInputNumericElement(document.querySelector('INPUT[data-role]')))
    .toBeDefined();

  });


  test('Test de la fonction getNumericElement', async () => {

    await changeBodyDocumentAsync(INPUT_NUMERIC);

    expect(ElementService.getNumericElement(document.querySelector(ETagName.NUMERIC)))
    .toBeDefined();

  });

  test('Test de la fonction getInputList', async () => {

    await changeBodyDocumentAsync(INPUT_LIST_PATH);

    expect(ElementService.getInputList(document.querySelector('INPUT[role="listbox"]')))
    .toBeDefined();

  });


  test('Test de la fonction getPopover', async () => {

    await changeBodyDocumentAsync(POPOVER_PATH);

    expect(ElementService.getPopover(document.querySelector(POPOVER)))
    .toBeDefined();

  });

  test('Test de la fonction getTagsList', async () => {

    await changeBodyDocumentAsync(TAGS_LIST);

    expect(ElementService.getTagsList(document.querySelector(ETagName.TAGS_LIST)))
    .toBeDefined();

  });

  test('Test de la fonction getKSelectElement', async () => {

    await changeBodyDocumentAsync(K_SELECT_PATH);

    expect(ElementService.getKSelectElement(document.querySelector(K_SELECT_SELETOR)))
    .toBeDefined();

  });

  test('Test de la fonction getKmSwitchElement', async () => {

    await changeBodyDocumentAsync(KM_SWITCH_PATH);

    expect(ElementService.getKmSwitchElement(document.querySelector(KM_SWITCH_HANDLE)))
    .toBeDefined();

  });
});

describe('Test du get click event', () => {
  test('Determiner click d\'un FileDropZoneComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(FILE_DROP_ZONE_PATH);

    const element = document.querySelector(FILE_DROP_ZONE_SELECTOR);

    // On doit trouver que l'on est dans un file dropzone
    expect(ElementService.getClickComponent(element as HTMLElement))
    .toEqual(FileDropZoneComponent.getElement(element as HTMLElement));

  });


  test('Determiner click d\'un KSelectComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(K_SELECT_PATH);

    const element = document.querySelector(K_SELECT_SELETOR);

    // on doit trouver un component model de k selct
    expect(ElementService.getClickComponent(element as HTMLElement))
    .toEqual(KSelectComponent.getElement(element as HTMLElement));

  });

  test('Determiner click d\'un KmSwitchComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(KM_SWITCH_PATH);

    const element = document.querySelector(KM_SWITCH_SELECTOR);

    // on doit trouver le component model d'un km switch
    expect(ElementService.getClickComponent(element as HTMLElement))
    .toEqual(KmSwitchComponent.getElement(element as HTMLElement));

  });

  test('Determiner click dans un input list', async () => {
    // on init le body
    await changeBodyDocumentAsync(INPUT_LIST_PATH);

    const element = document.querySelector(INPUT_LIST);

    // On doit trouver un component model qui fait référence à une k list
    expect(ElementService.getClickComponent(element))
    .toEqual(InputListComponent.getElement(element));

  });

  test('Determiner click dans un popover', async () => {
    // on init le body
    await changeBodyDocumentAsync(POPOVER_PATH);

    const element : HTMLElement = document.querySelector(POPOVER);

    // On doit trouver un component model qui fait référence à une k list
    expect(ElementService.getClickComponent(element))
    .toEqual(PopoverComponent.getElement(element));

  });
});

describe('Test de get drop event', () => {

  test('Determiner drop d\'un FileDropZoneComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(FILE_DROP_ZONE_PATH);

    // On doit trouver un component file dropzone
    const element = document.querySelector(FILE_DROP_ZONE_SELECTOR);
    expect(ElementService.getDropComponent(element as HTMLElement))
    .toEqual(FileDropZoneComponent.getElement(element as HTMLElement));

  });
});

describe('Test de get keydown event', () => {

  beforeAll(() => {
    // on init un body pour le test
    document.body.innerHTML =
      `<div>
    <span id="username"> </span>
    <button id="button"> </button>
    <label> Label de test </label>
    <div id="DivTitle"> <h1> Titre </h1> </div>
   </div>`;

    // Ajout d'une iframe
    const iframe = document.createElement('iframe');
    const iframeContent = '<body> <h1> IFRAME </h1> </body>';
    document.body.appendChild(iframe);

    const docIframe = document.querySelector('iframe').contentWindow.document;
    docIframe.open();
    docIframe.write(iframeContent);
    docIframe.close();
    // on fait une save du body
    (window as any).saveBody = document.cloneNode(true);
  });

  test('Determiner drop d\'un IframeComponent', async () => {

    const element = document.querySelector('iframe').contentWindow.document.querySelector('h1');
    // on doit trouver un component iframe
    expect(ElementService.getKeydownComponent(element))
    .toEqual(IframeComponent.getElement(element));

  });
});

describe('Test du get change event', () => {

  beforeAll(async () => {
    // On init le body
    await changeBodyDocumentAsync(INPUT_NUMERIC);
    document.body.innerHTML +=
    `<div>
    <input id="inFile" type="file"> </input>
    </div>`;
  });

  test('Determiner change d\'un input file', () => {
    const element  = document.getElementById('inFile');

    // On doit trouver que l'on est sur un input file
    expect(ElementService.getChangeComponent(element as HTMLInputElement))
    .toEqual(InputFilesComponent.getElement(element as HTMLInputElement));

  });


  test('Determiner change d\'un input numeric', () => {
    const element = document.querySelector(INPUT_NUMERIC_SELECTOR);
    // On doit trouver que l'on est dans un input numeric
    expect(ElementService.getChangeComponent(element as HTMLElement))
    .toEqual(InputNumericComponent.getElement(element as HTMLElement));

  });


  test('Determiner change d\'un tags list', async() => {

    await changeBodyDocumentAsync(TAGS_LIST);

    const element = document.querySelector(ETagName.TAGS_LIST);
    // On doit trouver que l'on est dans un input numeric
    expect(ElementService.getChangeComponent(element as HTMLElement))
    .toEqual(TagsListComponent.getElement(element as HTMLElement));

  });

});