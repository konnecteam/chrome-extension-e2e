import { ScrollBlockFactory } from './scroll-block-factory';
import { Block } from './../../../code-generator/block';
import 'jest';

describe('Test de Scroll Block factory', () => {

  test('Build un scroll', () => {

    /** Attribut d'un IMessage */
    const frame = 'page';
    const frameId = 0;
    const scrollX = 150;
    const scrollY = 200;

    const excpetedResult = new Block(frameId);
    excpetedResult.addLine({
      type: 'scroll',
      value: ` await ${frame}.evaluate( async function(){
        window.scroll(${scrollX}, ${scrollY});
        return Promise.resolve('finish');
      });`
    });

    expect(
      ScrollBlockFactory.buildScroll(
        frame,
        frameId,
        scrollX,
        scrollY
      )
    ).toEqual(
      excpetedResult
    );
  });
});