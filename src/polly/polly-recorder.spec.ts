import 'jest';
import { runBuild } from './../../static/test/extension-builder/extension-builder';
const puppeteer = require('puppeteer');
import { startServer } from '../../static/test/page-test/server';
import { launchPuppeteerWithExtension } from '../../static/test/lauch-puppeteer/lauch-puppeteer';
import * as path from 'path';

let server;
let browser;
let page;
let buildDir;

/**
 * Permet d'attendre que le polly soit prết pour enregistrer
 */
async function isPollyReadyAsync() : Promise<string> {
  return page.evaluate(async () => {
    return (window as any).waitPolly;
  });
}

/**
 * Permet de récupérer Polly
 */
async function getPollyIDAsync() : Promise<any> {
  return page.evaluate(() => {
    return (window as any).polly.recordingId;
  });
}

/**
 * Permet de savoir si Polly est en pause
 */
async function isPausedPollyAsync() : Promise<any> {
  return page.evaluate(() => {
    return (window as any).polly.isPaused();
  });
}

describe('Test de Polly recorder', () => {

  // Start test server
  beforeAll(async done => {

    await runBuild();
    buildDir = '../../../dist';
    const fixture = path.join(__dirname, '../../static/test/page-test/html-page/forms.html');
    // On démarre le serveur de test
    server = await startServer(buildDir, fixture);
    browser = await launchPuppeteerWithExtension(puppeteer);

    // On lance puppeteer et on met en place la page pour les tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    // On ajoute polly-recorder dans la page
    await page.evaluate(scriptText => {

      // Variable qui va permettre de savoir si polly est prêt
      (window as any).waitPolly = new Promise((resolve, reject) => {
        // On verifie si c'est fini toutes les 100Ms
        const verif = setInterval(() => {
          // si on est pas ready, on fait une pause
          if ((window as any).polly) {
            clearInterval(verif);
            resolve('good');
          }
        }, 100);
      });
      // On ajoute le script polly
      const el = document.createElement('script');
      el.src = scriptText;
      document.body.parentElement.appendChild(el);

    }, 'build/polly-build/polly.js');
    done();
  }, 50000);

  // Close server
  afterAll(async () => {
    await page.close();
    await browser.close();
    await server.close();
  });

  test('Test de création de polly', async () => {

    // On attend que polly soit prêt
    await isPollyReadyAsync();
    // On récupère l'id de polly
    const polly = await getPollyIDAsync();
    expect(polly).toBeDefined();
  });


  test('Test de mise en pause de polly', async () => {

    // On attend que polly soit prêt
    await isPollyReadyAsync();

    // On met en pause polly
    await page.evaluate(async () => {
      return (window as any).polly.pause();
    });

    // On récupère le résultat
    const result = await isPausedPollyAsync();
    // Polly est en pause
    expect(result).toBeTruthy();
  });

  test('Test de reprise du record de polly', async () => {

    // On attend que polly soit prêt
    await isPollyReadyAsync();

    // On met en pause polly
    await page.evaluate(async () => {
      return (window as any).polly.unpause();
    });

    // On récupère le résultat
    const result = await isPausedPollyAsync();

    // Polly n'est plus en pause
    expect(result).toBeFalsy();
  });

  test('Test de récupération du résultat de polly', async () => {

    // On attend que polly soit prêt
    await isPollyReadyAsync();

    // On stop polly
    await page.evaluate(async () => {
      return (window as any).polly.stop();
    });

    // On récupère le résultat
    const result = await page.evaluate(async () => {
      return (window as any).polly.getResult((window  as any).polly.recordingId);
    });

    // Le résultat ne doit pas être vide
    expect(result).toBeDefined();
  });

});