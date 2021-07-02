import { WindowService } from './window-service';
import 'jest';
import * as chrome from 'sinon-chrome';

// Constant
import EVENT_MSG from '../../constants/events/events-message';

let message = '';

chrome.runtime.sendMessage.withArgs({control : EVENT_MSG.GET_CURRENT_URL, frameUrl : window.location.href }).callsFake(() => {
  message = 'is send url';
});

chrome.runtime.sendMessage.withArgs({control : EVENT_MSG.GET_VIEWPORT_SIZE, coordinates : { width : window.innerWidth, height : window.innerHeight } }).callsFake(() => {
  message = 'is send view port size';
});

const eventListener = function() {
  message = 'dispatchEvent';
};


const addEventListener = function() {
  message = 'addEvent';
};

describe('Test de Window Service', () => {

  beforeAll(() => {
    // mock chrome
    global.chrome = chrome;
  });

  test('Get current Url', () => {
    WindowService.getCurrentUrl({ control : EVENT_MSG.GET_CURRENT_URL });
    expect(message).toEqual('is send url');

  });


  test('Get View Port Size', () => {
    WindowService.getViewPortSize({ control : EVENT_MSG.GET_VIEWPORT_SIZE });
    expect(message).toEqual('is send view port size');
  });

  test('Reload page', () => {
    // Pour utiliser window.location.reload on doit redéfinir la fonction
    delete window.location;
    (window.location as any) = { reload : jest.fn() };

    WindowService.reload({ control : 'reload-page' });
    expect(window.location.reload).toHaveBeenCalled();
  });

  test('dispatch event', () => {

    window.addEventListener('dispatch', eventListener);
    WindowService.dispatchEvent(new CustomEvent('dispatch'));
    window.removeEventListener('dispatch', eventListener);
  });

  test('add event listener event', () => {

    WindowService.addEventListener('addListener', addEventListener);
    window.dispatchEvent(new CustomEvent('addListener'));

    expect(message).toEqual('addEvent');
    window.removeEventListener('addListener', addEventListener);
  });

  test('remove event listener event', () => {

    message = '';
    WindowService.addEventListener('removeListener', addEventListener);
    WindowService.removeEventListener('removeListener', addEventListener);
    window.dispatchEvent(new CustomEvent('removeListener'));

    expect(message).toBeDefined();
  });
});