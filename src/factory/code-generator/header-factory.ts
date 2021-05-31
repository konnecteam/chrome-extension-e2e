import { RegExpFactory } from '../../factory/regexp/regexp-factory';
import HeaderCode from '../../constants/code-generate/header-code';

/**
 * Factory qui génère le header du scénario
 */
export class HeaderFactory {


  /**
   * String à remplacer dans le header
   */
  private static readonly _HTTP_REQUEST_REGEX_KEY = '**httpregex**';
  private static readonly _LAUNCH_KEY = 'launch()';

  /**
   * Génère le header du scénario
   */
  public static generateHeader(
    recordHttpRequest : boolean,
    wrapAsync : boolean,
    headless : boolean,
    httpRegex : string
  ) : string {

    const importPackage = this.getImport(recordHttpRequest);
    let header = wrapAsync ? HeaderCode.WRAPPED_HEADER : HeaderCode.HEADER;
    header = headless ? header : header.replace(this._LAUNCH_KEY, 'launch({ headless: false })');

    let codeRegExp = '';

    // Si les options contiennent un regex alors on la build
    if (httpRegex) {

      // On la build
      const regexObject = RegExpFactory.buildRegexpAndFlag(httpRegex);

      if (regexObject && regexObject.regexp) {
        // On créé les paramètres pour l'objet RegExp

        codeRegExp += `'${regexObject.regexp}'`;
        codeRegExp += regexObject.flag ? `, '${regexObject.flag}'` : '';
      }
    }


    if (recordHttpRequest) {
      header = header.replace(this._LAUNCH_KEY, 'launch({ignoreHTTPSErrors: true})');
      header = header.replace('headless: false', 'headless: false, ignoreHTTPSErrors: true');

      let addHttpRegexp : string;

      // Si il y a une regex on la met
      if (codeRegExp) {

        addHttpRegexp = HeaderCode.LISTENER_PAGE_RECORDED_REQUEST.replace(
            this._HTTP_REQUEST_REGEX_KEY,
            `&& !new RegExp(${codeRegExp}).test(url) `);
      }
      // Si il n'y a pas de Regexp alors on remplace par rien
      else {
        addHttpRegexp = HeaderCode.LISTENER_PAGE_RECORDED_REQUEST.replace(this._HTTP_REQUEST_REGEX_KEY, ``);
      }

      header += addHttpRegexp;

      // Si on une regex et pas l'option de record activé, on utilise le listener de la page pour les requêtes en live
    } else if (codeRegExp) {
      header += HeaderCode.LISTENER_PAGE_LIVE_REQUEST.replace(
        this._HTTP_REQUEST_REGEX_KEY,
        `&& !new RegExp(${codeRegExp}).test(url) `);
    }
    return importPackage + header;
  }

  /**
   * Récupère les imports nécessaire au fonctionnment du scénario
   */
  private static getImport(recordHttpRequest : boolean) : string {
    return recordHttpRequest ? HeaderCode.IMPORT_HTTP_REQUEST : HeaderCode.IMPORT_PUPPETEER;
  }
}