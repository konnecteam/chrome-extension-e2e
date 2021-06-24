import { UtilityService } from './utility-service';
import 'jest';

describe('Test de Utility Service', () => {

  test('Test de string qui inclus les string du tableau ', () => {

    const value = 'test mv';
    const tab = ['test', 'mv'];
    expect(
      UtilityService.isStringInTab(value, tab)
    ).toBeTruthy();
  });


  test('Test de string qui n\'inclus pas les string du tableau ', () => {

    const value = 'mv';
    const tab = ['test', 'mv'];
    expect(
      UtilityService.isStringInTab(value, tab)
    ).toBeFalsy();
  });
});