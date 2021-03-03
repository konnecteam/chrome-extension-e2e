import { URLService } from './url-service';
import 'jest';
import { runBuild } from '../../../static/test/extension-builder/extension-builder';
const puppeteer = require('puppeteer');
import { startServer } from '../../../static/test/page-test/server';
import { launchPuppeteerWithExtension } from '../../../static/test/lauch-puppeteer/lauch-puppeteer';
import * as path from 'path';

let urlLink = '';
const obj = {hello: 'world'};

let server;
let browser;
let page;
let buildDir;

describe('Test de du Service UrlService', function() {

  beforeAll(async function (done) {
    await runBuild();
    buildDir = '../../../dist';
    const fixture = path.join(__dirname, '../../../static/test/page-test/html-page/forms.html');
    // On démarre le serveur de test
    server = await startServer(buildDir, fixture);
    browser = await launchPuppeteerWithExtension(puppeteer);

    // On lance puppeteer et on met en place la page pour les tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    done();
  }, 50000);

  // Close server
  afterAll(async () => {
    await page.close();
    await browser.close();
    await server.close();
  });

  test('Test de création d\'url', async () => {
    /**
     * On passe en argument l'objet à transformer en blob et la fonction
     * On est obligé de passer le texte de la fonction car evaluate ne gère pas les fonctions
     * et on doit utiliser eval pour récupérer son contenu et le mettre dans une variable
     * et pour finir on créer le blob et l'url associée
     */
    urlLink = await page.evaluate(async (urlObject : any) => {
      // tslint:disable-next-line: no-eval
      eval('window.createUrl = function ' + urlObject.urlCreate);
      return (window as any).createUrl(new Blob([JSON.stringify(urlObject.obj, null, 2)], {type : 'application/json'}));
    }, {
      obj, urlCreate: URLService.createURLObject.toString()
    });
    expect(urlLink).toBeDefined();
  });

  test('Test de la suppression d\'url', async () => {
    const result = await page.evaluate(async (urlObject : any) => {
      // tslint:disable-next-line: no-eval
      eval('window.removeURL = function ' + urlObject.urlRemove);
      (window as any).removeURL(urlObject.url);

      return fetch(urlObject.url).catch(() => null);
    }, {
      url : urlLink, urlRemove: URLService.revokeURL.toString()
    });

    expect(result).toBeNull();

  });

});