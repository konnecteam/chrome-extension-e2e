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
  public static getHeader(
    recordHttpRequest : boolean,
    wrapAsync : boolean,
    headless : boolean,
    regexHttp : string
  ) : string {

    const importPackage = this.getImport(recordHttpRequest);
    let hdr = wrapAsync ? HeaderCode.WRAPPED_HEADER : HeaderCode.HEADER;
    hdr = headless ? hdr : hdr.replace(this._LAUNCH_KEY, 'launch({ headless: false })');

    let codeRegExp = '';

    // Si les options contiennent un regex alors on la build
    if (regexHttp) {

      // On la build
      const regexpBuild = RegExpFactory.buildRegeExp(regexHttp);

      if (regexpBuild && regexpBuild.regexp) {
        // On créé les paramètres pour l'objet RegExp

        codeRegExp += `'${regexpBuild.regexp}'`;
        codeRegExp += regexpBuild.flags ? `, '${regexpBuild.flags}'` : '';
      }
    }


    if (recordHttpRequest) {
      hdr = hdr.replace(this._LAUNCH_KEY, 'launch({ignoreHTTPSErrors: true})');
      hdr = hdr.replace('headless: false', 'headless: false, ignoreHTTPSErrors: true');

      let addRegexHTTP : string;

      // Si il y a une regex on la met
      if (codeRegExp) {

        addRegexHTTP = HeaderCode.LISTENER_PAGE_RECORDED_REQUEST.replace(
            this._HTTP_REQUEST_REGEX_KEY,
            `&& !new RegExp(${codeRegExp}).test(url) `);
      }
      // Si il n'y a pas de Regexp alors on remplace par rien
      else {
        addRegexHTTP = HeaderCode.LISTENER_PAGE_RECORDED_REQUEST.replace(this._HTTP_REQUEST_REGEX_KEY, ``);
      }

      hdr += addRegexHTTP;

      // Si on une regex et pas l'option de record activé, on utilise le listener de la page pour les requêtes en live
    } else if (codeRegExp) {
      hdr += HeaderCode.LISTENER_PAGE_LIVE_REQUEST.replace(
        this._HTTP_REQUEST_REGEX_KEY,
        `&& !new RegExp(${codeRegExp}).test(url) `);
    }

    return importPackage + hdr;
  }

  /**
   * Si on prends en compte les requêtes on rajoute les inputs nécéssaires
   */
  private static getImport(recordHttpRequest : boolean) : string {
    return recordHttpRequest ? HeaderCode.IMPORT_HTTP_REQUEST : HeaderCode.IMPORT_PUPPETEER;
  }
}