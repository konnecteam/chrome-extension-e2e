import { ElementService } from './element-service';
import 'jest';
import * as path from 'path';
import { FileService } from '../../services/file/file-service';
import { KListComponent } from '../../components/konnect/k-list-component';
import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import { KSelectComponent } from '../../components/konnect/k-select-component';
import { KmSwitchComponent } from '../../components/konnect/km-switch- component';
import { IframeComponent } from '../../components/konnect/iframe-component';
import { InputFilesComponent } from '../../components/components/input-file-component';
import { InputNumericComponent } from '../../components/konnect/input-numeric-component';


const FILE_DROP_ZONE_PATH = './../../../static/test/dom/dom-filedropzone.html';
const K_SELECT_PATH = './../../../static/test/dom/dom-k-select.html';
const KM_SWITCH_PATH = './../../../static/test/dom/dom-km-switch.html';
const K_LIST_PATH = './../../../static/test/dom/dom-k-list.html';
const INPUT_NUMERIC = './../../../static/test/dom/dom-input-numeric.html';

/**
 * Permet de changer le contenu du body
 * @param pathDoc
 */
async function changeBodyDocumentAsync(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await FileService.readFileAsync(pathFile);
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

  test('Test de la fonction IsIniframeElement', () => {

    // Ajout d'une iframe
    const iframe = document.createElement('iframe');
    const iframeContent = '<body> <h1> IFRAME </h1> </body>';
    document.body.appendChild(iframe);
    const docIframe = document.querySelector('iframe').contentWindow.document;
    docIframe.open();
    docIframe.write(iframeContent);
    docIframe.close();

    expect(ElementService.isInIframeElement(docIframe.body)).toBeDefined();
  });

  test('Test de la fonction getInputNumericElement', async () => {

    await changeBodyDocumentAsync(INPUT_NUMERIC);

    expect(
      ElementService.getInputNumericElement(
        document.querySelector('INPUT[data-role]')))
    .toBeDefined();
  });


  test('Test de la fonction isNumericElement', async () => {

    await changeBodyDocumentAsync(INPUT_NUMERIC);

    expect(
      ElementService.isNumericElement(
        document.querySelector('numeric')))
    .toBeDefined();
  });


  test('Test de la fonction findListComponent', async () => {

    await changeBodyDocumentAsync(K_LIST_PATH);

    expect(
      ElementService.findListComponent(
        document.querySelector('konnect-dropdownlist'), 'Dropdown'))
    .toBeDefined();
  });

  test('Test de la fonction isUlListElement', async () => {

    await changeBodyDocumentAsync(K_LIST_PATH);

    expect(
      ElementService.isUlListElement(
        document.querySelector('LI[data-offset-index="27"]')))
    .toBeDefined();
  });

  test('Test de la fonction isInputKList', async () => {

    await changeBodyDocumentAsync(K_LIST_PATH);

    expect(
      ElementService.isInputKList(
        document.querySelector('INPUT[role="listbox"]')))
    .toBeDefined();
  });

  test('Test de la fonction getKSelectElement', async () => {

    await changeBodyDocumentAsync(K_SELECT_PATH);

    expect(
      ElementService.getKSelectElement(
        document.querySelector('.k-select')))
    .toBeDefined();
  });

  test('Test de la fonction getKmSwitchElement', async () => {

    await changeBodyDocumentAsync(KM_SWITCH_PATH);

    expect(
      ElementService.getKmSwitchElement(
        document.querySelector('.km-switch-handle')))
    .toBeDefined();
  });

  test('Test de la fonction findKmSwitchElement', async () => {

    await changeBodyDocumentAsync(KM_SWITCH_PATH);

    expect(
      ElementService.findKmSwitchElement(
        document.querySelector('.km-switch-container')))
    .toBeDefined();
  });
});

describe('Test du determinate click event', () => {
  test('Determiner click d\'un FileDropZoneComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(FILE_DROP_ZONE_PATH);

    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');

    // On doit trouver que l'on est dans un file dropzone
    expect(
      ElementService.determinateClickComponent(
        element as HTMLElement,
        null
      )
    ).toEqual(FileDropZoneComponent.getFileDropZone(element as HTMLElement));
  });


  test('Determiner click d\'un KSelectComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(K_SELECT_PATH);

    const elementSelector = 'span > span > span > span\:nth-child(1) > span';
    const element = document.querySelector(elementSelector);

    // on doit trouver un component model de k selct
    expect(
      ElementService.determinateClickComponent(
        element as HTMLElement,
        null
      )
    ).toEqual(KSelectComponent.getKSelect(element as HTMLElement));

  });

  test('Determiner click d\'un KmSwitchComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(KM_SWITCH_PATH);

    const elementSelector = 'switch > div > span > span:nth-child(3) > span';
    const element = document.querySelector(elementSelector);

    // on doit trouver le component model d'un km switch
    expect(
      ElementService.determinateClickComponent(
        element as HTMLElement,
        null
      )
    ).toEqual(KmSwitchComponent.getKmSwitch(element as HTMLElement));
  });

  test('Determiner click d\'un KListComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync(K_LIST_PATH);

    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = 'konnect-dropdownlist';

    const previousElement  = {
      selector : previousSelector,
      typeList : 'Dropdown',
      element: document.querySelector(previousSelector)
    };

    // On doit trouver un component model qui fait référence à une k list
    expect(
      ElementService.determinateClickComponent(
        element as HTMLElement,
        previousElement
      )
    ).toEqual(KListComponent.getKList(element as HTMLElement, previousElement));

  });
});

describe('Test de determinate drop event', () => {

  test('Determiner drop d\'un FileDropZoneComponent', async () => {
    // on init le body
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-filedropzone.html');

    // On doit trouver un component file dropzone
    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');
    expect(
      ElementService.determinateDropComponent(element as HTMLElement)
    ).toEqual(FileDropZoneComponent.getFileDropZone(element as HTMLElement));
  });
});

describe('Test de determinate keydown event', () => {

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
    expect(
      ElementService.determinateKeydownComponent(element)
    ).toEqual(IframeComponent.getIframe(element));
  });
});

describe('Test du determinate change event', () => {

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
    expect(
      ElementService.determinateChangeComponent(element as HTMLInputElement)
    ).toEqual(InputFilesComponent.getInputFile(element as HTMLInputElement)
    );
  });


  test('Determiner change d\'un input numeric', () => {
    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');
    // On doit trouver que l'on est dans un input numeric
    expect(
      ElementService.determinateChangeComponent(element as HTMLElement)
    ).toEqual(InputNumericComponent.getInputNumeric(element as HTMLElement)
    );
  });
});