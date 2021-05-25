import { UtilityService } from './utility-service';
import 'jest';

describe('Test de Utility Service', () => {

  test('Test d\'un objet qui contient la value', () => {

    const object = { a: 'valueA', b: 'valueB'};
    expect(
      UtilityService.isValueInObject(object, 'valueA')
    ).toBeTruthy();
  });

  test('Test d\'un objet qui ne contient la value', () => {

    const object = { a: 'valueA', b: 'valueB'};
    expect(
      UtilityService.isValueInObject(object, 'v')
    ).toBeFalsy();
  });

  test('Test de string qui est contenu dans un tableau ', () => {

    const value = 'mv64';
    const tab = ['test', 'mv'];
    expect(
      UtilityService.isStringStartInTab(value, tab)
    ).toBeTruthy();
  });

  test('Test de string qui n\'est pas contenu dans un tableau ', () => {

    const value = 'no';
    const tab = ['test', 'mv'];
    expect(
      UtilityService.isStringStartInTab(value, tab)
    ).toBeFalsy();
  });
});