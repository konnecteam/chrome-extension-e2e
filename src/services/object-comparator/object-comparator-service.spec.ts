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
});