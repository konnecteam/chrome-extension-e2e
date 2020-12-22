
import { LineBlockModel } from '../models/line-block-model';
import { Block } from './block';
import 'jest';

describe('Test de la classe Block', function () {

  test('Test récupération des lignes', function () {
    const lineModelResult : LineBlockModel[] = [
      {frameId: 0, type: 'click', value: 'ligne1' },
    ];
    const block = new Block(
      0, {frameId: 0, type: 'click', value: 'ligne1' }
    );
    expect(lineModelResult).toEqual(block.getLines());
  });

  test('Test ajout de ligne au top du block', function () {
    const lineModelResult : LineBlockModel[] = [
      {frameId: 0, type: 'click', value: 'ligne1' },
      {frameId: 0, type: 'change', value: 'ligne2' },
    ];

    const block = new Block(0,
      {frameId: 0, type: 'change', value: 'ligne2'}
    );
    block.addLineToTop({frameId: 0, type: 'click', value: 'ligne1' });

    expect(lineModelResult).toEqual(block.getLines());
  });

  test('Test ajout de ligne à la suteste dans un block', function () {
    const lineModelResult : LineBlockModel[] = [
      {frameId: 0, type: 'click', value: 'ligne1' },
      {frameId: 0, type: 'change', value: 'ligne2' },
    ];

    const block = new Block(0,
      {frameId: 0, type: 'click', value: 'ligne1' }
    );
    block.addLine({frameId: 0, type: 'change', value: 'ligne2' });

    expect(lineModelResult).toEqual(block.getLines());
  });
});