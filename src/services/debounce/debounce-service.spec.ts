import { DebounceService } from './debounce-service';
import 'jest';

// Constant
import DOM_EVENT from '../../constants/events/events-dom';

describe('Test de Scroll Service', () => {
  beforeAll(() => {

    // on init le body
    document.body.innerHTML = `<div>
    <span id="username"> </span>
    <button id="button"> </button>
    <input id='input' type='text'> Label de test </input>
    <div id="DivTitle"> <h1> Titre </h1> </div>
    <textarea id='txtArea'> </textarea>
    </div>`;
  });

  test('Test de la fonction handleEvent', async () => {
    // On créé l'event qui sera catché
    const eventObject = {
      target  : document.getElementById('DivTitle'),
      type : DOM_EVENT.SCROLL,
      typeEvent : DOM_EVENT.SCROLL,
    };
    let eventCatch = null;

    // On ajoute un event listerner test
    window.addEventListener('test', DebounceService.debounce(e => {
      eventCatch = eventObject;
    }, 150), false);

    // On lance l'event
    window.dispatchEvent(new Event('test'));
    // On utilise un timeout pour attendre que le catch se fasse
    const pause = setTimeout(() => {
      expect(eventCatch).toEqual(eventObject);
      clearTimeout(pause);
    }, 250);
  });
});