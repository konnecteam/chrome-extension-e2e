import { Block } from '../../../code-generator/block';

/**
 * Génère les blocks liés au scroll
 */
export class ScrollBlockFactory {

  /**
   * Factory qui génère un scroll
   */
  public static buildScroll(frame : string, frameId : number, scrollX : number
    , scrollY : number) : Block {
    const block = new Block(frameId);
    block.addLine({
      type: 'scroll',
      value: ` await ${frame}.evaluate( async function(){
        window.scroll(${scrollX}, ${scrollY});
        return Promise.resolve('finish');
      });`
    });
    return block;
  }
}