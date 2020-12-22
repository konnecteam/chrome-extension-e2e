import { HeaderFactory } from './header-factory';
import 'jest';
import HeaderCode from '../../constants/code-generate/header-code';
import { RegExpFactory } from '../../factory/regexp/regexp-factory';

/** Attributs d'un OptionModel */
let recordHttpRequest : boolean;
let wrapAsync : boolean;
let headless : boolean;
let regexHttp : string;

/**
 * Permet de reset les paramètres
 */
function resetParamter()  {
  recordHttpRequest = false;
  wrapAsync = false;
  headless = false;
  regexHttp = '';
}

describe('Test du Header Factory', () => {

  describe('Test de generate du header', () => {

    test('Test du header avec en dehors d\'une fonction async', () => {
      resetParamter();
      // Ajout des imports et du header
      let exceptedResult = HeaderCode.importPuppeteer + HeaderCode.header;
      // headless est à false donc on le met à false
      exceptedResult = exceptedResult.replace('launch()', 'launch({ headless: false })');

      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });

    test('Test du header avec une fonction async', () => {
      resetParamter();
      wrapAsync = true;
      // Ajout des imports et du header
      let exceptedResult = HeaderCode.importPuppeteer + HeaderCode.wrappedHeader;
      // headless est à false donc on le met à false
      exceptedResult = exceptedResult.replace('launch()', 'launch({ headless: false })');

      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });

    test('Test du header avec l\'option record http activée', () => {
      resetParamter();
      recordHttpRequest = true;
      // Ajout des imports et du header
      let exceptedResult = HeaderCode.importHTTPrequest + HeaderCode.header;

      // headless est à false donc on le met à false
      exceptedResult = exceptedResult.replace('launch()', 'launch({ headless: false })');
      // Ajout ignoreHTTPSError
      exceptedResult = exceptedResult.replace('headless: false', 'headless: false, ignoreHTTPSErrors: true');

      // On enlève la condition de filtrage des requètes
      exceptedResult += HeaderCode.listenerPage.replace('**httpregex**', ``);

      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });

    test('Test du header avec l\'option headless activée', () => {
      resetParamter();
      headless = true;
      // Ajout des imports et du header
      const exceptedResult = HeaderCode.importPuppeteer + HeaderCode.header;

      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });

    test('Test du header avec une regexp pour le filtrage des requètes http', () => {
      resetParamter();
      recordHttpRequest = true;
      regexHttp = '/.*localhost*./gm';
      // Ajout des imports et du header
      let exceptedResult = HeaderCode.importHTTPrequest + HeaderCode.header;

      // headless est à false donc on le met à false
      exceptedResult = exceptedResult.replace('launch()', 'launch({ headless: false })');
      // Ajout ignoreHTTPSError
      exceptedResult = exceptedResult.replace('headless: false', 'headless: false, ignoreHTTPSErrors: true');

      // on build la regexp de filtrage
      const regexp = RegExpFactory.buildRegeExp(regexHttp);

      // On rajoute la regexp de filtrage
      let codeRegExp = `'${regexp.regexp}'`;
      codeRegExp += `, '${regexp.flags}'`;
      exceptedResult += HeaderCode.listenerPage.replace(
        '**httpregex**',
        `&& !new RegExp(${codeRegExp}).test(url) `
      );

      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });

    test('Test du header avec wrapAsync et headless', () => {
      resetParamter();
      wrapAsync = true;
      headless = true;

      // Ajout des imports et du header
      const exceptedResult = HeaderCode.importPuppeteer + HeaderCode.wrappedHeader;

      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });

    test('Test du header avec wrapAsync, headless et record http request', () => {
      resetParamter();
      wrapAsync = true;
      headless = true;
      recordHttpRequest = true;
      // Ajout des imports et du header
      let exceptedResult = HeaderCode.importHTTPrequest + HeaderCode.wrappedHeader;

      // Ajout ignoreHTTPSError
      exceptedResult = exceptedResult.replace('launch()', 'launch({ignoreHTTPSErrors: true})');

      // On enlève la condition de filtrage des requètes
      exceptedResult += HeaderCode.listenerPage.replace('**httpregex**', ``);
      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });

    test('Test du header avec wrapAsync, headless, record http request et le filtrage des requètes', () => {
      resetParamter();
      wrapAsync = true;
      headless = true;
      recordHttpRequest = true;
      regexHttp = '/*.localhost*./gm';
      // Ajout des imports et du header
      let exceptedResult = HeaderCode.importHTTPrequest + HeaderCode.wrappedHeader;

      // Ajout ignoreHTTPSError
      exceptedResult = exceptedResult.replace('launch()', 'launch({ignoreHTTPSErrors: true})');
      const regexp = RegExpFactory.buildRegeExp(regexHttp);

       // On rajoute la regexp de filtrage
      let codeRegExp = `'${regexp.regexp}'`;
      codeRegExp += `, '${regexp.flags}'`;
      exceptedResult += HeaderCode.listenerPage.replace(
           '**httpregex**',
           `&& !new RegExp(${codeRegExp}).test(url) `
       );

      expect(
        HeaderFactory.getHeader(
         recordHttpRequest,
         wrapAsync,
         headless,
         regexHttp
        )
      ).toEqual(
        exceptedResult
      );
    });
  });


});