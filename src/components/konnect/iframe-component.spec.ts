import { IframeComponent } from './iframe-component';
import 'jest';
import { IComponent } from 'interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';

// Constant
import COMPONENT from '../../constants/component-name';

/**
 * Selecteurs
 */
const IFRAME_SELECTOR = 'iframe';

describe('Test de Iframe Component', () => {

  beforeAll(() => {

    // On créé un body pour tester une iframe
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

    const docIframe = document.querySelector(IFRAME_SELECTOR).contentWindow.document;
    docIframe.open();
    docIframe.write(iframeContent);
    docIframe.close();

    // On fait une sauvegarde du document
    (window as any).saveBody = document.cloneNode(true);

  });

  test('Test de getElement', () => {

    // on selectionne le titre qui ce trouve dans l'iframe
    const element  = document.querySelector(IFRAME_SELECTOR).contentWindow.document.querySelector('h1');

    // On doit trouver que c'est une iframe
    expect(
      IframeComponent.getElement(element).component
    ).toEqual(COMPONENT.IFRAME);
  });

  test('Test de editIframeComponentMessage', () => {
    // Event model qui contient les infos utiles
    const eventCatched : IMessage = {
      selector : 'selector'
    };
    // On selectionne l'iframe
    const element  = document.querySelector(IFRAME_SELECTOR);

    const component : IComponent = {
      element,
      component : 'iframe'
    };

    // On doit avoir la propriété iframe
    expect(
      IframeComponent.editIframeComponentMessage(eventCatched, component).iframe
    ).toBeDefined();
  });
});
