import FooterCode from '../../constants/code-generate/footer-code';
/**
 * Facotry qui génère le footer du scénario
 */
export class FooterFactory {
  /**
   * Génère le footer
   */
  public static generateFooter(wrapAsync : boolean) : string {
    return wrapAsync ? FooterCode.wrappedFooter : FooterCode.footer;
  }

}