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
    regexHttp : string
  ) : string {

    const importPackage = this.getImport(recordHttpRequest);
    let header = wrapAsync ? HeaderCode.WRAPPED_HEADER : HeaderCode.HEADER;
    header = headless ? header : header.replace(this._LAUNCH_KEY, 'launch({ headless: false })');

    if (recordHttpRequest) {
      header = header.replace(this._LAUNCH_KEY, 'launch({ignoreHTTPSErrors: true})');
      header = header.replace('headless: false', 'headless: false, ignoreHTTPSErrors: true');

      // Si il y a une regex on la met
      if (regexHttp) {

        // On la build
        const regexpBuild = RegExpFactory.buildRegeExp(regexHttp);
        let addRegexHTTP : string;

        if (regexpBuild && regexpBuild.regexp) {
          // On créé les paramètres pour l'objet RegExp
          let codeRegExp = '';

          codeRegExp += `'${regexpBuild.regexp}'`;
          codeRegExp += regexpBuild.flags ? `, '${regexpBuild.flags}'` : '';
          addRegexHTTP = HeaderCode.LISTENER_PAGE.replace(
            this._HTTP_REQUEST_REGEX_KEY,
            `&& !new RegExp(${codeRegExp}).test(url) `);
        }
        // Si il n'y a pas de Regexp alors on remplace par rien
        else {
          addRegexHTTP = HeaderCode.LISTENER_PAGE.replace(this._HTTP_REQUEST_REGEX_KEY, '');
        }

        header += addRegexHTTP;

      } else {
        header += HeaderCode.LISTENER_PAGE.replace(this._HTTP_REQUEST_REGEX_KEY, '');
      }

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