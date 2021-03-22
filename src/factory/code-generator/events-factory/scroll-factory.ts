import { Block } from '../../../code-generator/block';

/**
 * Génère qui permet de créér des objets liés au scroll
 */
export class ScrollFactory {

  /**
   * Factory qui génère un scroll
   */
  public static buildScrollBlock(frame : string, frameId : number, scrollX : number
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