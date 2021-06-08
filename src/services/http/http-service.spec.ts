import 'jest';
import { HttpService } from './http-service';
import { runBuild } from './../../../static/test/extension-builder/extension-builder';
import * as puppeteer from 'puppeteer';
import { startServer } from '../../../static/test/page-test/server';
import { launchPuppeteerWithExtension } from '../../../static/test/lauch-puppeteer/lauch-puppeteer';
import { Server } from 'http';

let server : Server;
let browser : puppeteer.Browser;
let page : puppeteer.Page;

describe('Test de du Service HttpService', function() {

  beforeAll(async done => {

    await runBuild();

    // On démarre le serveur de test
    server = await startServer();
    browser = await launchPuppeteerWithExtension(puppeteer);

    // On lance puppeteer et on met en place la page pour les tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    done();

    // On met un timeout car runbuild met plus de 2000ms
  }, 50000);

  // Close Server
  afterAll(async () => {

    await page.close();
    await browser.close();
    server.close();
  }, 50000);

  test('Test de execute request', async () => {
    // On déclare getRequest car sinon le programme nous indique une erreur
    const getRequest = null;
    // on execute la request
    const result = await page.evaluate(async httpService => {
      // On utilise eval pour récuperer la fonction getRequest
      // tslint:disable-next-line: no-eval
      eval(httpService);
      return getRequest('https://jsonplaceholder.typicode.com/users');

      // on replace async par async function pour avoir une fonction JS valide
    }, HttpService.getRequest.toString().replace('async', 'async function '));

    // result doit être defined
    expect(result).toBeDefined();
  });
});