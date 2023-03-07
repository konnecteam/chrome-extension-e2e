import 'jest';
import * as puppeteer from 'puppeteer';
import { startServer } from '../../../src/test/page-test/server';
import { launchPuppeteerWithExtension } from '../../../src/test/lauch-puppeteer/lauch-puppeteer';
import { Server } from 'http';

let server : Server;
let browser : puppeteer.Browser;
let page : puppeteer.Page;

/**
 * Permet d'attendre que le polly soit prết pour enregistrer
 */
async function waitPollyReadyAsync() : Promise<string> {
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
  beforeAll(async () => {
    // On démarre le serveur de test
    server = await startServer();
    browser = await launchPuppeteerWithExtension(puppeteer);

    // On lance puppeteer et on met en place la page pour les tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    // On ajoute polly-recorder dans la page
    await page.evaluate(scriptText => {

      // Variable qui va permettre de savoir si polly est prêt
      (window as any).waitPolly = new Promise<void>((resolve, reject) => {
        // On verifie si c'est fini toutes les 100Ms
        const verif = setInterval(() => {
          // si on est pas ready, on fait une pause
          if ((window as any).polly) {
            clearInterval(verif);
            resolve();
          }
        }, 100);
      });
      // On ajoute le script polly
      const el = document.createElement('script');
      el.src = scriptText;
      document.body.parentElement.appendChild(el);

    }, 'build/lib/scripts/polly/polly.js');
  }, 50000);

  // Close server
  afterAll(async () => {

    await page.close();
    await browser.close();
    server.close();
  });

  test('Test de création de polly', async () => {

    // On attend que polly soit prêt
    await waitPollyReadyAsync();
    // On récupère l'id de polly
    const polly = await getPollyIDAsync();
    expect(polly).toBeDefined();
  });


  test('Test de mise en pause de polly', async () => {

    // On attend que polly soit prêt
    await waitPollyReadyAsync();

    // On met en pause polly
    await page.evaluate(async () => {
      return (window as any).polly._pause();
    });

    // On récupère le résultat
    const result = await isPausedPollyAsync();
    // Polly est en pause
    expect(result).toBeTruthy();
  });

  test('Test de reprise du record de polly', async () => {

    // On attend que polly soit prêt
    await waitPollyReadyAsync();

    // On met en pause polly
    await page.evaluate(async () => {
      return (window as any).polly._unpause();
    });

    // On récupère le résultat
    const result = await isPausedPollyAsync();

    // Polly n'est plus en pause
    expect(result).toBeFalsy();
  });

  test('Test de récupération du résultat de polly', async () => {

    // On attend que polly soit prêt
    await waitPollyReadyAsync();

    // On stop polly
    await page.evaluate(async () => {
      return (window as any).polly._stopAsync();
    });

    // On récupère le résultat
    const result = await page.evaluate(async () => {
      return (window as any).polly._getResult((window  as any).polly.recordingId);
    });

    // Le résultat ne doit pas être vide
    expect(result).toBeDefined();
  });

});