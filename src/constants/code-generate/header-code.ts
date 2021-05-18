import controlMSG from '../control/control-message';
/**
 * Constantes du header du scénario
 */
export default {
  IMPORT_PUPPETEER: `const puppeteer = require('puppeteer');
  const fs = require('fs');
  const path = require('path');
  const fakeTimeScriptContent = fs.readFileSync(path.join(__dirname, './recordings/scripts-build/fake-time-script.js'), 'utf-8');\n`,

  IMPORT_HTTP_REQUEST : `const puppeteer = require('puppeteer');
const fs = require('fs');
const atob = require('atob');
const url = require('url');
const path = require('path');
const fakeTimeScriptContent = fs.readFileSync(path.join(__dirname, './recordings/scripts-build/fake-time-script.js'), 'utf-8');

/** Permet de supprimer le datetime de certaines requêtes */
function manageUrl(urlM) {
  let parseURL = new URL(urlM);
  let requestURL = [
    'document/picture/ctc/',
    'document/cnt',
    'document/rqt',
    'calendar/addDays',
    'autoroute/agowdte'
  ];

  for(let request of requestURL) {

    if(urlM.includes(request)) {
      for(let pair of parseURL.searchParams.entries()) {
        let d = pair[1];
        //Si d est un nombre
        if (isNaN(d)) {
          // On le parse en date
          d = Date.parse(pair[1])
        }
        // Si la valeur est  < à 100000000  c'est un nombre et pas une date
        if(d && !isNaN(d) && d > 100000000) {
          // On supprime le paramètre
          parseURL.searchParams.delete(pair[0]);
        }
      }
      return parseURL.href;
    }
  }

  return urlM;
}
/** On cherche le token utilisé pour le scénario*/
function manageTokenFind(currentToken) {

  // On cherche le taken
  let token = '';
  for (let c = 0; c < currentToken.length; c++) {

    if(currentToken.charAt(c).match(/[a-zA-Z0-9_]/g) || currentToken.charAt(c) == '.') {
      token+= currentToken.charAt(c);
    }
    else {
      return token;
    }
  }
  return token;
}

let nameFolder = '';
fs.readdirSync(\`\${__dirname}/recordings\`).forEach(folder => {
  if(folder.includes('scenario')) nameFolder = folder;
});

const harFileContent = fs.readFileSync(\`\${__dirname}/recordings/\${nameFolder}/recording.har\`);
let harContent = JSON.stringify(JSON.parse(harFileContent));
let listToken = harContent.split('token=');
let isFind = false;
for (let i=1; i < listToken.length;i++) {
  if(isFind) break;
  let currentToken = listToken[i];
  let token = manageTokenFind(currentToken);
  // On verifie la validitée du token :
  try {
    let t = atob(token);
    if (token.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/) && t.split('|').length == 3) {
      harContent = harContent.split(token).join(Buffer.from('anonymous|_MASTER_|0').toString('base64'));
      isFind=true;
    }
  }
  catch(e) {
    console.log('erreur pour token:', token)
  }
}

const jsonHAR = JSON.parse(harContent);
let requestHashMap = new Map();

for (let index = 0; index < jsonHAR.log.entries.length; index++) {

  const req = jsonHAR.log.entries[index];
  let url = manageUrl(req.request.url);
  if(requestHashMap.get(url)){
    let hashmapReq = requestHashMap.get(url);
    hashmapReq.listReq.push({request : req.request, response : req.response});
    hashmapReq.order++;
    requestHashMap.set(url, hashmapReq);
  }
   else {
    requestHashMap.set(url, { listReq: [{request : req.request, response : req.response}], order:0, currentOrder:0 });
  }
}

let notNormalizeChar = [',', '(', ')', '{', '}', '[', ']', '|', '!', '*'];
let normalizeChar = ['%2C', '%28', '%29', '%7B', '%7D', '%5B', '%5D', '%7C', '%21', '%2A'];
`,
  HEADER : `const browser = await puppeteer.launch()
const page = await browser.newPage()
page.setDefaultTimeout('100000')
let fileChooser = null;
page.on('load', async () => {

  await page.evaluate(content => {
    let scriptAdd = document.createElement('script');
    scriptAdd.id = 'fake-time-script';
    scriptAdd.innerHTML = content;
    document.head.append(scriptAdd);
  }, fakeTimeScriptContent)

  await page.evaluate(() => {
    window.addEventListener('${controlMSG.SETUP_READY_EVENT}', function() {
      window.dispatchEvent(new CustomEvent('${controlMSG.POLLY_READY_EVENT}'));
    } , false);
    let event = new CustomEvent('${controlMSG.POLLY_READY_EVENT}');
    window.dispatchEvent(event);
  })
}); \n`,

  WRAPPED_HEADER : `(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setDefaultTimeout('100000')
  let fileChooser = null;
  page.on('load', async () => {

    await page.evaluate(content => {
      let scriptAdd = document.createElement('script');
      scriptAdd.id = 'fake-time-script';
      scriptAdd.innerHTML = content;
      document.head.append(scriptAdd);
    }, fakeTimeScriptContent)

    await page.evaluate(() => {
      window.addEventListener('${controlMSG.SETUP_READY_EVENT}', function() {
        window.dispatchEvent(new CustomEvent('${controlMSG.POLLY_READY_EVENT}'));
      } , false);
      let event = new CustomEvent('${controlMSG.POLLY_READY_EVENT}');
      window.dispatchEvent(event);
    })
  });\n`,

  LISTENER_PAGE_RECORDED_REQUEST : `   await page.setRequestInterception(true);
  await page.setBypassCSP(true);
  await page.setOfflineMode(true);

  page.on('request', (req)=>{

    let url = manageUrl(req.url());

    let urlSplit = url.split(':');
    if(urlSplit.length > 1){
       let firstPart = urlSplit.shift();
       let secondPart= urlSplit.shift();
       url = \`\${firstPart}:\${secondPart}:\${urlSplit.join('%3A')}\`;
    }

    for(let i = 0; i < notNormalizeChar.length;i++){
      url = url.split(notNormalizeChar[i]).join(normalizeChar[i]);
    }
    let requestMap = requestHashMap.get(url);
    let requete = undefined;
    if(requestMap != undefined){

      if(requestMap.currentOrder > requestMap.order ){
        requestMap.currentOrder = 0;
      }
      requete = requestMap.listReq[requestMap.currentOrder];

      requestMap.currentOrder++;
      requestHashMap.set(url ,requestMap);
    }

    if(requete != undefined **httpregex**){

      let responseTosend = requete.response.content.text;
      let responseMimeType = requete.response.content.mimeType;
      if(responseMimeType.includes('image') || responseMimeType.includes('font') ){
        let extensionFile = responseMimeType.split('/')[1];

        let fileName= \`./recordings/imageTosend.\${extensionFile}\`;

        responseTosend = Buffer.from(responseTosend, 'hex').toString('base64');
        fs.writeFileSync(fileName, responseTosend, 'base64');
        responseTosend =  fs.readFileSync(fileName);
        fs.unlinkSync(fileName);
      }

      let responseHeaders = {}
      for(let i =0; i< requete.response.headers.length; i++){
        let head = requete.response.headers[i];

        let attribute = head.name.split('-');
        for(let j=0; j< attribute.length; j++){
          attribute[j]= attribute[j].charAt(0).toUpperCase() + attribute[j].slice(1);
        }

        head.name = attribute.join('-');

        if(head.name ==='X-Konnect-Id'){
          head.name = 'X-Konnect-ID'
        }
        responseHeaders[head.name] = head.value;
      }
        req.respond({
          status: requete.response.status,
          headers: responseHeaders,
          contentType: responseMimeType,
          body: responseTosend
        })
    }
    else {
      req.abort();
    }
  });

  page.on('error', err=> {
    console.log('err: '+err);
  });
  page.on('pageerror', err=> {
    console.log('err page: '+err);
  });

  page.on('load', async () => {

    await page.evaluate(content => {
      let scriptAdd = document.createElement('script');
      scriptAdd.id = 'fake-time-script';
      scriptAdd.innerHTML = content;
      document.head.append(scriptAdd);
    }, fakeTimeScriptContent)

    /** On dispatch l'event au startup config pour lui dire qu'on est prêt */
    await page.evaluate(() => {
      window.addEventListener('${controlMSG.SETUP_READY_EVENT}', function() {
        window.dispatchEvent(new CustomEvent('${controlMSG.POLLY_READY_EVENT}'));
      } , false);
      let event = new CustomEvent('${controlMSG.POLLY_READY_EVENT}');
      window.dispatchEvent(event);
    })
  });
`,
  LISTENER_PAGE_LIVE_REQUEST : `await page.setRequestInterception(true);
  page.on('request', (req) => {
    let url = req.url();

    if(req != undefined **httpregex**){
      req.continue();
    }
    else {
      req.abort();
    }
  });
`
};