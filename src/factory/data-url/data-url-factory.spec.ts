import 'mocha';
import * as assert from 'assert';
import { DataURLFactory } from './data-url-factory';


describe('Test de DataUrl Factory', () => {
  it('Création d\' un data url', () => {
    // Information utilisé pour sa construction
    const mimeType = 'application/zip';
    const dataType = 'base64';
    const content = 'testContent';

    const exceptedResult = `data:${mimeType};${dataType},${content}`;
    const result = DataURLFactory.buildDataURL(mimeType, dataType, content);

    assert.strictEqual(result, exceptedResult);
  });
});