/**
 * Constantes du header du scénario
 */
export default {
  IMPORT_PUPPETEER : `const puppeteer = require('puppeteer');
  const fs = require('fs');
  const path = require('path');
  const PageService = require('./recordings/services/page-service');
  const BrowserService = require('./recordings/services/browser-service');\n`,

  IMPORT_HTTP_REQUEST : `const puppeteer = require('puppeteer');
const fs = require('fs');
const PageService = require('./recordings/services/page-service');
const BrowserService = require('./recordings/services/browser-service');
const RequestService = require('./recordings/services/request-service');

/** On commence par lire le har qui contient les requêtes et le faketimescript qui permet de faker la date */
let nameFolder = '';
fs.readdirSync(\`\${__dirname}/recordings\`).forEach(folder => {
  if(folder.includes('scenario')) nameFolder = folder;
});

const harFileContent = fs.readFileSync(\`\${__dirname}/recordings/\${nameFolder}/recording.har\`);
let harContent = JSON.stringify(JSON.parse(harFileContent));

RequestService.getInstance().setHarContent(harContent);\n`,

  HEADER : `const params = (process.env.PUPPETEER_HEADLESS === 'false') ? { headless : false } : {};
const browser = await puppeteer.launch(params);
const page = await browser.newPage()
page.setDefaultTimeout(process.env.PUPPETEER_TIMEOUT || '100000')
let fileChooser = null;
/** On met en place le handle du chargement de la page */
PageService.addLoadHandler(page);

BrowserService.addTargetCreatedHandler(browser);
\n`,

  WRAPPED_HEADER : `(async () => {
  const params = (process.env.PUPPETEER_HEADLESS === 'false') ? { headless : false } : {};
  const browser = await puppeteer.launch(params)
  const page = await browser.newPage()
  page.setDefaultTimeout(process.env.PUPPETEER_TIMEOUT || '100000')
  let fileChooser = null;
  /** On met en place le handle du chargement de la page */
  PageService.addLoadHandler(page);

  BrowserService.addTargetCreatedHandler(browser);
  \n`,

  REQUEST_LISTENER : `  await page.setRequestInterception(true);
  await page.setBypassCSP(true);
  await page.setOfflineMode(true);
  /** On met en place le handle requests de la page */
  PageService.addSavedRequestHandler(page **httpregex**);
`,
  LIVE_REQUEST_LISTENER : `  await page.setRequestInterception(true);
  PageService.addLiveRequestHandler(page **httpregex**);
`
};