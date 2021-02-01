/**
 * Constantes du header du scénario
 */
export default {
  importPuppeteer: `const puppeteer = require('puppeteer');
  const fs = require('fs');
  const path = require('path');
  const fakeTimeScriptContent = fs.readFileSync(path.join(__dirname, './recordings/scripts-build/fake-time-script.js'), 'utf-8');\n`,

  importHTTPrequest : `const puppeteer = require('puppeteer');
const fs = require('fs');
const atob = require('atob');
const url = require('url');
const path = require('path');
const fakeTimeScriptContent = fs.readFileSync(path.join(__dirname, './recordings/scripts-build/fake-time-script.js'), 'utf-8');
function manageUrl(urlM) {
  let parseURL = new URL(urlM);

  if(urlM.includes("document/picture/ctc/") || urlM.includes("document/cnt") || urlM.includes("document/rqt") || urlM.includes('calendar/addDays') || urlM.includes('autoroute/agowdte')) {
    for(var pair of parseURL.searchParams.entries()) {
      let d = pair[1];
      //if d is not number
      if (isNaN(d)) {
        // we parse d to date to verify if it's a date
        d = Date.parse(pair[1])
      }
      // if it's a number and if it's > of 100000000 this represent : Saturday 3 March 1973 09:46:40,
      // if value it's < to 100000000  it's not a date it's simple number
      if(d && !isNaN(d) && d > 100000000) {
        parseURL.searchParams.delete(pair[0]);
      }
    }
    return parseURL.href;
  }
  return urlM;
}

function manageTokenFind(currentToken) {

  //console.log(match);
  //we search token
  let token = "";
  for (var c = 0; c < currentToken.length; c++) {
    //alert(currentToken.charAt(c));
    if(currentToken.charAt(c).match(/[a-zA-Z0-9_]/g) || currentToken.charAt(c) == ".") {
      token+= currentToken.charAt(c);
    }
    else {
      return token;
    }
  }
  return token;
}

let nameFile = "";
fs.readdirSync(__dirname+"/recordings").forEach(file => {
  if(file.includes('scenario')) nameFile = file;
});
const fileContents = fs.readFileSync(__dirname+"/recordings/"+nameFile+"/recording.har");
let fileFinal = JSON.stringify(JSON.parse(fileContents));
let listToken = fileFinal.split("token=");
let isFind = false;
for (let i=1; i < listToken.length;i++) {
  if(isFind) break;
  let currentToken = listToken[i];
  let token = manageTokenFind(currentToken);
  //we werify validity of token :
  try {
    let t = atob(token);
    if (token.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/) && t.split("|").length == 3) {
      fileFinal = fileFinal.split(token).join("YW5vbnltb3VzfF9NQVNURVJffDA=");
      isFind=true;
    }
  }
  catch(e) {
    console.log("erreur pour token:", token)
  }
}

const jsonContents = JSON.parse(fileFinal);
var requestHashMap = new Map();

for (let index = 0; index < jsonContents.log.entries.length; index++) {

  const req = jsonContents.log.entries[index];
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

let notNormalizeChar= [',', '(', ')', '{', '}', '[', ']', '|', '!', '*'];
let normalizeChar= ['%2C', '%28', '%29', '%7B', '%7D', '%5B', '%5D', '%7C', '%21', '%2A'];
`,
  header : `const browser = await puppeteer.launch()
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
    window.addEventListener('SetupReady', function() {
      window.dispatchEvent(new CustomEvent('PollyReady'));
    } , false);
    let event = new CustomEvent('PollyReady');
    window.dispatchEvent(event);
   })
}); \n`,

  wrappedHeader : `(async () => {
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
      window.addEventListener('SetupReady', function() {
        window.dispatchEvent(new CustomEvent('PollyReady'));
      } , false);
      let event = new CustomEvent('PollyReady');
      window.dispatchEvent(event);
     })
  });\n`,

  listenerPage : `   await page.setRequestInterception(true);
  await page.setBypassCSP(true);
  await page.setOfflineMode(true);

  page.on("request", (req)=>{

    let url = manageUrl(req.url());

    let urlSplit = url.split(":");
    if(urlSplit.length > 1){
       let firstPart = urlSplit.shift();
       let secondPart= urlSplit.shift();
       url = firstPart +":"+ secondPart+":" + urlSplit.join("%3A");
    }

    for(let i=0; i < notNormalizeChar.length;i++){
      url = url.split(notNormalizeChar[i]).join(normalizeChar[i]);
    }
    let requestMap = requestHashMap.get(url);
    let requete = undefined;
    if(requestMap !=undefined){

      if(requestMap.currentOrder > requestMap.order ){
        requestMap.currentOrder = 0;
      }
      requete = requestMap.listReq[requestMap.currentOrder];

      requestMap.currentOrder++;
      requestHashMap.set(url ,requestMap);
    }

    console.log("URL:"+url);
    if(requete != undefined **httpregex**){

      console.log("URL en commun");
      let responseTosend = requete.response.content.text;
      let responseMimeType = requete.response.content.mimeType;
      if(responseMimeType.includes('image') || responseMimeType.includes("font") ){
        let extensionFile = responseMimeType.split('/')[1];

        let fileName= './recordings/imageTosend.'+extensionFile;
        console.log("image here url :", url);

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
      console.log("on a pas la request")
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

    await page.evaluate(() => {
      window.addEventListener('SetupReady', function() {
        window.dispatchEvent(new CustomEvent('PollyReady'));
      } , false);
      let event = new CustomEvent('PollyReady');
      window.dispatchEvent(event);
    })
  });
`
};