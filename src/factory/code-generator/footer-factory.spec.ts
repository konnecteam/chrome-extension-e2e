import { FooterFactory } from './footer-factory';
import 'mocha';
import * as assert from 'assert';
import footerCode from '../../constants/code-generate/footer-code';

describe('Test de Footer Factory', () => {

  it('Test de generate du footer dans une fonction async', () => {
    assert.strictEqual(FooterFactory.generateFooter(true), footerCode.wrappedFooter);
  });

  it('Test de generate du foter en dehors d\'une fonction async ', () => {
    assert.strictEqual(FooterFactory.generateFooter(false), footerCode.footer);
  });
});