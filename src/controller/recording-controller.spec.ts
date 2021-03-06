import { runBuild } from './../../static/test/extension-builder/extension-builder';
import 'jest';
import * as puppeteer from 'puppeteer';
import { startServer } from '../../static/test/page-test/server';
import { launchPuppeteerWithExtension } from '../../static/test/lauch-puppeteer/lauch-puppeteer';
import * as chrome from 'sinon-chrome';
import { IMessage } from '../interfaces/i-message';
import { Server } from 'http';
import { EBadgeState } from '../enum/badge/e-badge-states';
import { EControlAction } from '../enum/action/control-actions';
import { IOption } from 'interfaces/i-options';


//CONTROL
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
 * Récupère l'état du badge pour savoir
 * Si on est en pause, si on a commencé...
 */
async function getBadgeTextAsync() : Promise<string> {

  return page.evaluate(() => {
    return (window as any).badgeText;
  });
}

/**
 * Permet d'attendre que le content script soit prết pour enregistrer
 */
async function waitBackgroundReadyAsync() : Promise<string> {
  return page.evaluate(async () => {
    return (window as any).waitBackground;
  });
}

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
 * Permet de verifier le contenu du badge
 */
async function verfiyBadgeContentAsync(action : string ) : Promise<string> {
  await waitBackgroundReadyAsync();
  // Dispatch event
  await dispatchEventAsync('OnMessage', { action });
  // Récupérer l'état du badge
  return getBadgeTextAsync();
}

