import 'mocha';
import * as assert from 'assert';
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
async function isPollyReady() : Promise<string> {
  return await page.evaluate(async () => {
    await (window as any).waitPolly;
    return (window as any).waitPolly;
  });
}

/**
 * Permet de récupérer Polly
 */
async function getPollyID() : Promise<any> {
  return await page.evaluate(() => {
    return (window as any).polly.recordingId;
  });
}

describe('Test de Polly recorder', function () {

  before('Start test server', async function () {

    // On met un timeout car runbuild met plus de 2000ms donc on met timeout
    this.timeout(50000);
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
      (window as any).waitPolly = new Promise(function(resolve, reject) {
        // On verifie si c'est fini toutes les 100Ms
        const verif = setInterval(function () {
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
  });

  after('Close server', async () => {
    await page.close();
    await browser.close();
    await server.close();
  });

  it('Test de création de polly', async () => {

    // On attend que polly soit prêt
    await isPollyReady();
    // On récupère l'id de polly
    const polly = await getPollyID();
    assert.ok(polly);
  });

  it('Test de récupération du résultat de polly', async () => {

    // On attend que polly soit prêt
    await isPollyReady();

    // On stop polly
    await page.evaluate(async () => {
      await (window as any).polly.stop();
      return Promise.resolve(true);
    });

    // On récupère le résultat
    const result = await page.evaluate(async () => {
      return (window as any).polly.getResult((window  as any).polly.recordingId);
    });

    // Le résultat ne doit pas être vide
    assert.ok(result);
  });

});