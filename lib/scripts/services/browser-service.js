/**
 * Service qui permet d'ajouter les handler au browser puppeteer du scénario
 */
 class BrowserService {
  /**
   * Ajouter le un handler pour écouter quand un onglet s'ouvre
   */
  static addTargetCreatedHandler(browser) {

    browser.on('targetcreated', async (target) => {

      if (target.opener()) {
        const pageTarget = await target.page();
        pageTarget.close();
      }
    
    })
  }
}

module.exports = BrowserService