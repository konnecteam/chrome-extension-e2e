import { ElementFinderService } from './element-finder-service';
import 'jest';

describe('Test de Element Finder Service', () => {

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
      ElementFinderService.findParentElementWithTagName(
        startResearchElement,
        'DIV',
        2
      ).innerHTML
    ).toEqual(exceptedResult);
  });

  test('Test de la fonction findParentElementWithTagNameAndAttribute', () => {

    const startResearchElement : HTMLElement = document.querySelector('div > h1');

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementFinderService.findParentElementWithTagNameAndAttribute(
        startResearchElement,
        'DIV',
        'id',
        2
      ).innerHTML
    ).toEqual(exceptedResult);
  });

  test('Test de la fonction findParentElementWithTagNameAndValueAttribute', () => {

    const startResearchElement : HTMLElement = document.querySelector('div > h1');

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementFinderService.findParentElementWithTagNameAndValueAttribute(
        startResearchElement,
        'DIV',
        'id',
        'DivTitle',
        2
      ).innerHTML
    ).toEqual(exceptedResult);
  });

  test('Test de la fonction findElementChildWithTagNameAndAttribute', () => {

    const startResearchElement : HTMLElement = document.querySelector('div');

    const exceptedResult : string  = document.querySelectorAll('div')[1].innerHTML;
    expect(
      ElementFinderService.findElementChildWithTagNameAndAttribute(
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
      ElementFinderService.findElementWithSelectorAndAttribute(
        startResearchElementSelector,
        'id',
        2
      ).innerHTML
    ).toEqual(exceptedResult);
  });

  test('Test de la fonction findElementChildWithSelector', () => {

    const startResearchElement : HTMLElement = document.querySelector('div');

    const exceptedResult : string  = document.querySelector('div > h1').innerHTML;
    expect(
      ElementFinderService.findElementChildWithSelector(
        startResearchElement,
        'div > h1'
      ).innerHTML
    ).toEqual(exceptedResult);
  });
});