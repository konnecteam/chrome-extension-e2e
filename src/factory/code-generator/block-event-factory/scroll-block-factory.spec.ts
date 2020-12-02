import { ScrollBlockFactory } from './scroll-block-factory';
import { Block } from './../../../code-generator/block';
import 'mocha';
import * as assert from 'assert';

it('Test de Scroll Block factory', () => {

  it('Build un scroll', () => {

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

    assert.deepStrictEqual(
      ScrollBlockFactory.buildScroll(
        frame,
        frameId,
        scrollX,
        scrollY
      ),
      excpetedResult
    );
  });
});