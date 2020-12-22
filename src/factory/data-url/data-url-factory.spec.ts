import 'jest';
import { DataURLFactory } from './data-url-factory';


describe('Test de DataUrl Factory', () => {

  test('Création d\' un data url', () => {
    // Information utilisé pour sa construction
    const mimeType = 'application/zip';
    const dataType = 'base64';
    const content = 'testContent';

    const exceptedResult = `data:${mimeType};${dataType},${content}`;
    const result = DataURLFactory.buildDataURL(mimeType, dataType, content);

    expect(result).toEqual(exceptedResult);
  });
});