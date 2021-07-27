import { ScrollFactory } from './scroll-factory';
import { Block } from '../../../code-generator/block';
import 'jest';

describe('Test de Scroll Block factory', () => {

  test('Build un scroll', () => {

    /** Attribut d'un IMessage */
    const frame = 'page';
    const frameId = 0;
    const scrollX = 150;
    const scrollY = 200;
    const selector = '#test';
    const excpetedResult = new Block(frameId);
    excpetedResult.addLine({
      type : 'scroll',
      value : ` await ${frame}.evaluate( async function(){
        document.querySelector('${selector}').scroll(${scrollX}, ${scrollY});
      });`
    });

    expect(
      ScrollFactory.buildScrollBlock(
        frame,
        frameId,
        selector,
        scrollX,
        scrollY
      )
    ).toEqual(
      excpetedResult
    );
  });
});