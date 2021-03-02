import { defaults } from './../constants/default-options';
import { runBuild } from './../../static/test/extension-builder/extension-builder';
import 'jest';
const puppeteer = require('puppeteer');
import { startServer } from '../../static/test/page-test/server';
import { launchPuppeteerWithExtension } from '../../static/test/lauch-puppeteer/lauch-puppeteer';
import * as path from 'path';
import * as chrome from 'sinon-chrome';
import { MessageModel } from '../models/message-model';

let server;
let browser;
let page;
let buildDir;


/**
 * Récupère l'état du badge pour savoir
 * Si on est en pause, si on a commencé...
 */
async function getBadgeText() : Promise<string> {

  return page.evaluate(() => {
    return (window as any).badgeText;
  });
}

/**
 * Permet d'attendre que le content script soit prết pour enregistrer
 */
async function isBackgroundReady() : Promise<string> {
  return page.evaluate(async () => {
    return await (window as any).waitBackground;
  });
}

/**
 * Permet de lancer un dispatch event sur la window
 * @param event
 */
async function dispatchEvent(event : string, message : MessageModel) : Promise<void> {
  return page.evaluate(function (ev) {
    const customEvent = new CustomEvent(ev.event);
    Object.assign(customEvent, ev.message);

    window.dispatchEvent(customEvent);
  }, { event, message });
}

/**
 * Permet de verifie le contenu du badge
 * @param action
 */
async function verfiyBadgeContent(action : string ) : Promise<string> {
  await isBackgroundReady();
  // Dispatch event
  await dispatchEvent('OnMessage', { action });
  // Récupérer l'état du badge
  return getBadgeText();
}

// tslint:disable: no-identical-functions
describe('Test de Recording Controller', function () {

  // Mise en place du serveur
  beforeAll(async function (done) {

    await runBuild();
    buildDir = '../../../dist';
    const fixture = path.join(__dirname, '../../static/test/page-test/html-page/forms.html');

    // On démarre le serveur de test
    server = await startServer(buildDir, fixture);
    browser = await launchPuppeteerWithExtension(puppeteer);

    // On lance puppeteer et on met en place la page pour les tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    await page.evaluate(browserOption => {

      // On donne l'api chrome à la window
      window.chrome = browserOption.chrome;

      // Variable qui va permettre de savoir si le backgournd est prêt
      (window as any).waitBackground = new Promise((resolve, reject) => {
        // On verifie si c'est fini toutes les 100Ms
        const verif = setInterval(function () {
          // si on est ready, on clear
          if ((window as any).recordingController) {
            clearInterval(verif);
            resolve('good');
          }
        }, 100);
      });
      // On set les options dans le local storage de la window car on est pas dans le plugin
      window.localStorage.setItem('options', JSON.stringify({ options: { code: browserOption.options } }));


      // On utilise sendMessage donc il faut le declarer mais on a pas besoin de l'overwrite
      window.chrome.runtime.sendMessage = event => {};

      // On overwrite pour adapter le get au local storage
      window.chrome.storage.local.get = (key, callback?) => {
        callback(JSON.parse(window.localStorage.getItem(key[0])));
        return browserOption.options;
      };


      // On overwrite la foncion pour lui donner l'url de fake time script js
      window.chrome.extension.getURL = () => 'scripts/fake-time-script.js';

      // On overwrite le set pour set dans local storage pour les tests
      window.chrome.storage.local.set = valueTOsave => {
        const key = Object.keys(valueTOsave)[0];
        const value = valueTOsave[key];
        window.localStorage.setItem(key, JSON.stringify(value));
      };


      // On overwrite remove pour supprimer des éléments
      chrome.storage.local.remove = key => {
        window.localStorage.removeItem(key);
      };

      /*
       * On overwrite le OnConnect pour utiliser le event listener de la window
       *  pour les tests car nous avons pas accès aux méthodes nécessaire
       *
       */
      (chrome.extension as any).onConnect = {
        addListener(fct) {

          // On adapte la méthode boot pour les tests
          window.addEventListener('OnMessage', (msg : any) => {

            if (msg.action && msg.action === 'start') (window as any).recordingController._start();
            if (msg.action && msg.action === 'stop') (window as any).recordingController._stop();
            if (msg.action && msg.action === 'cleanUp') (window as any).recordingController._cleanUp();
            if (msg.action && msg.action === 'pause') (window as any).recordingController._pause();
            if (msg.action && msg.action === 'unpause') (window as any).recordingController._unPause();
            if (msg.action && msg.action === 'exportScript') (window as any).recordingController._exportScriptAsync();
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
      chrome.browserAction.setIcon = (badge : { path : string}) => {
        (window as any).badgeIcon = badge.path;
      };

      /**
       * On overwrite la méthode seticon pour connaitre l'état du background
       */
      (window as any).badgeColor = '';
      chrome.browserAction.setBadgeBackgroundColor = (badge : { color : string}) => {
        (window as any).badgeIcon = badge.color;
      };


      /**
       * On overwite la méthode executeScript
       */
      (window as any).executeScript = false;
      chrome.tabs.executeScript = function (any, callback) {
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
        onCompleted: {
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

    }, { chrome, options: defaults });

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
    await server.close();
  }, 50000);


  test('Test de start', async () => {

    const badge = await verfiyBadgeContent('start');
    // Verifier si il est égale à 'rec' car il n'y a pas d'event à save
    expect(badge).toEqual('rec');
  });

  test('Test de stop', async () => {
    const badge = await verfiyBadgeContent('stop');
    // Verifier si il est égale à '' car il n'y a pas d'event à save
    expect(badge).toEqual('');
  });

  test('Test de cleanUp', async () => {

    const badge = await verfiyBadgeContent('cleanup');
    // Verifier si il est égale à '' car il n'y a pas d'event à save
    expect(badge).toEqual('');
  });

  test('Test de pause', async () => {

    const badge = await verfiyBadgeContent('pause');
    // Verifier si il est égale à '❚❚' car on est en pause
    expect(badge).toEqual('❚❚');
  });

  test('Test de unpause', async () => {

    const badge = await verfiyBadgeContent('unpause');
    // Verifier si il est égale à 'rec' car on record
    expect(badge).toEqual('rec');
  });

  test('Test de exportScript', async () => {

    await isBackgroundReady();

    // On met result à true pour simuler la reception d'un résultat
    await page.evaluate(() => {
      (window as any).recordingController._isResult = true;
      Promise.resolve('good');
    });

    // On met du contenu dans code
    await page.evaluate(() => {
      window.chrome.storage.local.set({code : 'code exemple'});
      Promise.resolve('good');
    });
    // Dispatch event
    await dispatchEvent('OnMessage', { action: 'exportScript' });

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