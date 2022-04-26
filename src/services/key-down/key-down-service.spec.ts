import { IMessage } from '../../interfaces/i-message';
import 'jest';
import * as chrome from 'sinon-chrome';
import { KeyDownService } from './key-down-service';

let messageSend = '';
chrome.runtime.sendMessage.withArgs().callsFake(() => {
  messageSend = 'is send';
});

const keyDownService = KeyDownService.Instance;
describe('Test de Keydown Service', () => {

  beforeAll(() => {

    // mock chrome
    global.chrome = chrome;

    // on init le body
    document.body.innerHTML = `<div>
    <span id="username"> </span>
    <button id="button"> </button>
    <input id='input' type='text'> Label de test </input>
    <div id="DivTitle"> <h1> Titre </h1> </div>
    <textarea id='txtArea'> </textarea>
    </div>`;
  });

  test('Test de handle event avec un event keydown', () => {
    messageSend  = '';
    const element = document.getElementById('txtArea');

    const msg : IMessage = {
      selector : '.txtArea',
      tagName : 'textarea',
      action : 'keydown',
      typeEvent : 'keydown',
      key : 'k',
      scrollY : window.pageYOffset,
      scrollX : window.pageXOffset
    };
    keyDownService.handleEvent(msg, element);
    /*
     le handle n'a pas provoqué de sendmessage
     donc message send est plus vide
    */
    expect(
      messageSend
    ).toBeDefined();
  });

  test('Test de handle event avec un event autre que keydown', () => {
    messageSend = '';
    const element = document.getElementById('input');

    const msg : IMessage = {
      selector : '.input',
      tagName : 'input',
      action : 'change',
      typeEvent : 'change',
      value : 'test',
      scrollY : window.pageYOffset,
      scrollX : window.pageXOffset
    };
    keyDownService.handleEvent(msg, element);
    /*
     le handle a  provoqué un sendmessage
     car l'action a changé donc c'est qu'on a fini
     de faire des keydown
     donc message send à une value
    */
    expect(
      messageSend
    ).toEqual('is send');
  });

  // tslint:disable-next-line: no-identical-functions
  test('Test de handle event keydown sur un input', () => {
    messageSend = '';
    const element = document.getElementById('input');

    const msg : IMessage = {
      selector : '.input',
      tagName : 'input',
      action : 'keydown',
      typeEvent : 'keydown',
      key : 't',
      scrollY : window.pageYOffset,
      scrollX : window.pageXOffset
    };
    keyDownService.handleEvent(msg, element);
    /*
     le handle n'a pas provoqué de sendmessage
     car on se préocupe pas de keydown d'input
     donc message send vide
    */
    expect(
      messageSend
    ).toEqual('');
  });

  test('Test de get Coordinates avec un mousedown ', () => {

    const event = {
      type : 'mouseup',
      clientX : 15,
      clientY : 30
    };

    expect(keyDownService.getClickCoordinates(event)
    ).toEqual({ x : event.clientX, y : event.clientY });
  });

  test('Test de get Coordinates avec un event non prise en charge ', () => {
    const event = {
      type : 'click'
    };

    expect(keyDownService.getClickCoordinates(event)
    ).toBeNull();
  });

});