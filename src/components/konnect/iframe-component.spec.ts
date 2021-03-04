import { IframeComponent } from './iframe-component';
import 'jest';
import { IComponent } from 'interfaces/i-component';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
const fs = require('fs');

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

    const docIframe = document.querySelector('iframe').contentWindow.document;
    docIframe.open();
    docIframe.write(iframeContent);
    docIframe.close();

    // On fait une sauvegarde du document
    (window as any).saveBody = document.cloneNode(true);

  });

  test('Test de isIframe', () => {

    // on selectionne le titre qui ce trouve dans l'iframe
    const element  = document.querySelector('iframe').contentWindow.document.querySelector('h1');

    // On doit trouver que c'est une iframe
    expect(
      IframeComponent.isIframe(element).component
    ).toEqual(componentName.IFRAME);
  });

  test('Test de editIframeMessage', () => {
    // Event model qui contient les infos utiles
    const eventCatched : IMessage = {
      selector: 'selector'
    };
    // On selectionne l'iframe
    const element  = document.querySelector('iframe');

    const component : IComponent = {
      element,
      component : 'iframe'
    };

    // On doit avoir la propriété iframe
    expect(
      IframeComponent.editIframeMessage(eventCatched, component).iframe
    ).toBeDefined();
  });
});
