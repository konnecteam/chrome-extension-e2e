const UrlService = require("./url-service");

/**
 * Class qui contient le har et la map des requêtes du scénario
 */
class RequestInstance {
  constructor() {
    this.harContent = '';
    this.mapRequests = new Map();
  }

  /** Met à jour le contenu du har et la map */
  setHarContent(harContent) {
    this.harContent = harContent;
    const jsonHAR = JSON.parse(harContent);
    this.mapRequests = this.getRequestMap(jsonHAR);
  }

 /**
  * A partir du json des requêtes on récupère une Map
  * @param {*} jsonHAR 
  * @returns 
  */
  getRequestMap(jsonHAR) {
    let requestMap = new Map();
    for (let index = 0; index < jsonHAR.log.entries.length; index++) {
      const req = jsonHAR.log.entries[index];
      let url = UrlService.deleteDateTime(req.request.url);
      if (requestMap.get(url)) {
        let hashmapReq = requestMap.get(url);
        hashmapReq.listReq.push({ request: req.request, response: req.response });
        hashmapReq.order++;
        requestMap.set(url, hashmapReq);
      }
      else {
        requestMap.set(url, { listReq: [{ request: req.request, response: req.response }], order: 0, currentOrder: 0 });
      }
    }
    return requestMap;
  }
}
/**
 * Classe qui permet de faire le singleton
 */
class RequestService {
  constructor() {
      throw new Error('Use RequestService.getInstance()');
  }
  static getInstance() {
      if (!RequestService.instance) {
        RequestService.instance = new RequestInstance();
      }
      return RequestService.instance;
  }
}
module.exports = RequestService;