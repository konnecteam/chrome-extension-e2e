import 'jest';
import { KeydownEventComponent } from './keydown-event-component';
import { IframeComponent } from '../components/iframe-component';


describe('Test de keydown event component', () => {

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
      KeydownEventComponent.determinateKeydownComponent(element)
    ).toEqual(IframeComponent.isIframe(element));
  });
});