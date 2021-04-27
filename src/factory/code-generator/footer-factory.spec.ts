import { FooterFactory } from './footer-factory';
import 'jest';
import footerCode from '../../constants/code-generate/footer-code';

describe('Test de Footer Factory', () => {

  test('Test de generate du footer dans une fonction async', () => {
    expect(FooterFactory.generateFooter(true)).toEqual(footerCode.WRAPPED_FOOTER);
  });

  test('Test de generate du foter en dehors d\'une fonction async ', () => {
    expect(FooterFactory.generateFooter(false)).toEqual(footerCode.FOOTER);
  });
});