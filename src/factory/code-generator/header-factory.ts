import { RegExpFactory } from '../../factory/regexp/regexp-factory';
import HeaderCode from '../../constants/code-generate/header-code';
/**
 * Factory qui génère le header du scénario
 */
export class HeaderFactory {

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
    let hdr = wrapAsync ? HeaderCode.wrappedHeader : HeaderCode.header;
    hdr = headless ? hdr : hdr.replace('launch()', 'launch({ headless: false })');

    if (recordHttpRequest) {
      hdr = hdr.replace('launch()', 'launch({ignoreHTTPSErrors: true})');
      hdr = hdr.replace('headless: false', 'headless: false, ignoreHTTPSErrors: true');

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
          addRegexHTTP = HeaderCode.listenerPage.replace(
            '**httpregex**',
            `&& !new RegExp(${codeRegExp}).test(url) `);
        }
        // Si il n'y a pas de Regexp alors on remplace par rien
        else {
          addRegexHTTP = HeaderCode.listenerPage.replace('**httpregex**', ``);
        }

        hdr += addRegexHTTP;

      } else {
        hdr += HeaderCode.listenerPage.replace('**httpregex**', ``);
      }

    }
    return importPackage + hdr;
  }

  /**
   * Si on prends en compte les requêtes on rajoute les inputs nécéssaires
   */
  private static getImport(recordHttpRequest : boolean) : string {
    return recordHttpRequest ? HeaderCode.importHTTPrequest : HeaderCode.importPuppeteer;
  }
}