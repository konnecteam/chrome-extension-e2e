import { ObjectComparatorService } from './object-comparator-service';
import 'jest';

describe('Test de Object Comparator Service', () => {

  test('Test d\'un objet qui contient la value', () => {

    const object = { a: 'valueA', b: 'valueB'};
    expect(
      ObjectComparatorService.isValueInObject(object, 'valueA')
    ).toBeTruthy();
  });

  test('Test d\'un objet qui ne contient la value', () => {

    const object = { a: 'valueA', b: 'valueB'};
    expect(
      ObjectComparatorService.isValueInObject(object, 'v')
    ).toBeFalsy();
  });

  test('Test de string qui est contenu dans un tableau ', () => {

    const value = 'mv64';
    const tab = ['test', 'mv'];
    expect(
      ObjectComparatorService.isStringStartInTab(value, tab)
    ).toBeTruthy();
  });

  test('Test de string qui n\'est pas contenu dans un tableau ', () => {

    const value = 'no';
    const tab = ['test', 'mv'];
    expect(
      ObjectComparatorService.isStringStartInTab(value, tab)
    ).toBeFalsy();
  });
});