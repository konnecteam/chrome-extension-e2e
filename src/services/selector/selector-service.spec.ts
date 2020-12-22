import { SelectorService } from './selector-service';
import 'jest';

describe('Test de Selector Service', () => {

  beforeAll(() => {
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

    (window as any).saveBody = document.cloneNode(true);

  });

  test('Test de find sur un élément sans id', () => {

    const elementToFind = document.querySelector('h1');
    const exceptedResult = 'body > div > #DivTitle > h1';

    expect(
      SelectorService.find(elementToFind)
    ).toEqual(exceptedResult);
  });

  test('Test de find sur un élément avec un id', () => {

    const elementToFind : HTMLElement = document.querySelector('#button');
    const exceptedResult = '#button';

    expect(
      SelectorService.find(elementToFind)
    ).toEqual(exceptedResult);
  });

  test('Test de find sur un element supprimé du dom', () => {

    const elementToFind : HTMLElement = document.querySelector('#button');
    elementToFind.parentNode.removeChild(elementToFind);

    const exceptedResult = '#button';
    expect(
      SelectorService.find(elementToFind)
    ).toEqual(exceptedResult);
  });


  test('Test de manageSpecialCase', () => {

    expect(
      SelectorService.manageSpecialCase('href.bind')
    ).toEqual('href');
  });

  test('Test de standardizeSelector', () => {

    expect(
      SelectorService.standardizeSelector('input[value\\\.bind]:test')
    ).toEqual('input[value\\\\.bind]\\:test');
  });

  test('Test de findSelectorIframeElement', () => {

    const elementToFind  = document.querySelector('iframe').contentWindow.document.querySelector('h1');
    const exceptedResult = 'body > iframe';

    expect(
      SelectorService.findSelectorIframeElement(elementToFind)
    ).toEqual(exceptedResult);
  });
});