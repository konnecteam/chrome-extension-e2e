const UrlService = require('./url-service');
const fs = require('fs');
const path = require('path');
const RequestService = require('./request-service');

/**
 * Service qui permet d'ajouter les handler au page puppeteer du scénario
 */
class PageService {
  /**
   * Ajouter le requete handle à la page donnée
   * @param {*} page 
   * @returns 
   */
  static addSavedRequestHandler(page, regexp = null) {
    /**
     * Quand une requête est détéctée on la traite
     */
    page.on('request',(req) => {
      let url = UrlService.deleteDateTime(req.url());
      // On supprime le token de l'url
      url = UrlService.deleteToken(url);
      url = UrlService.getURLEncode(url);

      let requestMap = RequestService.getInstance().mapRequests.get(url);
      let requete = undefined;

      if(requestMap != undefined){
    
        if(requestMap.currentOrder > requestMap.order ){
          requestMap.currentOrder = 0;
        }
        requete = requestMap.listReq[requestMap.currentOrder];
    
        requestMap.currentOrder++;
        RequestService.getInstance().mapRequests.set(url ,requestMap);
      }
    
      if(requete != undefined && (!regexp || regexp && !regexp.test(url)) ){
    
        let responseTosend = requete.response.content.text;
        let responseMimeType = requete.response.content.mimeType;
        if(responseMimeType.includes('image') || responseMimeType.includes('font') ){
          let extensionFile = responseMimeType.split('/')[1];
    
          let fileName= `./imageTosend.${extensionFile}`;
    
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
    }
    );
  }

  static addLiveRequestHandler(page, regexp = null) {
    page.on('request', (req) => {
      let url = req.url();
  
      if(req != undefined && (!regexp || regexp && !regexp.test(url))){
        req.continue();
      }
      else {
        req.abort();
      }
    });
  }
  /**
   * Ajout le handle pour le load d'une page puppeteer
   * @param {*} page 
   */
  static addLoadHandler(page) {
    const fakeTimeScriptContent = fs.readFileSync(path.join(__dirname, '../scripts-build/fake-time-script.js'), 'utf-8');

    /**
     * Lorsque la page charge
     */
    page.on('load', async ()=>  {

      await page.evaluate(content => {
        let scriptAdd = document.createElement('script');
        scriptAdd.id = 'fake-time-script';
        scriptAdd.innerHTML = content;
        document.head.append(scriptAdd);
      }, fakeTimeScriptContent)
    
      /** On dispatch l'event au startup config pour lui dire qu'on est prêt */
      await page.evaluate(() => {
        window.addEventListener('setup-ready', function() {
          window.dispatchEvent(new CustomEvent('polly-ready'));
        } , false);
        let event = new CustomEvent('polly-ready');
        window.dispatchEvent(event);
      })
    });
  }
}

module.exports = PageService