// tslint:disable: no-identical-functions
describe('Test de Recording Controller', () => {

  // Mise en place du serveur
  beforeAll(async done => {

    await runBuild();

    // On démarre le serveur de test
    server = await startServer();
    browser = await launchPuppeteerWithExtension(puppeteer);

    // On lance puppeteer et on met en place la page pour les tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    await page.evaluate(params => {

      // On donne l'api chrome à la window
      window.chrome = params.chrome;

      // Variable qui va permettre de savoir si le backgournd est prêt
      (window as any).waitBackground = new Promise<void>((resolve, reject) => {
        // On verifie si c'est fini toutes les 100Ms
        const verif = setInterval(() => {
          // si on est ready, on clear
          if ((window as any).recordingController) {
            clearInterval(verif);
            resolve();
          }
        }, 100);
      });
      // On set les options dans le local storage de la window car on est pas dans le plugin
      window.localStorage.setItem('options', JSON.stringify({ options : { code : params.options } }));


      // On utilise sendMessage donc il faut le declarer mais on a pas besoin de l'overwrite
      window.chrome.runtime.sendMessage = event => {};

      // On overwrite pour adapter le get au local storage
      window.chrome.storage.local.get = (key, callback?) => {
        callback(JSON.parse(window.localStorage.getItem(key[0])));
        Promise.resolve(params.options);
      };


      // On overwrite la foncion pour lui donner l'url de fake time js
      window.chrome.extension.getURL = () => 'libs/scripts/fake-time/fake-time.js';

      // On overwrite le set pour set dans local storage pour les tests
      window.chrome.storage.local.set = valueTOsave => {
        const key = Object.keys(valueTOsave)[0];
        const value = valueTOsave[key];
        window.localStorage.setItem(key, JSON.stringify(value));
      };


      // On overwrite remove pour supprimer des éléments
      chrome.storage.local.remove = key => {
        window.localStorage.removeItem(key);
        Promise.resolve();
      };

      /*
       * On overwrite le OnConnect pour utiliser le event listener de la window
       *  pour les tests car nous avons pas accès aux méthodes nécessaire
       *
       */
      (chrome.extension as any).onConnect = {
        addListener(fct) {

          // On adapte la méthode boot pour les tests
          window.addEventListener('OnMessage', async (msg : any) => {
            switch (msg.action) {
              case params.controlActions.START :
                (window as any).recordingController._startAsync();
                (window as any).badgeText = params.badgeStates.REC;
                break;
              case params.controlActions.STOP :
                (window as any).recordingController._stop();
                (window as any).badgeText = '';
                break;
              case params.controlActions.CLEANUP :
                (window as any).recordingController._cleanUpAsync();
                (window as any).badgeText = '';
                break;
              case params.controlActions.PAUSE :
                (window as any).recordingController._pause();
                (window as any).badgeText = params.badgeStates.PAUSE;
                break;
              case params.controlActions.UNPAUSE :
                (window as any).recordingController._unPause();
                (window as any).badgeText = params.badgeStates.REC;
                break;
              case params.controlActions.EXPORT_SCRIPT :
                (window as any).recordingController._exportScriptAsync();
                (window as any).badgeText = params.badgeStates.RESULT_NOT_EMPTY;
                break;
            }
          });
        }
      };

      /**
       * On overwrite la méthode setBadge text pour connaitre l'état du badge
       */
      (window as any).badgeText = '';
      chrome.browserAction.setBadgeText = (badge : { text : string}) => {
        (window as any).badgeText = badge.text;
      };

       /**
        * On overwrite la méthode seticon pour connaitre l'état de l'icon
        */
      (window as any).badgeIcon = '';
      chrome.browserAction.setIcon = (badge : { path : string }) => {
        (window as any).badgeIcon = badge.path;
      };

      /**
       * On overwrite la méthode seticon pour connaitre l'état du background
       */
      (window as any).badgeColor = '';
      chrome.browserAction.setBadgeBackgroundColor = (badge : { color : string }) => {
        (window as any).badgeIcon = badge.color;
      };


      /**
       * On overwite la méthode executeScript
       */
      (window as any).executeScript = false;
      chrome.tabs.executeScript = (any, callback) => {
        (window as any).executeScript = true;
        callback();
      };

      /**
       * On overwrite les méthodes utilisées mais non essentiel pour nos tests
       */
      chrome.tabs.query = () => { };
      chrome.runtime.onMessage = {
        addListener(callback) {},
        removeListener(callback) {}
      };

      chrome.webNavigation = {
        onCompleted : {
          addListener(callback) {},
          removeListener(callback) {}
        },
        onBeforeNavigate : {
          addListener(callback) {},
          removeListener(callback) {}
        }
      };

      /**
       * On overwrite download pour savoir si on a exporter le script
       */
      (window as any).ddlFile = false;
      chrome.downloads.download =  () => {
        (window as any).ddlFile = true;
      };

    }, { chrome, options : defaultOptions, controlActions : EControlAction , badgeStates : EBadgeState});

    // On ajoute le background dans la page
    await page.evaluate(scriptText => {
      const el = document.createElement('script');
      el.src = scriptText;
      document.body.parentElement.appendChild(el);
    }, 'build/background.js');

    done();
  }, 50000);

  // Close server
  afterAll(async () => {

    await page.close();
    await browser.close();
    server.close();
  }, 50000);


  test('Test de start', async () => {

    const badge = await verfiyBadgeContentAsync(EControlAction.START);
    // Verifier si il est égale à 'rec' car il n'y a pas d'event à save
    expect(badge).toEqual(EBadgeState.REC);

  });

  test('Test de stop', async () => {
    const badge = await verfiyBadgeContentAsync(EControlAction.STOP);
    // Verifier si il est égale à '' car il n'y a pas d'event à save
    expect(badge).toEqual('');
  });

  test('Test de cleanUp', async () => {

    const badge = await verfiyBadgeContentAsync(EControlAction.CLEANUP);
    // Verifier si il est égale à '' car il n'y a pas d'event à save
    expect(badge).toEqual('');
  });

  test('Test de pause', async () => {

    const badge = await verfiyBadgeContentAsync(EControlAction.PAUSE);
    // Verifier si il est égale à '❚❚' car on est en pause
    expect(badge).toEqual(EBadgeState.PAUSE);
  });

  test('Test de unpause', async () => {

    const badge = await verfiyBadgeContentAsync(EControlAction.UNPAUSE);
    // Verifier si il est égale à 'rec' car on record
    expect(badge).toEqual(EBadgeState.REC);
  });

  test('Test de exportScript', async () => {

    await waitBackgroundReadyAsync();

    // On met result à true pour simuler la reception d'un résultat
    await page.evaluate(() => {
      (window as any).recordingController._isResult = true;
      Promise.resolve();
    });

    // On met du contenu dans code
    await page.evaluate(() => {
      window.chrome.storage.local.set( { code : 'code exemple' });
      Promise.resolve();
    });
    // Dispatch event
    await dispatchEventAsync('OnMessage', { action : EControlAction.EXPORT_SCRIPT });

    // On fait une pause pour laisser exportScript le temps de finir
    await page.waitFor(40);

    // On vérfie si on a bien utilisé la méthode download
    const ddlFile = await page.evaluate(() => {
      return (window as any).ddlFile;
    });
    // Verifier si il est égale à true car on a ddl
    expect(ddlFile).toBeTruthy();
  });
});