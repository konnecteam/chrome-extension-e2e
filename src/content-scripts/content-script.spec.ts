import { IMessage } from '../interfaces/i-message';
import 'jest';
import * as puppeteer from 'puppeteer';
import { startServer } from '../test/page-test/server';
import { launchPuppeteerWithExtension } from '../test/launch-puppeteer/launch-puppeteer';
import * as chrome from 'sinon-chrome';
import { Server } from 'http';
import { IOption } from '../interfaces/i-options';

// Constant
import { EEventMessage } from '../enum/events/events-message';

let server : Server;
let browser : puppeteer.Browser;
let page : puppeteer.Page;


/**
 * Options
 */
const defaultOptions : IOption = {
  wrapAsync : true,
  headless : false,
  waitForNavigation : true,
  waitForSelectorOnClick : true,
  blankLinesBetweenBlocks : true,
  dataAttribute : '',
  useRegexForDataAttribute : false,
  customLineAfterClick : '',
  recordHttpRequest : true,
  regexHTTPrequest : '',
  customLinesBeforeEvent : `await page.evaluate(async() => {
    await konnect.engineStateService.Instance.waitForAsync(1);
  });`,
  deleteSiteData : true,
};

/**
 * Selecteurs
 */
const INPUT_TEXT_ID = '#inputText';

/**
 * Permet de lancer un dispatch event sur la window
 */
async function dispatchEventAsync(event : string, message : IMessage) : Promise<void> {
  return page.evaluate(ev => {
    const customEvent = new CustomEvent(ev.event);
    Object.assign(customEvent, ev.message);

    window.dispatchEvent(customEvent);
  }, { event, message });
}

/**
 * Permet de récupérer la liste des events record
 */
async function getEvensRecordAsync() : Promise<any[]> {
  return page.evaluate(() => {
    return (window as any).events;
  });
}

/**
 * Permet d'attendre que le content script soit prết pour enregistrer
 */
async function waitContentScriptReadyAsync() : Promise<string> {
  return page.evaluate(async () => {
    return (window as any).waitRecordReady;
  });
}

describe('Test Content script ', () => {

  // Start test server
  beforeAll(async () => {
    // On démarre le serveur de test
    server = await startServer();
    browser = await launchPuppeteerWithExtension(puppeteer);

    // On lance puppeteer et on met en place la page pour les tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    await page.evaluate(browserOption => {

      // On donne l'api chrome à la window
      window.chrome = browserOption.chrome;
      // On set les options dans le local storage de la window car on est pas dans le plugin
      window.localStorage.setItem('options', JSON.stringify({ options : { code : browserOption.options } }));

      // On overwrite la foncion pour lui donner l'url de polly js
      window.chrome.runtime.getURL = () => 'build/lib/scripts/polly/polly.js';

      // On overwrite pour adapter le get au local storage
      window.chrome.storage.local.get = (key, callback?) => {
        callback(JSON.parse(window.localStorage.getItem(key[0])));
        return browserOption.options;
      };

      // Variable qui permet de savoir si le recorder est prêt
      (window as any).recorderReady = false;

      // Variable qui va permettre de savoir si le content script est prêt
      (window as any).waitRecordReady = new Promise((resolve, reject) => {
        // On verifie si c'est fini toutes les 100Ms
        const verif = setInterval(() => {
          // si on est ready, on clear
          if ((window as any).recorderReady) {
            clearInterval(verif);
            resolve('good');
          }
        }, 100);
      });

      // On overwrite le set pour set dans local storage pour les tests
      window.chrome.storage.local.set = (async valueTOsave => {
        const key = Object.keys(valueTOsave)[0];
        const value = valueTOsave[key];
        window.localStorage.setItem(key, JSON.stringify(value));
      });

      (window as any).events = [];
      // On overwrite sendMessage pour sauvegarder les events catchés
      window.chrome.runtime.sendMessage = (async event => {
        // Si le recorder est prêt alors on resolve pour continuer les tests
        if (event.control && event.control === 'event-recorder-started') {
          (window as any).recorderReady = true;
        }
        (window as any).events.push(event);
      });

      // On overwrite le onMessage pour utiliser le event listener de la window pour les tests
      chrome.runtime.onMessage.addListener = fct => {
        window.addEventListener('OnMessage', fct);
      };

    }, { chrome, options : defaultOptions });

    // On ajoute le content script dans la page
    await page.evaluate(scriptText => {
      const el = document.createElement('script');
      el.src = scriptText;
      document.body.parentElement.appendChild(el);
    }, 'build/content-script.js');
  }, 50000);

  // Close Server
  afterAll(async () => {

    await page.close();
    await browser.close();
    server.close();
  }, 50000);

  test('Test de record d\'un click', async () => {

    await waitContentScriptReadyAsync();

    await page.click(INPUT_TEXT_ID);

    // On récupère la liste d'event
    const events = await getEvensRecordAsync();

    // Le dernier event doit contenir le selecteur de l'input
    expect(events[events.length - 1].selector).toEqual(INPUT_TEXT_ID);
  });

  test('Test de récupération d\'un user event', async () => {
    /**
     * On dispatch un event car
     * le content script
     * recoit un message
     * du background
     * pour la récupération de l'url
     */

    await waitContentScriptReadyAsync();

    await dispatchEventAsync('OnMessage', { control : EEventMessage.GET_CURRENT_URL });

    // On récupère la liste des events
    const events = await getEvensRecordAsync();
    // Le dernier event doit avoir un un frameUrl
    expect(events[events.length - 1].frameUrl).toBeDefined();

  });

  test('Test de récupération de viewport', async () => {
    /**
     * On dispatch un event car
     * le content script
     * recoit un message
     * du background
     * pour le viewport
     */
    await waitContentScriptReadyAsync();

    await dispatchEventAsync('OnMessage', { control : EEventMessage.GET_VIEWPORT_SIZE });

    // On récupère la liste des events
    const events = await getEvensRecordAsync();
    // Le dernier event doit avoir l'attribut coordinates non vide
    expect(events[events.length - 1].coordinates).toBeDefined();

  });
});