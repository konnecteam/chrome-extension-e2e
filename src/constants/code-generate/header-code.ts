/**
 * Constantes du header du scénario
 */
export default {
  IMPORT_PUPPETEER: `const puppeteer = require('puppeteer');
  const fs = require('fs');
  const path = require('path');
  const PageService = require('./recordings/services/page-service');
  const fakeTimeScriptContent = fs.readFileSync(path.join(__dirname, './recordings/scripts-build/fake-time-script.js'), 'utf-8');\n`,

  IMPORT_HTTP_REQUEST : `const puppeteer = require('puppeteer');
const fs = require('fs');
const TokenService  = require('./recordings/services/token-service');
const PageService = require('./recordings/services/page-service');

/** On commence par lire le har qui contient les requêtes et le faketimescript qui permet de faker la date */
let nameFolder = '';
fs.readdirSync(\`\${__dirname}/recordings\`).forEach(folder => {
  if(folder.includes('scenario')) nameFolder = folder;
});

const harFileContent = fs.readFileSync(\`\${__dirname}/recordings/\${nameFolder}/recording.har\`);
let harContent = JSON.stringify(JSON.parse(harFileContent));
let listToken = harContent.split('token=');

// On remplace les tokens par les bons
TokenService.replaceToken(listToken, harContent);
`,
  HEADER : `const browser = await puppeteer.launch()
const page = await browser.newPage()
page.setDefaultTimeout('100000')
let fileChooser = null;
/** On met en place les handles de la page */
PageService.addLoadPageHandle(page);
\n`,

  WRAPPED_HEADER : `(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setDefaultTimeout('100000')
  let fileChooser = null;
  /** On met en place les handles de la page */
  PageService.addLoadPageHandle(page);
  \n`,

  LISTENER_PAGE_RECORDED_REQUEST : `   await page.setRequestInterception(true);
  await page.setBypassCSP(true);
  await page.setOfflineMode(true);
  /** On met en place les handles de la page */
  PageService.addRequestSavedPageHandler(page **httpregex**);
`,
  LISTENER_PAGE_LIVE_REQUEST : `await page.setRequestInterception(true);
  PageService.addRequestLivePageHandler(page **httpregex**);
`
};