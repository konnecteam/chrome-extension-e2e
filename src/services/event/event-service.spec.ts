import { IMessage } from 'interfaces/i-message';
import { EventService } from './event-service';
import 'jest';
import { ETagName } from '../../enum/elements/tag-name';
import { EDomEvent } from '../../enum/events/events-dom';

describe('Test du Event Service', () => {
  beforeAll(() => {
  });

  test('Test de la fonction contineEventTreatment pour 2 event catché en même temps', async () => {
    const previousEvent = {
      timeStamp : 10
    };

    const currentEvent = {
      timeStamp : 10
    };

    expect(EventService.continueEventTreatment(previousEvent, currentEvent, null)).toBeFalsy();
  });

  test('Test de la fonction contineEventTreatment pour un keydown dans un input password', async () => {
    const previousEvent = {
      timeStamp : 10
    };

    const currentEvent = {
      target : {
        type : 'password',
        tagName : ETagName.INPUT.toUpperCase()
      },
      type : EDomEvent.KEYDOWN,
      timeStamp : 50
    };

    expect(EventService.continueEventTreatment(previousEvent, currentEvent, null)).toBeFalsy();
  });

  test('Test de la fonction contineEventTreatment pour un click d\'input file', async () => {
    const previousEvent = {
      timeStamp : 10,
    };

    const currentEvent = {
      target : {
        type : 'file',
        tagName : ETagName.INPUT.toUpperCase()
      },
      type : EDomEvent.CLICK,
      timeStamp : 50
    };

    const previousMessage : IMessage = {
      action : EDomEvent.CLICK
    };

    expect(EventService.continueEventTreatment(previousEvent, currentEvent, previousMessage)).toBeFalsy();

  });


  test('Test de la fonction contineEventTreatment pour un event à traiter', async () => {
    const previousEvent = {
      timeStamp : 10,
    };

    const currentEvent = {
      target : {
        type : 'text',
        tagName : ETagName.INPUT.toUpperCase()
      },
      type : EDomEvent.CLICK,
      timeStamp : 50,
    };

    expect(EventService.continueEventTreatment(previousEvent, currentEvent, null)).toBeTruthy();

  });

  test('Test de la fonction valueEvent pour un change de password', async () => {

    const currentEvent = {
      target : {
        type : 'password',
        tagName : ETagName.INPUT.toUpperCase()
      },
      type : EDomEvent.CHANGE,
      timeStamp : 50
    };

    expect(EventService.valueEvent(currentEvent)).toBeDefined();
  });

  test('Test de la fonction valueEvent pour un change de password', async () => {

    const currentEvent = {
      target : {
        type : 'text',
        tagName : ETagName.INPUT.toUpperCase()
      },
      type : EDomEvent.CHANGE,
      timeStamp : 50
    };

    expect(EventService.valueEvent(currentEvent)).toEqual('');
  });


  test('Test de la fonction selectorEvent pour un input file ', async () => {

    const currentEvent = {
      target : {
        type : 'file',
        tagName : ETagName.INPUT.toUpperCase()
      },
      type : EDomEvent.CHANGE,
      timeStamp : 50
    };
    const previousEvent = 'input file';
    expect(EventService.selectorEvent(currentEvent, previousEvent)).toEqual(previousEvent);
  });

  test('Test de la fonction selectorEvent pour un event lambda ', async () => {

    document.body.innerHTML = '<button id="button"> </button>';
    const currentEvent = {
      target : document.getElementById('button'),
      type : EDomEvent.CLICK,
      timeStamp : 50
    };
    const previousEvent = 'input file';
    expect(EventService.selectorEvent(currentEvent, previousEvent)).toEqual('#button');
  });

  test('Test de la fonction comments pour un selector qui récupère 2 élément  ', async () => {

    document.body.innerHTML = '<button id="button"> </button><button id="button"> </button>';
    expect(EventService.commentsEvent('#button')).toBeDefined();
  });

  test('Test de la fonction comments pour un selector unique', async () => {

    document.body.innerHTML = '<button id="button"> </button>';
    expect(EventService.commentsEvent('#button')).toEqual('');
  });

  test('Test de message event', async () => {
    document.body.innerHTML = '<button id="button"> </button>';
    const currentEvent = {
      target : document.getElementById('button'),
      type : EDomEvent.CLICK,
      timeStamp : 50,
      href : 'local'
    };
    expect(EventService.messageEvent(currentEvent, '#button', null, null, null, null)).toBeDefined();
  });
});