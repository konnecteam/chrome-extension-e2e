import { ScrollService } from './scroll-service';
import 'jest';
import * as chrome from 'sinon-chrome';
import domEventsToRecord from '../../constants/events/events-dom';

let messageSend = '';
chrome.runtime.sendMessage.withArgs().callsFake(() => {
  messageSend = 'is send';
});

describe('Test de Scroll Service', () => {
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

  test('Test de la fonction handleEvent', () => {
    const eventObject = {
      target  : document.getElementById('DivTitle'),
      type : domEventsToRecord.SCROLL,
      typeEvent : domEventsToRecord.SCROLL,
    };
    ScrollService.Instance.handleEvent(eventObject);
    expect(messageSend).toBeDefined();
  });
});